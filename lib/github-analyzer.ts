// lib/github-analyzer.ts
// Shared GitHub fetch + analyze function — used by SSE pipeline and /api/analyze-github

import { callClaude } from '@/lib/claude';
import {
  buildGitHubAnalysisPrompt,
  GITHUB_ANALYSIS_FALLBACK,
  type GitHubAnalysis,
  type GitHubUserData,
  type GitHubRepoData,
} from '@/lib/prompts/github-analysis';
import { logger } from '@/lib/logger';

export interface AnalyzeGitHubOptions {
  githubUrl: string;
  targetRole: string;
  jobPosting?: string;
  language?: string;
}

/**
 * Fetch GitHub profile + repos and analyze with Claude.
 * Returns null on any failure (GitHub 404, rate limit, etc.) — never throws.
 */
export async function analyzeGitHubProfile(
  options: AnalyzeGitHubOptions
): Promise<GitHubAnalysis | null> {
  try {
    const { githubUrl, targetRole, jobPosting, language } = options;

    // Extract username from URL
    const usernameMatch = githubUrl.match(/github\.com\/([a-zA-Z0-9-]+)/);
    if (!usernameMatch) {
      logger.warn('github_analyzer.invalid_url', { githubUrl });
      return null;
    }
    const username = usernameMatch[1];

    // Fetch GitHub API (no auth, 60 req/hr)
    logger.debug('github_analyzer.fetching', { username });

    const [userRes, reposRes] = await Promise.all([
      fetch(`https://api.github.com/users/${username}`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GapZero' },
      }),
      fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=30`, {
        headers: { 'Accept': 'application/vnd.github.v3+json', 'User-Agent': 'GapZero' },
      }),
    ]);

    if (!userRes.ok) {
      logger.warn('github_analyzer.user_fetch_failed', { username, status: userRes.status });
      return null;
    }

    const user: GitHubUserData = await userRes.json();
    const repos: GitHubRepoData[] = reposRes.ok ? await reposRes.json() : [];

    // Call Claude
    logger.debug('github_analyzer.analyzing', { username, repoCount: repos.length, targetRole });

    const prompt = buildGitHubAnalysisPrompt({ user, repos, targetRole, jobPosting, language });
    const analysis = await callClaude<GitHubAnalysis>({
      ...prompt,
      maxTokens: 4096,
      temperature: 0.3,
      fallback: GITHUB_ANALYSIS_FALLBACK,
    });

    logger.debug('github_analyzer.done', {
      username,
      strengths: analysis.strengths?.length || 0,
      improvements: analysis.improvements?.length || 0,
    });

    return analysis;
  } catch (e) {
    logger.warn('github_analyzer.failed', { error: e instanceof Error ? e.message : String(e) });
    return null;
  }
}
