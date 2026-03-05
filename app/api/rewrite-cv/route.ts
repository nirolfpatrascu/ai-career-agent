import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { buildCVRewritePrompt, CV_REWRITE_FALLBACK } from '@/lib/prompts';
import { buildKnowledgeContext } from '@/lib/knowledge';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { checkQuota, incrementQuota } from '@/lib/quota';
import type { CVRewriteResult } from '@/lib/prompts/cv-rewriter';
import type { Gap } from '@/lib/types';

export const maxDuration = 30;

export async function POST(request: NextRequest) {
  try {
    // Rate limiting
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limited', message: 'Too many requests. Please try again later.' },
        { status: 429, headers: getRateLimitHeaders(ip) }
      );
    }

    // Quota check
    const { client: authClient, userId } = await getAuthenticatedClient(request);
    if (authClient && userId) {
      const quotaCheck = await checkQuota(authClient, userId, 'cv_generation');
      if (!quotaCheck.allowed) {
        return NextResponse.json(
          {
            error: 'Quota exceeded',
            message: 'You have used all your CV generations for this week. Upgrade to Pro for 10 weekly generations.',
            quota: { used: quotaCheck.used, limit: quotaCheck.limit, resetAt: quotaCheck.resetAt },
          },
          { status: 403 }
        );
      }
    }

    const body = await request.json();
    const { cvText, targetRole, gaps, jobPosting } = body as {
      cvText: string;
      targetRole: string;
      gaps: Gap[];
      jobPosting?: string;
    };

    if (!cvText || !targetRole) {
      return NextResponse.json(
        { error: 'Missing data', message: 'CV text and target role are required.' },
        { status: 400 }
      );
    }

    // Build knowledge context for CV rewriting best practices
    const knowledge = buildKnowledgeContext({
      currentRole: targetRole,
      targetRole,
      yearsExperience: 5,
      country: 'US',
      workPreference: 'remote',
    });
    const prompt = buildCVRewritePrompt(cvText, targetRole, gaps || [], jobPosting, knowledge.forCVRewrite);
    const result = await callClaude<CVRewriteResult>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.4,
      fallback: CV_REWRITE_FALLBACK,
    });

    // Increment quota on success
    if (authClient && userId) {
      try { await incrementQuota(authClient, userId, 'cv_generation'); } catch { /* fail silently */ }
    }

    return NextResponse.json(result, {
      status: 200,
      headers: getRateLimitHeaders(ip),
    });
  } catch (error) {
    console.error('[rewrite-cv] Error:', error);
    return NextResponse.json(
      { error: 'Rewrite failed', message: 'CV rewrite generation failed. Please try again.' },
      { status: 500 }
    );
  }
}
