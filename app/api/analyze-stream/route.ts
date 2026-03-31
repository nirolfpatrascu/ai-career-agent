import { NextRequest } from 'next/server';
import { parsePDF, validatePDFBuffer } from '@/lib/pdf-parser';
import { parseDOCX, detectDocumentFormat } from '@/lib/docx-parser';
import { callClaude, callClaudeWithSource, truncateCVText, estimateTokens, HAIKU_MODEL, DEFAULT_MODEL_CASCADE } from '@/lib/claude';
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
import { buildTranslationPrompt, extractTranslatableFields, mergeTranslatedFields, type TranslatableFields } from '@/lib/prompts/translate';
import { buildKnowledgeContext } from '@/lib/knowledge';
import { validateAnalysisResult, autoFixResult } from '@/lib/validation';
import { lookupSalary } from '@/lib/salary-lookup';
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
  MissingSkill,
} from '@/lib/types';
import type { GapAnalysisResult } from '@/lib/prompts/gap-analysis';
import type { CareerPlanResult } from '@/lib/prompts/career-plan';
import type { GitHubAnalysis } from '@/lib/prompts/github-analysis';
import { analyzeGitHubProfile } from '@/lib/github-analyzer';
import { buildCoverLetterPrompt, COVER_LETTER_FALLBACK, type CoverLetter } from '@/lib/prompts/cover-letter';
import { buildInterviewPrepPrompt, INTERVIEW_PREP_FALLBACK } from '@/lib/prompts/interview-prep';
import type { InterviewPrep } from '@/lib/types';
import { logger } from '@/lib/logger';
import { MetricsCollector } from '@/lib/metrics';
import { getAuthenticatedClient, getServiceClient } from '@/lib/supabase/server';
import { checkQuota, incrementQuota } from '@/lib/quota';
import { loadGoldenStandard } from '@/lib/golden-standards';

export const maxDuration = 300;

// ============================================================================
// Resource URL fallback — ensures every action item has a clickable link
// ============================================================================

const RESOURCE_DOMAIN_MAP: Record<string, string> = {
  'Udemy': 'https://www.udemy.com/courses/search/?q=',
  'Coursera': 'https://www.coursera.org/search?query=',
  'Pluralsight': 'https://www.pluralsight.com/search?q=',
  'LinkedIn Learning': 'https://www.linkedin.com/learning/search?keywords=',
  'edX': 'https://www.edx.org/search?q=',
  'freeCodeCamp': 'https://www.freecodecamp.org',
  'LeetCode': 'https://leetcode.com',
  'HackerRank': 'https://www.hackerrank.com',
  'Exercism': 'https://exercism.org',
  'MDN': 'https://developer.mozilla.org/en-US/search?q=',
  'AWS Certification': 'https://aws.amazon.com/certification/',
  'Google Cloud': 'https://cloud.google.com/certification',
  'Microsoft Learn': 'https://learn.microsoft.com/certifications/',
  'Stack Overflow': 'https://stackoverflow.com/search?q=',
  'Reddit': 'https://www.reddit.com/search/?q=',
  'dev.to': 'https://dev.to/search?q=',
  'O\'Reilly': 'https://www.oreilly.com/search/?q=',
  'Amazon': 'https://www.amazon.com/s?k=',
  'React': 'https://react.dev/learn',
  'Next.js': 'https://nextjs.org/docs',
  'Kubernetes': 'https://kubernetes.io/docs/',
  'Docker': 'https://docs.docker.com/',
  'Python': 'https://docs.python.org/3/',
  'Terraform': 'https://developer.hashicorp.com/terraform/docs',
};

import type { ActionPlan, ActionItem } from '@/lib/types';

function ensureResourceUrls(plan: ActionPlan): ActionPlan {
  const processItems = (items: ActionItem[]): ActionItem[] => items.map(item => {
    if (item.resourceUrl && item.resourceUrl.startsWith('https://')) return item;
    // Try matching resource name to known domains
    const resourceLower = (item.resource || '').toLowerCase();
    for (const [name, baseUrl] of Object.entries(RESOURCE_DOMAIN_MAP)) {
      if (resourceLower.includes(name.toLowerCase())) {
        const query = encodeURIComponent(item.action.slice(0, 60));
        return { ...item, resourceUrl: baseUrl.includes('?') ? `${baseUrl}${query}` : baseUrl };
      }
    }
    // Last resort: Google search
    const query = encodeURIComponent(`${item.resource} ${item.action.slice(0, 40)}`);
    return { ...item, resourceUrl: `https://www.google.com/search?q=${query}` };
  });
  return {
    thirtyDays: processItems(plan.thirtyDays),
    ninetyDays: processItems(plan.ninetyDays),
    twelveMonths: processItems(plan.twelveMonths),
  };
}

// SSE event helper
function sseEvent(data: Record<string, unknown>): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  // --- Validate request upfront before opening stream ---
  const ip = getClientIP(request);
  const rateLimit = await checkRateLimit(ip);

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

  const ACCEPTED_MIME_TYPES = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/msword',
  ];
  if (!ACCEPTED_MIME_TYPES.includes(cvFile.type)) {
    return new Response(
      JSON.stringify({ error: 'Invalid file type', message: 'Only PDF and Word (.docx) files are accepted.' }),
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

  // Validate string field lengths to prevent oversized inputs
  const stringFields = ['currentRole', 'targetRole', 'country', 'workPreference'] as const;
  for (const field of stringFields) {
    if (typeof questionnaire[field] === 'string' && (questionnaire[field] as string).length > 200) {
      return new Response(
        JSON.stringify({ error: 'Invalid field', message: `${field} exceeds maximum length.` }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
  }
  // Truncate job posting to prevent oversized input to Claude
  if (questionnaire.jobPosting && questionnaire.jobPosting.length > 50000) {
    questionnaire.jobPosting = questionnaire.jobPosting.slice(0, 50000);
  }
  // Truncate additional context to prevent oversized input
  if (questionnaire.additionalContext && questionnaire.additionalContext.length > 2000) {
    questionnaire.additionalContext = questionnaire.additionalContext.slice(0, 2000);
  }

  // --- Require authentication (identity check only — uses user JWT) ---
  const { userId: authUserId } = await getAuthenticatedClient(request);

  if (!authUserId) {
    return new Response(
      JSON.stringify({ error: 'Unauthorized', message: 'Please sign in to run an analysis.' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // --- Quota check (uses service client to bypass RLS) ---
  const serviceClient = getServiceClient();
  let isInitialAnalysis = false;
  try {
    const quotaCheck = await checkQuota(serviceClient, authUserId, 'analysis');
    if (!quotaCheck.allowed) {
      return new Response(
        JSON.stringify({
          error: 'Quota exceeded',
          message: 'You have used all your analyses for this week. Upgrade to Pro for 10 weekly analyses.',
          quota: { used: quotaCheck.used, limit: quotaCheck.limit, resetAt: quotaCheck.resetAt },
        }),
        { status: 403, headers: { 'Content-Type': 'application/json' } }
      );
    }
    isInitialAnalysis = !!quotaCheck.isInitialAnalysis;
  } catch (e) {
    logger.warn('quota.check_failed', { error: e instanceof Error ? e.message : String(e) });
    return new Response(
      JSON.stringify({
        error: 'Service unavailable',
        message: 'Could not verify usage quota. Please try again in a moment.',
      }),
      { status: 503, headers: { 'Content-Type': 'application/json' } }
    );
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

      // 250s deadline — 50s safety margin before Vercel's 300s hard kill.
      // Optional steps (ATS, cover letter, interview prep, translation) are
      // skipped when the deadline is near so core results always reach the client.
      const DEADLINE_MS = 250_000;
      const pastDeadline = () => Date.now() - startTime > DEADLINE_MS;

      const metrics = new MetricsCollector();

      try {
        // --- Parse PDF ---
        send({ step: 'parsing', progress: 5, message: 'Reading your documents...' });
        const endParsing = metrics.startStep('parsing');

        const buffer = Buffer.from(await cvFile.arrayBuffer());
        const docFormat = detectDocumentFormat(buffer);
        if (docFormat === 'unknown') {
          send({ step: 'error', message: 'The uploaded file is not a valid PDF or Word document.' });
          controller.close();
          return;
        }
        if (docFormat === 'pdf' && !validatePDFBuffer(buffer)) {
          send({ step: 'error', message: 'The uploaded file is not a valid PDF document.' });
          controller.close();
          return;
        }

        const parsedPDF = docFormat === 'pdf' ? await parsePDF(buffer) : await parseDOCX(buffer);
        const cvText = truncateCVText(parsedPDF.text);
        logger.debug('pdf.parsed', { pageCount: parsedPDF.pageCount, charCount: cvText.length, quality: parsedPDF.qualityScore });

        if (parsedPDF.qualityWarning) {
          logger.warn('pdf.quality_warning', { warning: parsedPDF.qualityWarning });
        }

        // Reject PDFs with extremely poor text quality
        if (parsedPDF.qualityScore < 25) {
          send({
            step: 'error',
            message:
              'Could not extract readable text from this PDF. ' +
              'The file may be a scanned image or use non-standard fonts. ' +
              'Please upload a text-based PDF.',
          });
          controller.close();
          return;
        }

        // Warn about moderate quality issues but continue analysis
        if (parsedPDF.qualityScore < 60) {
          send({
            step: 'warning',
            message:
              'Some sections of the PDF could not be fully read. ' +
              'Results may be less accurate for poorly extracted sections.',
          });
        }

        // Parse LinkedIn PDF if provided
        const linkedInPdf = formData.get('linkedInPdf') as File | null;
        if (linkedInPdf && linkedInPdf.size <= 5 * 1024 * 1024) {
          try {
            const liBuffer = Buffer.from(await linkedInPdf.arrayBuffer());
            if (validatePDFBuffer(liBuffer)) {
              const liParsed = await parsePDF(liBuffer);
              const liText = truncateCVText(liParsed.text);
              if (liText.length > 100) {
                questionnaire.linkedInProfile = liText;
                logger.debug('linkedin.parsed', { charCount: liText.length });
              }
            }
          } catch (e) {
            logger.warn('linkedin.parse_failed', { error: e instanceof Error ? e.message : String(e) });
          }
        }

        endParsing();

        // --- Load golden standards for AI quality reference ---
        // These are injected into prompts as few-shot quality benchmarks.
        // Loaded async in background — never blocks the pipeline if missing.
        const [goldenCV, goldenCoverLetter] = await Promise.all([
          loadGoldenStandard('cvs', questionnaire.targetRole),
          loadGoldenStandard('coverLetters', questionnaire.targetRole),
        ]);

        // --- Step 1: Extract Skills ---
        send({ step: 'extraction', progress: 12, message: 'Extracting skills and experience...' });
        const endExtraction = metrics.startStep('extraction');

        const dataSources: Record<string, 'claude' | 'fallback'> = {};

        const extractionPrompt = buildSkillExtractionPrompt(cvText, questionnaire);
        const profileResult = await callClaudeWithSource<ExtractedProfile>({
          ...extractionPrompt,
          maxTokens: 4096,
          temperature: 0.0,
          fallback: EXTRACTION_FALLBACK,
          // Extraction is a structured task — Haiku handles it at ~66% lower cost.
          // Falls back to Sonnet if Haiku is unavailable.
          modelCascade: [HAIKU_MODEL, ...DEFAULT_MODEL_CASCADE],
        });
        const profile = profileResult.data;
        dataSources.extraction = profileResult.source;
        endExtraction();
        metrics.recordStepTokens('extraction', estimateTokens(extractionPrompt.system + extractionPrompt.userMessage), estimateTokens(JSON.stringify(profile)), profileResult.source);
        logger.debug('extraction.done', { skillCategories: profile.skills.length, experiences: profile.experience.length, source: profileResult.source });

        // Guard 1: Abort if extraction fell back — pipeline would run on empty profile
        if (profileResult.source === 'fallback') {
          send({
            step: 'error',
            message: 'Could not extract a profile from this CV. This is usually a temporary issue — please wait a moment and try again. If the problem persists, try re-uploading your PDF.',
          });
          controller.close();
          return;
        }

        // Guard 2: Minimum content — catches gibberish PDFs that pass quality check
        const totalSkills = profile.skills.reduce((sum, cat) => sum + cat.skills.length, 0);
        if (totalSkills < 2 && profile.experience.length < 1) {
          send({
            step: 'error',
            message: 'Insufficient CV content detected. The document was readable but contained too little career information to analyze. Please upload a CV with your work experience and skills.',
          });
          controller.close();
          return;
        }

        // --- Step 2: Gap Analysis ---
        send({ step: 'gap_analysis', progress: 25, message: 'Analyzing skill gaps and matching roles...' });
        const endGapAnalysis = metrics.startStep('gap_analysis');

        // Build knowledge context from curated data
        const knowledge = buildKnowledgeContext(questionnaire);

        const gapPrompt = buildGapAnalysisPrompt(profile, questionnaire, knowledge.forGapAnalysis, questionnaire.jobPosting ?? undefined);
        const gapResult = await callClaudeWithSource<GapAnalysisResult>({
          ...gapPrompt,
          maxTokens: 6144,
          temperature: 0.3,
          fallback: GAP_ANALYSIS_FALLBACK,
        });
        const gapAnalysis = gapResult.data;
        dataSources.gapAnalysis = gapResult.source;
        endGapAnalysis();
        metrics.recordStepTokens('gap_analysis', estimateTokens(gapPrompt.system + gapPrompt.userMessage), estimateTokens(JSON.stringify(gapAnalysis)), gapResult.source);
        logger.debug('gap_analysis.done', { gaps: gapAnalysis.gaps.length, strengths: gapAnalysis.strengths.length, source: gapResult.source });

        // Sort role recommendations by fitScore descending so best fit is first
        gapAnalysis.roleRecommendations.sort((a, b) => b.fitScore - a.fitScore);

        // Early fitScore coherence check — cap before sending to frontend
        // Full validation runs later, but gap_done sends scores immediately
        {
          const criticalGaps = gapAnalysis.gaps.filter((g: { severity: string }) => g.severity === 'critical').length;
          const moderateGaps = gapAnalysis.gaps.filter((g: { severity: string }) => g.severity === 'moderate').length;
          let cap: number | null = null;

          if (gapAnalysis.fitScore.score >= 8 && criticalGaps >= 1) {
            cap = criticalGaps >= 3 ? 5 : criticalGaps >= 2 ? 6 : 7;
          } else if (gapAnalysis.fitScore.score >= 9 && moderateGaps >= 3) {
            cap = 8;
          } else if (gapAnalysis.fitScore.score >= 8 && moderateGaps >= 4) {
            cap = 7;
          }

          if (cap !== null && gapAnalysis.fitScore.score > cap) {
            logger.info('gap_done.fitScore_capped', { original: gapAnalysis.fitScore.score, cap, criticalGaps, moderateGaps });
            gapAnalysis.fitScore.score = cap;
            // Update label to match capped score (same logic as deriveFitLabel in validation.ts)
            gapAnalysis.fitScore.label = cap >= 8 ? 'Strong Fit' : cap >= 6 ? 'Moderate Fit' : cap >= 4 ? 'Stretch' : 'Significant Gap';
          }
        }

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
        const endCareerPlan = metrics.startStep('career_plan');

        const planPrompt = buildCareerPlanPrompt(
          profile, questionnaire, gapAnalysis.gaps, gapAnalysis.roleRecommendations, knowledge.forCareerPlan, questionnaire.jobPosting ?? undefined
        );

        const hasJobPosting = questionnaire.jobPosting && questionnaire.jobPosting.trim().length > 50;

        interface ATSExtractionResult {
          keywords: Array<{ keyword: string; category: string; importance: string; variants: string[] }>;
          roleLevel: string;
          domain: string;
        }

        interface ATSMatchingResult {
          matches: Array<{ keyword: string; category: string; importance: string; status: string; matchedAs?: string; cvSection?: string }>;
          recommendations: Array<{ action: string; section: string; priority: string; keywords: string[]; example?: string }>;
        }

        // Run career plan, job match, and GitHub analysis in parallel
        const [careerPlan, jobMatchResult, githubAnalysis] = await Promise.all([
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
                temperature: 0.1,
                fallback: JOB_MATCH_FALLBACK,
              })
            : Promise.resolve(undefined),
          questionnaire.githubUrl
            ? analyzeGitHubProfile({
                githubUrl: questionnaire.githubUrl,
                targetRole: questionnaire.targetRole,
                language: questionnaire.language,
              })
            : Promise.resolve(null),
        ]);
        endCareerPlan();
        metrics.recordStepTokens('career_plan', estimateTokens(planPrompt.system + planPrompt.userMessage), estimateTokens(JSON.stringify(careerPlan)));
        if (jobMatchResult) {
          metrics.recordStepTokens('job_match', estimateTokens(JSON.stringify(questionnaire.jobPosting || '')), estimateTokens(JSON.stringify(jobMatchResult)));
        }
        logger.debug('career_plan.done', { thirtyDays: careerPlan.actionPlan.thirtyDays.length, ninetyDays: careerPlan.actionPlan.ninetyDays.length, twelveMonths: careerPlan.actionPlan.twelveMonths.length });

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

        // --- Post-process action plan URLs ---
        const actionPlan = ensureResourceUrls(careerPlan.actionPlan);

        // --- Step 4a: ATS Keyword Extraction (sequential — heavy Stage 3 calls have finished) ---
        // Skip all optional enrichment steps if we are approaching the 250s deadline.
        const skipOptional = pastDeadline();
        if (skipOptional) {
          logger.warn('pipeline.deadline_reached', { elapsedMs: Date.now() - startTime, skipping: 'ats,cover_letter,interview_prep' });
        }

        let atsExtraction: ATSExtractionResult | null = null;
        if (hasJobPosting && !skipOptional) {
          send({ step: 'ats', progress: 82, message: 'Scoring ATS compatibility...' });
          send({ step: 'cover_letter', progress: 82, message: 'Generating cover letter...' });
          try {
            atsExtraction = await callClaude<ATSExtractionResult>({
              system: 'You are an expert ATS keyword extraction analyst. Respond with valid JSON only.',
              userMessage: buildATSKeywordExtractionPrompt(questionnaire.jobPosting!),
              maxTokens: 4000,
              temperature: 0,
              fallback: { keywords: [], roleLevel: 'mid', domain: 'General' },
              maxRetries: 1,
              // ATS keyword extraction is structured — Haiku is sufficient and ~66% cheaper
              modelCascade: [HAIKU_MODEL, ...DEFAULT_MODEL_CASCADE],
            });
          } catch (e) {
            logger.warn('ats.extraction_failed', { error: e instanceof Error ? e.message : String(e) });
          }
        }

        // --- Step 4b: ATS Matching + Cover Letter (parallel — no dependency between them) ---
        const atsMatchingTask = hasJobPosting && !skipOptional && atsExtraction && atsExtraction.keywords.length > 0
          ? callClaude<ATSMatchingResult>({
              system: 'You are an expert ATS keyword matching engine. Respond with valid JSON only.',
              userMessage: buildATSMatchingPrompt(cvText, atsExtraction.keywords),
              maxTokens: 6000,
              temperature: 0,
              fallback: { matches: [], recommendations: [] },
              maxRetries: 1,
              // ATS matching is keyword-based — Haiku handles it well at ~66% lower cost
              modelCascade: [HAIKU_MODEL, ...DEFAULT_MODEL_CASCADE],
            })
          : Promise.resolve(null as ATSMatchingResult | null);

        const coverLetterTask = hasJobPosting && !skipOptional
          ? callClaude<CoverLetter>({
              ...buildCoverLetterPrompt({
                analysis: {
                  metadata: { analyzedAt: new Date().toISOString(), cvFileName: cvFile.name, targetRole: questionnaire.targetRole, country: questionnaire.country },
                  fitScore: gapAnalysis.fitScore,
                  strengths: gapAnalysis.strengths,
                  gaps: gapAnalysis.gaps,
                  roleRecommendations: gapAnalysis.roleRecommendations,
                  actionPlan,
                  salaryAnalysis,
                  profile,
                },
                jobPosting: questionnaire.jobPosting!,
                tone: 'professional',
                language: questionnaire.language,
                goldenStandard: goldenCoverLetter || undefined,
              }),
              maxTokens: 4096,
              temperature: 0.3,
              fallback: COVER_LETTER_FALLBACK,
              maxRetries: 1,
            }).catch((e: Error) => {
              logger.warn('cover_letter.generation_failed', { error: e.message });
              return undefined as CoverLetter | undefined;
            })
          : Promise.resolve(undefined as CoverLetter | undefined);

        // Run interview prep in parallel with ATS matching + cover letter
        const interviewPrepTask: Promise<InterviewPrep | null> = hasJobPosting && !skipOptional && jobMatchResult
          ? callClaude<InterviewPrep>({
              ...buildInterviewPrepPrompt({
                targetRole: questionnaire.targetRole,
                jobPosting: questionnaire.jobPosting!,
                matchingSkills: (jobMatchResult as { matchingSkills?: string[] }).matchingSkills ?? [],
                missingSkills: ((jobMatchResult as { missingSkills?: MissingSkill[] }).missingSkills ?? []),
                strengths: gapAnalysis.strengths,
                gaps: gapAnalysis.gaps,
                profileSummary: profile.summary,
                experienceHighlights: profile.experience?.slice(0, 3).map(e => ({
                  title: e.title,
                  company: e.company,
                  highlights: e.highlights,
                })),
                language: questionnaire.language,
              }),
              maxTokens: 8192,
              temperature: 0.4,
              fallback: INTERVIEW_PREP_FALLBACK,
              maxRetries: 1,
            }).catch((e: Error) => {
              logger.warn('interview_prep.generation_failed', { error: e.message });
              return null;
            })
          : Promise.resolve(null);

        const [atsMatchingRaw, coverLetterResult, interviewPrepResult] = await Promise.all([atsMatchingTask, coverLetterTask, interviewPrepTask]);

        // Compute ATS score from matching results
        let atsScoreResult: ATSScoreResult | undefined;
        if (hasJobPosting && atsExtraction && atsMatchingRaw) {
          try {
            const { keywordScore, keywords } = computeATSScore(atsMatchingRaw.matches);
            const formatAnalysis = analyzeATSFormat(cvText, { numpages: parsedPDF.pageCount }, buffer.length);

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

            const overallScore = Math.round(keywordScore * 0.8 + formatAnalysis.formatScore * 0.2);
            atsScoreResult = {
              overallScore,
              keywordScore,
              formatScore: formatAnalysis.formatScore,
              keywords,
              formatIssues: formatAnalysis.issues,
              recommendations: (atsMatchingRaw.recommendations || []).map((r) => ({
                action: r.action,
                section: r.section,
                priority: r.priority as 'critical' | 'high' | 'medium',
                keywords: r.keywords,
                example: r.example,
              })),
              companyATS,
            };
            logger.debug('ats.scored', { overallScore, keywordScore, formatScore: formatAnalysis.formatScore });
          } catch (e) {
            logger.warn('ats.scoring_failed', { error: e instanceof Error ? e.message : String(e) });
          }
        }

        // --- Assemble full result ---
        let result: AnalysisResult = {
          metadata: {
            analyzedAt: new Date().toISOString(),
            cvFileName: cvFile.name,
            targetRole: questionnaire.targetRole,
            country: questionnaire.country,
            ...(hasJobPosting && { jobPosting: questionnaire.jobPosting }),
            ...(questionnaire.githubUrl && { githubUrl: questionnaire.githubUrl }),
            ...(parsedPDF.qualityWarning && { pdfQualityWarning: parsedPDF.qualityWarning }),
            dataSources,
          },
          fitScore: gapAnalysis.fitScore,
          strengths: gapAnalysis.strengths,
          gaps: gapAnalysis.gaps,
          roleRecommendations: gapAnalysis.roleRecommendations,
          actionPlan,
          salaryAnalysis: salaryAnalysis,
          profile,
          ...(jobMatchResult && { jobMatch: jobMatchResult }),
          ...(atsScoreResult && { atsScore: atsScoreResult }),
          ...(githubAnalysis && { githubAnalysis }),
          ...(coverLetterResult && { coverLetter: coverLetterResult }),
          ...(interviewPrepResult && { interviewPrep: interviewPrepResult }),
        };

        // --- Post-processing Translation ---
        // Extract only text fields (~75% smaller payload), translate, then merge back.
        // This reduces translation from 30-55s to ~10-15s, preventing Vercel timeouts for non-EN.
        const language = questionnaire.language || 'en';
        if (language !== 'en' && !pastDeadline()) {
          send({ step: 'translating', progress: 85, message: 'Translating your report...' });

          try {
            const fields = extractTranslatableFields(result);
            const translationPrompt = buildTranslationPrompt(fields, language);
            // Use Haiku: 5-10x faster than Sonnet, excellent at translation,
            // no retries — if it fails we gracefully keep the English result.
            const translatedFields = await callClaude<TranslatableFields>({
              ...translationPrompt,
              model: 'claude-haiku-4-5-20251001',
              maxTokens: 8192,
              temperature: 0.1,
              maxRetries: 0,
              fallback: fields,
            });
            result = mergeTranslatedFields(result, translatedFields);
            logger.debug('translation.done', { language });
          } catch (e) {
            logger.warn('translation.failed', { error: e instanceof Error ? e.message : String(e) });
          }
        }

        // --- Record scores for metrics ---
        metrics.recordScores({
          fitScore: result.fitScore.score,
          ...(jobMatchResult && { matchScore: jobMatchResult.matchScore }),
          ...(atsScoreResult && { atsScore: atsScoreResult.overallScore }),
        });

        // --- Validation Layer ---
        const validationReport = validateAnalysisResult(result, lookupSalary);
        if (validationReport.autoFixed > 0) {
          const fixResult = autoFixResult(result, validationReport.issues);
          result = fixResult.result;
          validationReport.autoFixDescriptions = fixResult.descriptions;
          logger.info('validation.auto_fixed', { count: validationReport.autoFixed, descriptions: fixResult.descriptions });
        }
        if (!validationReport.isValid) {
          logger.warn('validation.errors', { errors: validationReport.issues.filter(i => i.severity === 'error') });
        }
        if (validationReport.issues.length > 0) {
          logger.debug('validation.summary', { total: validationReport.issues.length, errors: validationReport.issues.filter(i => i.severity === 'error').length, warnings: validationReport.issues.filter(i => i.severity === 'warning').length });
        }
        // Attach validation metadata for potential UI display
        Object.assign(result, {
          _validation: {
            issueCount: validationReport.issues.length,
            autoFixed: validationReport.autoFixed,
            hasErrors: !validationReport.isValid,
          },
        });

        // Record validation metrics
        metrics.recordValidation({
          totalIssues: validationReport.issues.length,
          errors: validationReport.issues.filter(i => i.severity === 'error').length,
          warnings: validationReport.issues.filter(i => i.severity === 'warning').length,
          autoFixed: validationReport.autoFixed,
        });

        // Increment quota on success (service client bypasses RLS)
        try {
          await incrementQuota(serviceClient, authUserId, 'analysis', isInitialAnalysis);
        } catch (e) {
          logger.warn('quota.increment_failed', { error: e instanceof Error ? e.message : String(e) });
        }

        // Sanitize and send final result
        const sanitized = sanitizeResult(result);
        const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
        logger.info('analysis.complete', { totalTimeSeconds: Number(totalTime) });
        metrics.flush();

        send({
          step: 'complete',
          progress: 100,
          message: 'Analysis complete!',
          data: sanitized,
          totalTime,
        });

      } catch (error) {
        logger.error('analysis.failed', error);
        // Never send raw error messages to client — could leak internal details
        let userMessage = 'Something went wrong during the analysis. Please try again.';
        if (error instanceof Error) {
          if (error.message.includes('Could not extract')) {
            userMessage = 'Unable to extract text from this PDF. It may be scanned or corrupted.';
          } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
            userMessage = 'The analysis took too long. Please try again with a shorter CV.';
          }
        }
        send({ step: 'error', message: userMessage });
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
