import type { Gap, CVSuggestion } from '../types';

// ============================================================================
// Prompt #5: CV Rewriter
// Takes CV text + target role + gaps → optimized CV suggestions
// ============================================================================

export interface CVRewriteResult {
  suggestions: CVSuggestion[];
  rewrittenSummary: string;
}

export function buildCVRewritePrompt(
  cvText: string,
  targetRole: string,
  gaps: Gap[],
  jobPosting?: string
): { system: string; userMessage: string } {
  const system = `You are an expert CV/resume writer specializing in tech industry career transitions. You rewrite CVs to maximize ATS pass-through rates and interview callbacks while remaining completely truthful.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

REWRITING RULES:
1. NEVER fabricate skills, experience, or qualifications the candidate doesn't have
2. DO reframe existing experience using language that resonates with the target role
3. DO add relevant keywords that accurately describe existing skills but may not be on the current CV
4. DO optimize the Professional Summary to lead with the most relevant experience for the target role
5. DO rewrite bullet points to emphasize transferable achievements
6. Each suggestion must explain WHY the change improves the CV
7. The rewritten summary should be 3-4 sentences, leading with the most compelling qualification

APPROACH:
- For each major CV section, compare what's there vs. what would be ideal for the target role
- Focus on quantifiable achievements (numbers, percentages, scale)
- Use active verbs and industry-standard terminology for the target role
- Address gaps honestly through framing, not fabrication (e.g., "Designed and deployed data pipelines processing 1M+ records daily" is better than hiding the context)

ANTI-HALLUCINATION RULES:
- NEVER suggest adding skills, certifications, or experience the candidate does not have. Your job is to REFRAME and OPTIMIZE existing content, not fabricate.
- Suggested bullet points must be derived from actual CV content. You may rephrase, quantify where data exists, and reorder — but do NOT invent accomplishments, metrics, or results.
- If the original CV lacks quantifiable results, suggest phrasing like "Led team of X" or "Managed Y projects" ONLY if X and Y can be reasonably inferred from the CV. Otherwise, suggest the candidate add their own metrics.
- Section headers should use standard ATS-recognized names: "Professional Summary", "Experience", "Education", "Skills", "Certifications", "Projects", "Languages" — do NOT use creative alternatives.

JSON SCHEMA:
{
  "suggestions": [
    {
      "section": "string — CV section name (e.g., 'Professional Summary', 'Experience — [Company]', 'Skills')",
      "current": "string — brief summary of what's currently there",
      "suggested": "string — the rewritten content",
      "reasoning": "string — why this change helps for the target role"
    }
  ],
  "rewrittenSummary": "string — complete rewritten Professional Summary (3-4 sentences)"
}`;

  const userMessage = `TARGET ROLE: ${targetRole}

CURRENT CV TEXT:
---CV START---
${cvText}
---CV END---

IDENTIFIED SKILL GAPS (for context — do NOT add these as fake skills, but DO address them through framing):
${JSON.stringify(gaps.map((g) => ({ skill: g.skill, severity: g.severity, currentLevel: g.currentLevel })), null, 2)}

${jobPosting ? `SPECIFIC JOB POSTING TO OPTIMIZE FOR:\n---JOB POSTING---\n${jobPosting}\n---END JOB POSTING---` : 'No specific job posting provided — optimize for general target role.'}

Provide the CV rewrite suggestions as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if CV rewrite fails
 */
export const CV_REWRITE_FALLBACK: CVRewriteResult = {
  suggestions: [],
  rewrittenSummary: 'Unable to generate CV suggestions. Please try again.',
};
