// app/api/parse-upwork-job/route.ts
// POST /api/parse-upwork-job — Parse raw Upwork job posting text into structured data

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  buildUpworkJobParsePrompt,
  UPWORK_JOB_PARSE_FALLBACK,
} from '@/lib/prompts/upwork-job-parser';
import type { UpworkJobPosting } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 45;

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`parse-upwork-job:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Too many requests. You can parse up to 20 job postings per hour. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = await request.json();
    const { jobText } = body as { jobText: string };

    if (!jobText || typeof jobText !== 'string') {
      return NextResponse.json(
        { error: 'Missing job text', message: 'jobText is required and must be a string.' },
        { status: 400 }
      );
    }

    if (jobText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Job text too short', message: 'Job posting text must be at least 50 characters.' },
        { status: 400 }
      );
    }

    if (jobText.length > 50000) {
      return NextResponse.json(
        { error: 'Job text too long', message: 'Job posting text must be 50,000 characters or fewer.' },
        { status: 400 }
      );
    }

    // --- Call Claude to parse job posting ---
    console.log(`[parse-upwork-job] Parsing job posting (${jobText.length} chars)...`);

    const prompt = buildUpworkJobParsePrompt(jobText);
    const posting = await callClaude<UpworkJobPosting>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.2,
      fallback: UPWORK_JOB_PARSE_FALLBACK,
    });

    console.log(`[parse-upwork-job] Job parsed: "${posting.title || 'unknown'}", ${posting.skills?.length || 0} skills`);

    return NextResponse.json({ posting }, { status: 200 });
  } catch (error) {
    console.error('[parse-upwork-job] Error:', error);
    return NextResponse.json(
      { error: 'Parse failed', message: 'Failed to parse Upwork job posting. Please try again.' },
      { status: 500 }
    );
  }
}
