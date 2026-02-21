// app/api/generate-cover-letter/route.ts
// POST /api/generate-cover-letter — Generate an Upwork cover letter for a job posting

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import {
  buildUpworkCoverLetterPrompt,
  UPWORK_COVER_LETTER_FALLBACK,
} from '@/lib/prompts/upwork-cover-letter';
import type { UpworkJobPosting, UpworkProfile, UpworkCoverLetter } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Auth ---
    const { client, userId } = await getAuthenticatedClient(request);
    if (!client || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be signed in to generate cover letters.' },
        { status: 401 }
      );
    }

    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`cover-letter:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Too many requests. You can generate up to 10 cover letters per hour. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = await request.json();
    const { jobPosting, profile, cvText, tone, language } = body as {
      jobPosting: UpworkJobPosting;
      profile?: UpworkProfile;
      cvText?: string;
      tone?: 'professional' | 'conversational' | 'bold';
      language?: string;
    };

    // Validate jobPosting
    if (!jobPosting || typeof jobPosting !== 'object') {
      return NextResponse.json(
        { error: 'Missing job posting', message: 'A job posting object is required.' },
        { status: 400 }
      );
    }

    if (!jobPosting.title || typeof jobPosting.title !== 'string' || !jobPosting.title.trim()) {
      return NextResponse.json(
        { error: 'Invalid job posting', message: 'Job posting must include a title.' },
        { status: 400 }
      );
    }

    if (!jobPosting.description || typeof jobPosting.description !== 'string' || !jobPosting.description.trim()) {
      return NextResponse.json(
        { error: 'Invalid job posting', message: 'Job posting must include a description.' },
        { status: 400 }
      );
    }

    // Must have either profile or cvText
    if (!profile && (!cvText || typeof cvText !== 'string' || cvText.trim().length === 0)) {
      return NextResponse.json(
        { error: 'Missing candidate data', message: 'Either an Upwork profile or CV text is required to generate a cover letter.' },
        { status: 400 }
      );
    }

    // --- Call Claude to generate cover letter ---
    console.log(`[generate-cover-letter] Generating for "${jobPosting.title}" (tone: ${tone || 'professional'}, lang: ${language || 'en'})...`);

    const prompt = buildUpworkCoverLetterPrompt({ jobPosting, profile, cvText, tone, language });
    const coverLetter = await callClaude<UpworkCoverLetter>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.4,
      fallback: UPWORK_COVER_LETTER_FALLBACK,
    });

    console.log(`[generate-cover-letter] Cover letter generated: ${coverLetter.screeningAnswers?.length || 0} screening answers`);

    return NextResponse.json({ coverLetter }, { status: 200 });
  } catch (error) {
    console.error('[generate-cover-letter] Error:', error);
    return NextResponse.json(
      { error: 'Generation failed', message: 'Failed to generate cover letter. Please try again.' },
      { status: 500 }
    );
  }
}
