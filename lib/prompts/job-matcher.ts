import type { ExtractedProfile, JobMatch } from '../types';
import { getLanguageInstruction } from './language';

// ============================================================================
// Prompt #4: Job Posting Matcher
// Takes extracted profile + job posting → match score + suggestions
// ============================================================================

export function buildJobMatchPrompt(
  profile: ExtractedProfile,
  cvText: string,
  jobPosting: string,
  language?: string
): { system: string; userMessage: string } {
  const langInstruction = getLanguageInstruction(language);

  const system = `${langInstruction}You are an expert ATS (Applicant Tracking System) analyst and resume optimization specialist. Your task is to compare a candidate's profile against a specific job posting and provide a detailed match analysis.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

MATCHING RULES:
1. Match score is 0-100% based on keyword/skill overlap AND depth of experience match
2. Consider both explicit skills AND transferable experience
3. Identify ALL matching keywords between CV and job posting — ATS systems look for exact matches
4. Identify ALL missing keywords that the posting requires but the CV doesn't mention
5. For CV suggestions, be SPECIFIC — show exactly what to change and why
6. CV suggestions should make the CV more ATS-friendly WITHOUT being dishonest

MATCH SCORE CALIBRATION:
- 90-100%: Near-perfect match. All required skills present, strong experience alignment.
- 75-89%: Strong match. Most required skills present, minor gaps.
- 60-74%: Good match with notable gaps. Worth applying with a tailored CV.
- 40-59%: Moderate match. Needs significant CV tailoring. Apply selectively.
- Below 40%: Weak match. Major skill gaps. Consider other roles.

CV SUGGESTION SECTIONS:
- "Professional Summary": The opening summary/objective
- "Experience — [Company Name]": Specific experience bullet points
- "Skills": The skills section
- "Certifications": Missing or relevant certifications to highlight
- "Keywords": Specific keywords to weave into the CV

ANTI-HALLUCINATION RULES:
- Only mark a skill as "matching" if it is EXPLICITLY present in the CV text. Semantic matches (e.g., "React Native" for "React") should be noted as partial matches, not exact matches.
- Do NOT inflate match scores. If the CV genuinely lacks most required skills, the match score should be low (20-40%), not artificially boosted.
- CV rewrite suggestions must be truthful. Do NOT suggest adding skills or experience the candidate does not have. Suggestions should REFRAME existing experience, not fabricate new experience.
- The "suggested" text in CV suggestions must be based on real content from the candidate's CV, reorganized or reworded for the specific job — NOT invented achievements or metrics.

JSON SCHEMA:
{
  "matchScore": number (0-100),
  "matchingSkills": ["string array — skills/keywords that match between CV and posting"],
  "missingSkills": ["string array — skills/keywords in posting but not in CV"],
  "cvSuggestions": [
    {
      "section": "string — which CV section to modify",
      "current": "string — abbreviated current content (what's there now)",
      "suggested": "string — the suggested rewrite",
      "reasoning": "string — why this change improves the match"
    }
  ],
  "overallAdvice": "string — 2-3 paragraph honest assessment. Should they apply? What's the strategy?"
}`;

  const userMessage = `CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

CANDIDATE'S CURRENT CV TEXT:
---CV START---
${cvText}
---CV END---

JOB POSTING TO MATCH AGAINST:
---JOB POSTING START---
${jobPosting}
---JOB POSTING END---

Analyze the match and provide suggestions as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if job matching fails
 */
export const JOB_MATCH_FALLBACK: JobMatch = {
  matchScore: 0,
  matchingSkills: [],
  missingSkills: [],
  cvSuggestions: [],
  overallAdvice: 'Unable to analyze job match. Please try again.',
};