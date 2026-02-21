// app/api/parse-upwork/route.ts
// POST /api/parse-upwork — Parse raw Upwork profile text into structured data

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  buildUpworkProfileParsePrompt,
  UPWORK_PROFILE_PARSE_FALLBACK,
} from '@/lib/prompts/upwork-profile';
import type { UpworkProfile } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`parse-upwork:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Too many requests. You can parse up to 10 profiles per hour. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = await request.json();
    const { profileText } = body as { profileText: string };

    if (!profileText || typeof profileText !== 'string') {
      return NextResponse.json(
        { error: 'Missing profile text', message: 'profileText is required and must be a string.' },
        { status: 400 }
      );
    }

    if (profileText.trim().length < 100) {
      return NextResponse.json(
        { error: 'Profile too short', message: 'Profile text must be at least 100 characters.' },
        { status: 400 }
      );
    }

    if (profileText.length > 50000) {
      return NextResponse.json(
        { error: 'Profile too long', message: 'Profile text must be 50,000 characters or fewer.' },
        { status: 400 }
      );
    }

    // --- Call Claude to parse profile ---
    console.log(`[parse-upwork] Parsing profile (${profileText.length} chars)...`);

    const prompt = buildUpworkProfileParsePrompt(profileText);
    const profile = await callClaude<UpworkProfile>({
      ...prompt,
      maxTokens: 8192,
      temperature: 0.2,
      fallback: UPWORK_PROFILE_PARSE_FALLBACK,
    });

    console.log(`[parse-upwork] Profile parsed: ${profile.name || 'unknown'}, ${profile.skills?.length || 0} skills`);

    return NextResponse.json({ profile }, { status: 200 });
  } catch (error) {
    console.error('[parse-upwork] Error:', error);
    return NextResponse.json(
      { error: 'Parse failed', message: 'Failed to parse Upwork profile. Please try again.' },
      { status: 500 }
    );
  }
}
