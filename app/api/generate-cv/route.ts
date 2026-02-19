import { NextRequest, NextResponse } from 'next/server';
import { callClaude } from '@/lib/claude';
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rate-limit';
import { getLanguageInstruction } from '@/lib/prompts/language';
import type { AnalysisResult, GeneratedCV } from '@/lib/types';

export const maxDuration = 45;

const FALLBACK: GeneratedCV = {
  professionalSummary: 'Unable to generate CV. Please try again.',
  skills: [],
  experienceBullets: [],
  certifications: [],
  projectHighlights: [],
  coverLetterDraft: '',
};

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown';

    const rateLimit = checkRateLimit(ip);
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: 'Rate limited' },
        { status: 429, headers: getRateLimitHeaders(ip) }
      );
    }

    const { analysis, language } = (await request.json()) as {
      analysis: AnalysisResult;
      language?: string;
    };

    if (!analysis) {
      return NextResponse.json({ error: 'Missing analysis data' }, { status: 400 });
    }

    const langInstruction = getLanguageInstruction(language);
    const targetRole = analysis.metadata.targetRole;
    const country = analysis.metadata.country;

    const system = `You are a world-class CV writer and career consultant who specializes in the tech industry. You create ATS-optimized, compelling CVs that get interviews.

You must respond ONLY with a valid JSON object matching the schema below. No preamble, no markdown, no explanation — just pure JSON.
${langInstruction}

RULES:
1. Base EVERYTHING on the analysis data provided — strengths, gaps, role recommendations
2. NEVER fabricate experience. Reframe and optimize existing strengths
3. Use quantifiable achievements wherever possible (numbers, percentages, scale)
4. Lead with the most relevant experience for the target role
5. Use keywords that pass ATS screening for the target role
6. Skills should be grouped by category (Languages, Frameworks, Cloud, AI/ML, etc.)
7. Experience bullets should start with strong action verbs
8. The cover letter should be 3 paragraphs: hook, value proposition, call to action
9. Project highlights should demonstrate skills relevant to the target role

JSON SCHEMA:
{
  "professionalSummary": "string — 3-4 sentence professional summary optimized for target role. Lead with years of experience and strongest differentiator.",
  "skills": [
    { "category": "string — e.g. 'AI & Machine Learning'", "items": ["skill1", "skill2"] }
  ],
  "experienceBullets": [
    {
      "role": "string — job title (reframed if helpful)",
      "company": "string — company name",
      "bullets": ["string — achievement-focused bullet point starting with action verb"]
    }
  ],
  "certifications": ["string — recommended certifications to list (existing + in-progress)"],
  "projectHighlights": [
    {
      "name": "string — project name",
      "description": "string — 1-2 sentence description emphasizing impact",
      "technologies": ["tech1", "tech2"]
    }
  ],
  "coverLetterDraft": "string — 3-paragraph cover letter draft for the target role"
}`;

    const userMessage = `Generate an optimized CV framework for this candidate targeting the role of "${targetRole}" in ${country}.

CANDIDATE ANALYSIS:
- Fit Score: ${analysis.fitScore.score}/10 (${analysis.fitScore.label})
- Summary: ${analysis.fitScore.summary}

STRENGTHS:
${analysis.strengths.map(s => `- [${s.tier}] ${s.title}: ${s.description}`).join('\n')}

SKILL GAPS (to acknowledge but frame positively):
${analysis.gaps.map(g => `- [${g.severity}] ${g.skill}: current=${g.currentLevel}, required=${g.requiredLevel}`).join('\n')}

RECOMMENDED ROLES:
${analysis.roleRecommendations.map(r => `- ${r.title} (${r.fitScore}/10): ${r.reasoning}`).join('\n')}

ACTION PLAN HIGHLIGHTS:
${analysis.actionPlan.thirtyDays.slice(0, 3).map(a => `- ${a.action}`).join('\n')}

Generate the complete CV framework as JSON.`;

    const result = await callClaude<GeneratedCV>({
      system,
      userMessage,
      maxTokens: 4096,
      temperature: 0.4,
      fallback: FALLBACK,
    });

    return NextResponse.json(result, {
      status: 200,
      headers: getRateLimitHeaders(ip),
    });
  } catch (error) {
    console.error('[generate-cv] Error:', error);
    return NextResponse.json(
      { error: 'CV generation failed. Please try again.' },
      { status: 500 }
    );
  }
}