import { NextRequest } from 'next/server';
import { parsePDF, validatePDFBuffer } from '@/lib/pdf-parser';
import { callClaude, truncateCVText } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { sanitizeResult } from '@/lib/utils';
import {
  buildSkillExtractionPrompt,
  EXTRACTION_FALLBACK,
  buildGapAnalysisPrompt,
  GAP_ANALYSIS_FALLBACK,
  buildCareerPlanPrompt,
  CAREER_PLAN_FALLBACK,
  buildJobMatchPrompt,
  JOB_MATCH_FALLBACK,
} from '@/lib/prompts';
import { buildTranslationPrompt } from '@/lib/prompts/translate';
import { buildKnowledgeContext } from '@/lib/knowledge';
import {
  buildATSKeywordExtractionPrompt,
  buildATSMatchingPrompt,
  computeATSScore,
} from '@/lib/prompts/ats-scoring';
import { analyzeATSFormat } from '@/lib/ats-format-check';
import { lookupCompanyATS, getATSSystemTips } from '@/lib/knowledge/company-ats';
import type {
  CareerQuestionnaire,
  ExtractedProfile,
  AnalysisResult,
  JobMatch,
  ATSScoreResult,
  CompanyATSInfo,
} from '@/lib/types';
import type { GapAnalysisResult } from '@/lib/prompts/gap-analysis';
import type { CareerPlanResult } from '@/lib/prompts/career-plan';

export const maxDuration = 300;

// SSE event helper
function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // --- Validate request upfront before opening stream ---
  const ip = getClientIP(request);
  const rateLimit = checkRateLimit(ip);

  if (!rateLimit.allowed) {
    return new Response(
      JSON.stringify({
        error: 'Rate limited',
        message: `Too many requests. Please try again later.`,
      }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid request', message: 'Could not parse form data.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const cvFile = formData.get('cv') as File | null;
  const questionnaireRaw = formData.get('questionnaire') as string | null;

  if (!cvFile) {
    return new Response(
      JSON.stringify({ error: 'Missing CV', message: 'Please upload your CV as a PDF file.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (cvFile.size > 5 * 1024 * 1024) {
    return new Response(
      JSON.stringify({ error: 'File too large', message: 'CV must be less than 5MB.' }),
      { status: 413, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (cvFile.type !== 'application/pdf') {
    return new Response(
      JSON.stringify({ error: 'Invalid file type', message: 'Only PDF files are accepted.' }),
      { status: 415, headers: { 'Content-Type': 'application/json' } }
    );
  }

  if (!questionnaireRaw) {
    return new Response(
      JSON.stringify({ error: 'Missing questionnaire', message: 'Please complete the career questionnaire.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  let questionnaire: CareerQuestionnaire;
  try {
    questionnaire = JSON.parse(questionnaireRaw);
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid questionnaire', message: 'Questionnaire data is malformed.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const requiredFields: (keyof CareerQuestionnaire)[] = [
    'currentRole', 'targetRole', 'yearsExperience', 'country', 'workPreference',
  ];
  for (const field of requiredFields) {
    if (!questionnaire[field]) {
      return new Response(
        JSON.stringify({ error: 'Missing field', message: `${field} is required.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }

  // --- All validation passed — open SSE stream ---
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (data: Record<string, unknown>) => {
        try {
          controller.enqueue(encoder.encode(sseEvent(data)));
        } catch {
          // Stream may have been closed by client
        }
      };

      try {
        // --- Parse PDF ---
        send({ step: 'parsing', progress: 5, message: 'Reading your documents...' });

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        if (!validatePDFBuffer(buffer)) {
          send({ step: 'error', message: 'The uploaded file is not a valid PDF document.' });
          controller.close();
          return;
        }

        const parsedPDF = await parsePDF(buffer);
        const cvText = truncateCVText(parsedPDF.text);
        console.log(`[stream] PDF parsed: ${parsedPDF.pageCount} pages, ${cvText.length} chars`);

        // Parse LinkedIn PDF if provided
        const linkedInPdf = formData.get('linkedInPdf') as File | null;
        if (linkedInPdf) {
          try {
            const liBuffer = Buffer.from(await linkedInPdf.arrayBuffer());
            if (validatePDFBuffer(liBuffer)) {
              const liParsed = await parsePDF(liBuffer);
              const liText = truncateCVText(liParsed.text);
              if (liText.length > 100) {
                questionnaire.linkedInProfile = liText;
                console.log(`[stream] LinkedIn PDF parsed: ${liText.length} chars`);
              }
            }
          } catch (e) {
            console.log('[stream] LinkedIn PDF parse failed (non-critical):', e);
          }
        }

        // --- Step 1: Extract Skills ---
        send({ step: 'extraction', progress: 12, message: 'Extracting skills and experience...' });

        const extractionPrompt = buildSkillExtractionPrompt(cvText, questionnaire);
        const profile = await callClaude<ExtractedProfile>({
          ...extractionPrompt,
          maxTokens: 4096,
          temperature: 0.2,
          fallback: EXTRACTION_FALLBACK,
        });
        console.log(`[stream] Profile: ${profile.skills.length} categories, ${profile.experience.length} experiences`);

        // --- Step 2: Gap Analysis ---
        send({ step: 'gap_analysis', progress: 25, message: 'Analyzing skill gaps and matching roles...' });

        // Build knowledge context from curated data
        const knowledge = buildKnowledgeContext(questionnaire);

        const gapPrompt = buildGapAnalysisPrompt(profile, questionnaire, knowledge.forGapAnalysis);
        const gapAnalysis = await callClaude<GapAnalysisResult>({
          ...gapPrompt,
          maxTokens: 6144,
          temperature: 0.3,
          fallback: GAP_ANALYSIS_FALLBACK,
        });
        console.log(`[stream] Gaps: ${gapAnalysis.gaps.length}, Strengths: ${gapAnalysis.strengths.length}`);

        // Send gap analysis data — frontend can start showing results
        send({
          step: 'gap_done',
          progress: 50,
          message: 'Skills analysis complete!',
          data: {
            fitScore: gapAnalysis.fitScore,
            strengths: gapAnalysis.strengths,
            gaps: gapAnalysis.gaps,
            roleRecommendations: gapAnalysis.roleRecommendations,
          },
        });

        // --- Step 3+4: Career Plan + Job Match (parallel) ---
        send({ step: 'career_plan', progress: 55, message: 'Building your career roadmap...' });

        const planPrompt = buildCareerPlanPrompt(
          profile, questionnaire, gapAnalysis.gaps, gapAnalysis.roleRecommendations, knowledge.forCareerPlan
        );

        const hasJobPosting = questionnaire.jobPosting && questionnaire.jobPosting.trim().length > 50;

        const parallelCalls: [Promise<CareerPlanResult>, Promise<JobMatch | undefined>] = [
          callClaude<CareerPlanResult>({
            ...planPrompt,
            maxTokens: 6144,
            temperature: 0.3,
            fallback: CAREER_PLAN_FALLBACK,
          }),
          hasJobPosting
            ? callClaude<JobMatch>({
                ...buildJobMatchPrompt(profile, cvText, questionnaire.jobPosting!),
                maxTokens: 4096,
                temperature: 0.3,
                fallback: JOB_MATCH_FALLBACK,
              })
            : Promise.resolve(undefined),
        ];

        const [careerPlan, jobMatchResult] = await Promise.all(parallelCalls);
        console.log(`[stream] Plan: ${careerPlan.actionPlan.thirtyDays.length}+${careerPlan.actionPlan.ninetyDays.length}+${careerPlan.actionPlan.twelveMonths.length} actions`);

        // Normalize salary currencies
        const salaryAnalysis = careerPlan.salaryAnalysis;
        const currentCur = salaryAnalysis.currentRoleMarket.currency;
        const targetCur = salaryAnalysis.targetRoleMarket.currency;

        if (currentCur !== targetCur) {
          const toEur: Record<string, number> = {
            'EUR': 1, 'USD': 0.92, 'GBP': 1.17, 'CHF': 1.05,
            'RON': 0.20, 'PLN': 0.23, 'CZK': 0.04, 'HUF': 0.0025,
            'SEK': 0.088, 'DKK': 0.134, 'NOK': 0.087,
            'CAD': 0.68, 'AUD': 0.60, 'INR': 0.011, 'SGD': 0.69,
            'JPY': 0.0062, 'BRL': 0.17,
          };
          const fromRate = toEur[currentCur] || 1;
          const toRate = toEur[targetCur] || 1;
          const conversionRate = fromRate / toRate;

          salaryAnalysis.currentRoleMarket.low = Math.round(salaryAnalysis.currentRoleMarket.low * conversionRate);
          salaryAnalysis.currentRoleMarket.mid = Math.round(salaryAnalysis.currentRoleMarket.mid * conversionRate);
          salaryAnalysis.currentRoleMarket.high = Math.round(salaryAnalysis.currentRoleMarket.high * conversionRate);
          salaryAnalysis.currentRoleMarket.currency = targetCur;
          salaryAnalysis.currentRoleMarket.region = salaryAnalysis.currentRoleMarket.region.replace(
            /\(gross annual\)/, `(converted to ${targetCur}, gross annual)`
          );
        }

        // Send career plan data
        send({
          step: 'plan_done',
          progress: 80,
          message: 'Career plan ready!',
          data: {
            actionPlan: careerPlan.actionPlan,
            salaryAnalysis: salaryAnalysis,
            ...(jobMatchResult && { jobMatch: jobMatchResult }),
          },
        });

        // --- Step 5: ATS Scoring (if job posting provided) ---
        let atsScoreResult: ATSScoreResult | undefined;
        if (hasJobPosting) {
          send({ step: 'ats', progress: 82, message: 'Scoring ATS compatibility...' });

          try {
            // Extract keywords from job posting
            const extractionPrompt = buildATSKeywordExtractionPrompt(questionnaire.jobPosting!);

            interface ExtractionResult {
              keywords: Array<{ keyword: string; category: string; importance: string; variants: string[] }>;
              roleLevel: string;
              domain: string;
            }

            const extraction = await callClaude<ExtractionResult>({
              system: 'You are an expert ATS keyword extraction analyst. Respond with valid JSON only.',
              userMessage: extractionPrompt,
              maxTokens: 4000,
              temperature: 0.1,
              fallback: { keywords: [], roleLevel: 'mid', domain: 'General' },
            });

            if (extraction.keywords.length > 0) {
              // Match keywords against CV
              const matchingPrompt = buildATSMatchingPrompt(cvText, extraction.keywords);

              interface MatchingResult {
                matches: Array<{ keyword: string; category: string; importance: string; status: string; matchedAs?: string; cvSection?: string }>;
                recommendations: Array<{ action: string; section: string; priority: string; keywords: string[]; example?: string }>;
              }

              const matching = await callClaude<MatchingResult>({
                system: 'You are an expert ATS keyword matching engine. Respond with valid JSON only.',
                userMessage: matchingPrompt,
                maxTokens: 6000,
                temperature: 0.1,
                fallback: { matches: [], recommendations: [] },
              });

              // Compute scores
              const { keywordScore, keywords } = computeATSScore(matching.matches);

              // Format analysis
              const formatAnalysis = analyzeATSFormat(
                cvText,
                { numpages: parsedPDF.pageCount },
                buffer.length
              );

              // Company ATS lookup
              let companyATS: CompanyATSInfo | undefined;
              const companyPatterns = [
                /(?:about|join)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+is|\s+—|\s+-|\s*\n)/i,
                /(?:at|@)\s+([A-Z][A-Za-z0-9\s&.]+?)(?:\s+we|\s*,|\s*\n)/i,
                /^([A-Z][A-Za-z0-9\s&.]+?)\s+(?:is hiring|is looking|seeks)/im,
                /company:\s*([A-Za-z0-9\s&.]+)/i,
              ];
              for (const pattern of companyPatterns) {
                const match = questionnaire.jobPosting!.match(pattern);
                if (match?.[1] && match[1].trim().length > 1 && match[1].trim().length < 50) {
                  const atsEntry = lookupCompanyATS(match[1].trim());
                  if (atsEntry) {
                    companyATS = {
                      company: atsEntry.company,
                      atsSystem: atsEntry.atsSystem,
                      tips: [...atsEntry.tips, ...getATSSystemTips(atsEntry.atsSystem)],
                    };
                    break;
                  }
                }
              }

              // Blend scores (80% keyword, 20% format)
              const overallScore = Math.round(keywordScore * 0.8 + formatAnalysis.formatScore * 0.2);

              atsScoreResult = {
                overallScore,
                keywordScore,
                formatScore: formatAnalysis.formatScore,
                keywords,
                formatIssues: formatAnalysis.issues,
                recommendations: (matching.recommendations || []).map((r) => ({
                  action: r.action,
                  section: r.section,
                  priority: r.priority as 'critical' | 'high' | 'medium',
                  keywords: r.keywords,
                  example: r.example,
                })),
                companyATS,
              };

              console.log(`[stream] ATS score: ${overallScore}% (keyword: ${keywordScore}%, format: ${formatAnalysis.formatScore}%)`);
            }
          } catch (e) {
            console.log('[stream] ATS scoring failed (non-critical):', e);
          }
        }

        // --- Assemble full result ---
        let result: AnalysisResult = {
          metadata: {
            analyzedAt: new Date().toISOString(),
            cvFileName: cvFile.name,
            targetRole: questionnaire.targetRole,
            country: questionnaire.country,
          },
          fitScore: gapAnalysis.fitScore,
          strengths: gapAnalysis.strengths,
          gaps: gapAnalysis.gaps,
          roleRecommendations: gapAnalysis.roleRecommendations,
          actionPlan: careerPlan.actionPlan,
          salaryAnalysis: salaryAnalysis,
          ...(jobMatchResult && { jobMatch: jobMatchResult }),
          ...(atsScoreResult && { atsScore: atsScoreResult }),
        };

        // --- Post-processing Translation ---
        const language = questionnaire.language || 'en';
        if (language !== 'en') {
          send({ step: 'translating', progress: 85, message: 'Translating your report...' });

          try {
            const translationPrompt = buildTranslationPrompt(
              JSON.stringify(result),
              language
            );
            const translated = await callClaude<AnalysisResult>({
              ...translationPrompt,
              maxTokens: 16384,
              temperature: 0.1,
              fallback: result,
            });

            if (translated.fitScore && translated.strengths && translated.gaps) {
              result = translated;
              console.log(`[stream] Translation to ${language} complete`);
            } else {
              console.log('[stream] Translation invalid structure, using English');
            }
          } catch (e) {
            console.log('[stream] Translation failed, using English:', e);
          }
        }

        // Sanitize and send final result
        const sanitized = sanitizeResult(result);
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        console.log(`[stream] Complete in ${totalTime}s`);

        send({
          step: 'complete',
          progress: 100,
          message: 'Analysis complete!',
          data: sanitized,
          totalTime,
        });

      } catch (error) {
        const msg = error instanceof Error ? error.message : 'Something went wrong. Please try again.';
        console.error('[stream] Error:', msg);
        send({ step: 'error', message: msg });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}

function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
