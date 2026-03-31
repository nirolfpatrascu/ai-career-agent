// app/api/analyze-github/route.ts
// POST /api/analyze-github — Fetch GitHub profile + repos, analyze with Claude

import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit } from '@/lib/rate-limit';
import { analyzeGitHubProfile } from '@/lib/github-analyzer';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = await checkRateLimit(`github-analysis:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Too many requests. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = await request.json();
    const { githubUrl, targetRole, language } = body as {
      githubUrl: string;
      targetRole: string;
      language?: string;
    };

    if (!githubUrl || typeof githubUrl !== 'string') {
      return NextResponse.json(
        { error: 'Missing GitHub URL', message: 'A GitHub profile URL is required.' },
        { status: 400 }
      );
    }

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json(
        { error: 'Missing target role', message: 'Target role is required.' },
        { status: 400 }
      );
    }

    // --- Analyze using shared function ---
    const analysis = await analyzeGitHubProfile({ githubUrl, targetRole, language });

    if (!analysis) {
      return NextResponse.json(
        { error: 'Analysis failed', message: 'Could not analyze GitHub profile. The user may not exist or GitHub rate limit was reached.' },
        { status: 502 }
      );
    }

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error('[analyze-github] Error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: 'Failed to analyze GitHub profile. Please try again.' },
      { status: 500 }
    );
  }
}
