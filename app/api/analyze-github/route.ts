// app/api/analyze-github/route.ts
// POST /api/analyze-github — Fetch GitHub profile + repos, analyze with Claude

import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit } from '@/lib/rate-limit';
import {
  buildGitHubAnalysisPrompt,
  GITHUB_ANALYSIS_FALLBACK,
  type GitHubAnalysis,
  type GitHubUserData,
  type GitHubRepoData,
} from '@/lib/prompts/github-analysis';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

export async function POST(request: NextRequest) {
  try {
    // --- Rate Limiting ---
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(`github-analysis:${ip}`);
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
    const { githubUrl, targetRole, jobPosting, language } = body as {
      githubUrl: string;
      targetRole: string;
      jobPosting?: string;
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

    // Extract username from URL
    const usernameMatch = githubUrl.match(/github\.com\/([a-zA-Z0-9-]+)/);
    if (!usernameMatch) {
      return NextResponse.json(
        { error: 'Invalid GitHub URL', message: 'Could not extract username from URL.' },
        { status: 400 }
      );
    }
    const username = usernameMatch[1];

    // --- Fetch GitHub API (no auth, 60 req/hr) ---
    console.log(`[analyze-github] Fetching profile for: ${username}`);

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GapZero' },
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GapZero' },
      }),
    ]);

    if (!userRes.ok) {
      if (userRes.status === 404) {
        return NextResponse.json(
          { error: 'User not found', message: `GitHub user "${username}" not found.` },
          { status: 404 }
        );
      }
      if (userRes.status === 403) {
        return NextResponse.json(
          { error: 'Rate limited', message: 'GitHub API rate limit reached. Please try again in a few minutes.' },
          { status: 429 }
        );
      }
      return NextResponse.json(
        { error: 'GitHub API error', message: 'Failed to fetch GitHub profile.' },
        { status: 502 }
      );
    }

    const user: GitHubUserData = await userRes.json();
    const repos: GitHubRepoData[] = reposRes.ok ? await reposRes.json() : [];

    // --- Call Claude ---
    console.log(`[analyze-github] Analyzing ${username}: ${repos.length} repos, target: ${targetRole}`);

    const prompt = buildGitHubAnalysisPrompt({ user, repos, targetRole, jobPosting, language });
    const analysis = await callClaude<GitHubAnalysis>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.3,
      fallback: GITHUB_ANALYSIS_FALLBACK,
    });

    console.log(`[analyze-github] Analysis complete: ${analysis.strengths?.length || 0} strengths, ${analysis.improvements?.length || 0} improvements`);

    return NextResponse.json({ analysis }, { status: 200 });
  } catch (error) {
    console.error('[analyze-github] Error:', error);
    return NextResponse.json(
      { error: 'Analysis failed', message: 'Failed to analyze GitHub profile. Please try again.' },
      { status: 500 }
    );
  }
}
