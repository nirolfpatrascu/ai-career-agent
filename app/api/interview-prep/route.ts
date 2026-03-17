// app/api/interview-prep/route.ts
// POST /api/interview-prep — Generate personalized interview preparation kit

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { buildInterviewPrepPrompt, INTERVIEW_PREP_FALLBACK } from '@/lib/prompts/interview-prep';
import { checkRateLimit } from '@/lib/rate-limit';
import type { MissingSkill, Strength, Gap, ExperienceItem } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 120;

export async function POST(request: NextRequest) {
  try {
    // --- Rate limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`interview-prep:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limited', message: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    // --- Parse body ---
    const body = await request.json();
    const {
      targetRole,
      jobPosting,
      matchingSkills,
      missingSkills,
      strengths,
      gaps,
      profileSummary,
      experienceHighlights,
      language,
    } = body as {
      targetRole: string;
      jobPosting: string;
      matchingSkills: string[];
      missingSkills: MissingSkill[];
      strengths: Strength[];
      gaps: Gap[];
      profileSummary?: string;
      experienceHighlights?: Pick<ExperienceItem, 'title' | 'company' | 'highlights'>[];
      language?: string;
    };

    if (!targetRole || typeof targetRole !== 'string') {
      return NextResponse.json({ error: 'targetRole is required' }, { status: 400 });
    }
    if (!jobPosting || typeof jobPosting !== 'string') {
      return NextResponse.json({ error: 'jobPosting is required' }, { status: 400 });
    }

    // --- Build prompt and call Claude ---
    const prompt = buildInterviewPrepPrompt({
      targetRole,
      jobPosting,
      matchingSkills: matchingSkills ?? [],
      missingSkills: missingSkills ?? [],
      strengths: strengths ?? [],
      gaps: gaps ?? [],
      profileSummary,
      experienceHighlights,
      language,
    });

    const prep = await callClaude({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.4,
      fallback: INTERVIEW_PREP_FALLBACK,
      maxRetries: 1,
    });

    return NextResponse.json({ prep }, { status: 200 });
  } catch (error) {
    console.error('[interview-prep] Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interview prep', message: 'Please try again.' },
      { status: 500 }
    );
  }
}
