// app/api/analyze-upwork/route.ts
// POST /api/analyze-upwork — Analyze an Upwork profile and provide optimization advice

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import {
  buildUpworkAnalysisPrompt,
  UPWORK_ANALYSIS_FALLBACK,
} from '@/lib/prompts/upwork-analysis';
import type { UpworkProfile, UpworkProfileAnalysis } from '@/lib/types';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Auth ---
    const { client, userId } = await getAuthenticatedClient(request);
    if (!client || !userId) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'You must be signed in to analyze your Upwork profile.' },
        { status: 401 }
      );
    }

    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`analyze-upwork:${ip}`);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        {
          error: 'Rate limited',
          message: 'Too many requests. You can analyze up to 5 profiles per hour. Please try again later.',
          resetAt: new Date(rateLimit.resetAt).toISOString(),
        },
        { status: 429 }
      );
    }

    // --- Parse and validate body ---
    const body = await request.json();
    const { profile, targetNiche } = body as {
      profile: UpworkProfile;
      targetNiche?: string;
    };

    if (!profile || typeof profile !== 'object') {
      return NextResponse.json(
        { error: 'Missing profile', message: 'An Upwork profile object is required.' },
        { status: 400 }
      );
    }

    if (!profile.name || typeof profile.name !== 'string' || !profile.name.trim()) {
      return NextResponse.json(
        { error: 'Invalid profile', message: 'Profile must include a name.' },
        { status: 400 }
      );
    }

    if (!profile.title || typeof profile.title !== 'string' || !profile.title.trim()) {
      return NextResponse.json(
        { error: 'Invalid profile', message: 'Profile must include a title.' },
        { status: 400 }
      );
    }

    // --- Call Claude to analyze profile ---
    console.log(`[analyze-upwork] Analyzing profile for "${profile.name}" (niche: ${targetNiche || 'general'})...`);

    const prompt = buildUpworkAnalysisPrompt(profile, targetNiche);
    const analysis = await callClaude<UpworkProfileAnalysis>({
      ...prompt,
      maxTokens: 8192,
      temperature: 0.3,
      fallback: UPWORK_ANALYSIS_FALLBACK,
    });

    console.log(`[analyze-upwork] Analysis complete: score ${analysis.overallScore}, ${analysis.profileWeaknesses?.length || 0} weaknesses`);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error('[analyze-upwork] Error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: 'Failed to analyze Upwork profile. Please try again.' },
      { status: 500 }
    );
  }
}
