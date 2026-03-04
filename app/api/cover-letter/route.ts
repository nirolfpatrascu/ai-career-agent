// app/api/cover-letter/route.ts
// POST /api/cover-letter — Generate a generic cover letter for a job application

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  buildCoverLetterPrompt,
  COVER_LETTER_FALLBACK,
  type CoverLetter,
} from '@/lib/prompts/cover-letter';
import type { AnalysisResult } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`generic-cover-letter:${ip}`);
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
    const { analysis, jobPosting, tone, language } = body as {
      analysis: AnalysisResult;
      jobPosting: string;
      tone?: 'professional' | 'conversational' | 'bold';
      language?: string;
    };

    if (!analysis || typeof analysis !== 'object') {
      return NextResponse.json(
        { error: 'Missing analysis', message: 'Analysis result is required.' },
        { status: 400 }
      );
    }

    if (!jobPosting || typeof jobPosting !== 'string' || !jobPosting.trim()) {
      return NextResponse.json(
        { error: 'Missing job posting', message: 'Job posting text is required.' },
        { status: 400 }
      );
    }

    // --- Call Claude ---
    console.log(`[cover-letter] Generating (tone: ${tone || 'professional'}, lang: ${language || 'en'})...`);

    const prompt = buildCoverLetterPrompt({ analysis, jobPosting, tone, language });
    const coverLetter = await callClaude<CoverLetter>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.4,
      fallback: COVER_LETTER_FALLBACK,
    });

    console.log(`[cover-letter] Generated: ${coverLetter.bodyParagraphs?.length || 0} body paragraphs`);

    return NextResponse.json({ coverLetter }, { status: 200 });
  } catch (error) {
    console.error('[cover-letter] Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', message: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    );
  }
}
