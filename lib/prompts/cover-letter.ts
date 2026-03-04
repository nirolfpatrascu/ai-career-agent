import type { AnalysisResult } from '../types';
import { getLanguageInstruction } from './language';

// ============================================================================
// Cover Letter Prompt — Generic (non-Upwork) cover letter for job applications
// Differentiator: honest weakness framing + job-specific tone matching
// ============================================================================

export interface CoverLetter {
  greeting: string;
  openingParagraph: string;
  bodyParagraphs: string[];
  closingParagraph: string;
  signature: string;
  toneUsed: 'professional' | 'conversational' | 'bold';
  weaknessAcknowledgments: string[];
  strengthHighlights: string[];
}

interface CoverLetterOptions {
  analysis: AnalysisResult;
  jobPosting: string;
  tone?: 'professional' | 'conversational' | 'bold';
  language?: string;
}

export function buildCoverLetterPrompt(
  options: CoverLetterOptions
): { system: string; userMessage: string } {
  const {
    analysis,
    jobPosting,
    tone = 'professional',
    language,
  } = options;

  const langInstruction = getLanguageInstruction(language);

  const toneInstructions: Record<string, string> = {
    professional: 'Write in a polished, confident, and professional tone. Use clear, concise language. Demonstrate expertise through specificity, not adjectives.',
    conversational: 'Write in a warm, approachable, and conversational tone. Use natural language as if speaking to a colleague. Still demonstrate expertise but in a friendly way.',
    bold: 'Write in a bold, direct, and assertive tone. Lead with results and confidence. Be slightly provocative — stand out from generic applications.',
  };

  const system = `${langInstruction}You are an expert career cover letter writer who has helped professionals land roles at top companies. You understand hiring psychology, what makes a cover letter stand out, and how to honestly frame gaps as growth opportunities.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

TONE: ${toneInstructions[tone]}

COVER LETTER STRATEGY:

1. TONE ANALYSIS:
   - Detect the job posting tone (corporate/startup/agency/technical) and adapt writing style to match.
   - Corporate: formal, structured, highlight process and leadership.
   - Startup: energetic, show initiative, emphasize versatility and impact.
   - Agency: results-focused, client-oriented, fast-paced language.
   - Technical: precise, evidence-based, focus on specific technologies and outcomes.

2. ADMIT WEAKNESSES HONESTLY:
   - For each missing skill from the candidate's gaps, acknowledge it honestly and frame it as active growth.
   - Example: "While I'm still developing my Kubernetes expertise, I've been actively studying container orchestration and recently completed..."
   - This builds trust. Hiring managers respect self-awareness over overconfidence.
   - Only address the 1-2 most relevant gaps — don't list every weakness.

3. HIGHLIGHT STRENGTHS:
   - Lead with the strongest matches from the candidate's strengths, particularly 'differentiator' tier ones.
   - Connect each strength to a specific need from the job posting.
   - Use evidence from the profile — not generic claims.

4. "I WANT THIS JOB" MENTALITY:
   - Reference specific details from the job posting: company name, mission, project, or team if mentioned.
   - Show the candidate researched the company. Not generic — must feel personal.
   - Connect the candidate's career trajectory to why THIS role is the natural next step.

5. ANTI-HALLUCINATION:
   - Only reference real skills, experience, and achievements from the candidate's profile data.
   - Do NOT invent projects, companies, metrics, or achievements not present in the data.
   - If profile data is sparse, keep claims general but honest.

JSON SCHEMA:
{
  "greeting": "string — appropriate greeting (e.g., 'Dear Hiring Manager,' or 'Dear [Team Name] Team,')",
  "openingParagraph": "string — compelling opening that hooks the reader and references the specific role/company",
  "bodyParagraphs": ["string array — 2-3 paragraphs covering strengths, relevant experience, and honest gap framing"],
  "closingParagraph": "string — enthusiastic closing with specific call to action",
  "signature": "string — professional sign-off with candidate name",
  "toneUsed": "'professional' | 'conversational' | 'bold'",
  "weaknessAcknowledgments": ["string array — how each addressed gap was framed (for UI display)"],
  "strengthHighlights": ["string array — which strengths were emphasized (for UI display)"]
}`;

  const profileSection = analysis.profile
    ? `CANDIDATE PROFILE:
Name: ${analysis.profile.name || 'Not provided'}
Current Role: ${analysis.profile.currentRole || 'Not provided'}
Experience: ${analysis.profile.totalYearsExperience || 'N/A'} years
Skills: ${analysis.profile.skills?.map(s => `${s.category}: ${s.skills.join(', ')}`).join('; ') || 'Not provided'}
Summary: ${analysis.profile.summary || 'Not provided'}`
    : 'CANDIDATE PROFILE: Limited data available.';

  const strengthsSection = analysis.strengths?.length
    ? `CANDIDATE STRENGTHS:
${analysis.strengths.map(s => `- [${s.tier}] ${s.title}: ${s.description}`).join('\n')}`
    : '';

  const gapsSection = analysis.gaps?.length
    ? `CANDIDATE GAPS:
${analysis.gaps.map(g => `- [${g.severity}] ${g.skill}: ${g.impact} (Current: ${g.currentLevel}, Required: ${g.requiredLevel})`).join('\n')}`
    : '';

  const fitSection = analysis.fitScore
    ? `FIT SCORE: ${analysis.fitScore.score}/10 — ${analysis.fitScore.summary}`
    : '';

  const userMessage = `${profileSection}

${fitSection}

${strengthsSection}

${gapsSection}

JOB POSTING:
---
${jobPosting}
---

TONE PREFERENCE: ${tone}

Generate a compelling, honest cover letter as JSON.`;

  return { system, userMessage };
}

export const COVER_LETTER_FALLBACK: CoverLetter = {
  greeting: '',
  openingParagraph: '',
  bodyParagraphs: [],
  closingParagraph: '',
  signature: '',
  toneUsed: 'professional',
  weaknessAcknowledgments: [],
  strengthHighlights: [],
};
