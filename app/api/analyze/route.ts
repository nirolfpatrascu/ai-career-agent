import { NextRequest, NextResponse } from 'next/server';
import { parsePDF, validatePDFBuffer } from '@/lib/pdf-parser';
import { callClaude, truncateCVText } from '@/lib/claude';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
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
import type {
  CareerQuestionnaire,
  ExtractedProfile,
  AnalysisResult,
  JobMatch,
} from '@/lib/types';
import type { GapAnalysisResult } from '@/lib/prompts/gap-analysis';
import type { CareerPlanResult } from '@/lib/prompts/career-plan';

// Vercel serverless function config
// Free tier: 60s max | Pro: 300s max
export const maxDuration = 300;

export async function POST(request: NextRequest) {
  const startTime = Date.now();

  try {
    // --- Rate Limiting ---
    const ip = getClientIP(request);
    const rateLimit = checkRateLimit(ip);

    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: `Too many requests. You can analyze ${10} CVs per hour. Please try again later.`,
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        {
          status: 429,
          headers: getRateLimitHeaders(ip),
        }
      );
    }

    // --- Parse Form Data ---
    const formData = await request.formData();
    const cvFile = formData.get('cv') as File | null;
    const questionnaireRaw = formData.get('questionnaire') as string | null;

    // Validate CV file
    if (!cvFile) {
      return NextResponse.json(
        { error: 'Missing CV', message: 'Please upload your CV as a PDF file.' },
        { status: 400 }
      );
    }

    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large', message: 'CV must be less than 5MB.' },
        { status: 413 }
      );
    }

    if (cvFile.type !== 'application/pdf') {
      return NextResponse.json(
        { error: 'Invalid file type', message: 'Only PDF files are accepted.' },
        { status: 415 }
      );
    }

    // Validate questionnaire
    if (!questionnaireRaw) {
      return NextResponse.json(
        { error: 'Missing questionnaire', message: 'Please complete the career questionnaire.' },
        { status: 400 }
      );
    }

    let questionnaire: CareerQuestionnaire;
    try {
      questionnaire = JSON.parse(questionnaireRaw);
    } catch {
      return NextResponse.json(
        { error: 'Invalid questionnaire', message: 'Questionnaire data is malformed.' },
        { status: 400 }
      );
    }

    // Validate required fields
    const requiredFields: (keyof CareerQuestionnaire)[] = [
      'currentRole',
      'targetRole',
      'yearsExperience',
      'country',
      'workPreference',
    ];

    for (const field of requiredFields) {
      if (!questionnaire[field]) {
        return NextResponse.json(
          { error: 'Missing field', message: `${field} is required.` },
          { status: 400 }
        );
      }
    }

    // --- Parse PDF ---
    console.log('[analyze] Parsing PDF...');
    const buffer = Buffer.from(await cvFile.arrayBuffer());

    if (!validatePDFBuffer(buffer)) {
      return NextResponse.json(
        { error: 'Invalid PDF', message: 'The uploaded file is not a valid PDF document.' },
        { status: 415 }
      );
    }

    const parsedPDF = await parsePDF(buffer);
    const cvText = truncateCVText(parsedPDF.text);

    console.log(
      `[analyze] PDF parsed: ${parsedPDF.pageCount} pages, ${cvText.length} chars`
    );

    // --- Step 1: Extract Skills & Profile ---
    console.log('[analyze] Step 1: Extracting skills and profile...');
    const extractionPrompt = buildSkillExtractionPrompt(cvText, questionnaire);
    const profile = await callClaude<ExtractedProfile>({
      ...extractionPrompt,
      maxTokens: 4096,
      temperature: 0.2,
      fallback: EXTRACTION_FALLBACK,
    });

    console.log(
      `[analyze] Profile extracted: ${profile.skills.length} skill categories, ${profile.experience.length} experiences`
    );

    // --- Steps 2 & 3: Run gap analysis first, then career plan ---
    // Gap analysis must complete first since career plan needs gaps + roles as input
    console.log('[analyze] Step 2: Gap analysis and role recommendations...');
    const gapPrompt = buildGapAnalysisPrompt(profile, questionnaire);
    const gapAnalysis = await callClaude<GapAnalysisResult>({
      ...gapPrompt,
      maxTokens: 6144,
      temperature: 0.3,
      fallback: GAP_ANALYSIS_FALLBACK,
    });

    console.log(
      `[analyze] Gaps: ${gapAnalysis.gaps.length}, Strengths: ${gapAnalysis.strengths.length}, Roles: ${gapAnalysis.roleRecommendations.length}`
    );

    // --- Step 3 + Step 4: Run career plan and job match IN PARALLEL ---
    console.log('[analyze] Step 3+4: Career plan + job match (parallel)...');
    const planPrompt = buildCareerPlanPrompt(
      profile,
      questionnaire,
      gapAnalysis.gaps,
      gapAnalysis.roleRecommendations
    );

    const parallelCalls: [Promise<CareerPlanResult>, Promise<JobMatch | undefined>] = [
      callClaude<CareerPlanResult>({
        ...planPrompt,
        maxTokens: 6144,
        temperature: 0.3,
        fallback: CAREER_PLAN_FALLBACK,
      }),
      questionnaire.jobPosting && questionnaire.jobPosting.trim().length > 50
        ? callClaude<JobMatch>({
            ...buildJobMatchPrompt(profile, cvText, questionnaire.jobPosting),
            maxTokens: 4096,
            temperature: 0.3,
            fallback: JOB_MATCH_FALLBACK,
          })
        : Promise.resolve(undefined),
    ];

    const [careerPlan, jobMatchResult] = await Promise.all(parallelCalls);

    console.log(
      `[analyze] Plan: ${careerPlan.actionPlan.thirtyDays.length} + ${careerPlan.actionPlan.ninetyDays.length} + ${careerPlan.actionPlan.twelveMonths.length} actions`
    );

    if (jobMatchResult) {
      console.log(`[analyze] Job match score: ${jobMatchResult.matchScore}%`);
    }

    // --- Assemble Final Result ---
    const result: AnalysisResult = {
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
      salaryAnalysis: careerPlan.salaryAnalysis,
      ...(jobMatchResult && { jobMatch: jobMatchResult }),
    };

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`[analyze] Complete in ${totalTime}s`);

    // Sanitize all strings to remove Unicode special chars
    const sanitized = sanitizeResult(result);

    return NextResponse.json(sanitized, {
      status: 200,
      headers: {
        ...getRateLimitHeaders(ip),
        'X-Analysis-Time': `${totalTime}s`,
      },
    });
  } catch (error) {
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.error(`[analyze] Error after ${totalTime}s:`, error);

    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Could not extract')) {
        return NextResponse.json(
          {
            error: 'Unreadable PDF',
            message: error.message,
          },
          { status: 422 }
        );
      }

      if (error.message.includes('ANTHROPIC_API_KEY')) {
        return NextResponse.json(
          {
            error: 'Configuration error',
            message: 'The AI service is not properly configured. Please contact support.',
          },
          { status: 500 }
        );
      }

      if (error.message.includes('credit balance')) {
        return NextResponse.json(
          {
            error: 'Service unavailable',
            message: 'The AI service is temporarily unavailable. Please try again later.',
          },
          { status: 503 }
        );
      }

      if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
        return NextResponse.json(
          {
            error: 'Timeout',
            message: 'The analysis took too long. This can happen with very detailed CVs. Please try again.',
          },
          { status: 504 }
        );
      }
    }

    // Generic error
    return NextResponse.json(
      {
        error: 'Analysis failed',
        message:
          'Something went wrong during the analysis. Please try again. If the problem persists, your CV might be in an unsupported format.',
      },
      { status: 500 }
    );
  }
}

/**
 * Extract client IP from request headers (works with Vercel, Cloudflare, etc.)
 */
function getClientIP(request: NextRequest): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    request.headers.get('cf-connecting-ip') ||
    'unknown'
  );
}
