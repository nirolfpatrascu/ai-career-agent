import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { buildJobMatchPrompt, JOB_MATCH_FALLBACK } from '@/lib/prompts';
import type { JobMatch, ExtractedProfile } from '@/lib/types';

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

    const body = await request.json();
    const { cvText, skills, jobPosting } = body as {
      cvText: string;
      skills: string[];
      jobPosting: string;
    };

    if (!cvText || !jobPosting) {
      return NextResponse.json(
        { error: 'Missing data', message: 'CV text and job posting are required.' },
        { status: 400 }
      );
    }

    if (jobPosting.trim().length < 50) {
      return NextResponse.json(
        { error: 'Invalid posting', message: 'Job posting is too short. Please paste the full posting.' },
        { status: 400 }
      );
    }

    // Build a minimal profile from available data
    const profile: ExtractedProfile = {
      name: 'Candidate',
      currentRole: 'Current Role',
      totalYearsExperience: 0,
      skills: skills.map((s) => ({
        category: 'Skills',
        skills: [s],
        proficiencyLevel: 'intermediate' as const,
      })),
      certifications: [],
      education: [],
      experience: [],
      languages: [],
      summary: '',
    };

    const prompt = buildJobMatchPrompt(profile, cvText, jobPosting);
    const result = await callClaude<JobMatch>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.3,
      fallback: JOB_MATCH_FALLBACK,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: getRateLimitHeaders(ip),
    });
  } catch (error) {
    console.error('[match-job] Error:', error);
    return NextResponse.json(
      { error: 'Match failed', message: 'Job matching analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
