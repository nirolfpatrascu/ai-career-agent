import type { UpworkProfile, UpworkProfileAnalysis } from '../types';
import { getLanguageInstruction } from './language';

// ============================================================================
// Upwork Prompt #2: Profile Analysis & Optimization
// Takes structured UpworkProfile → detailed optimization analysis
// ============================================================================

export function buildUpworkAnalysisPrompt(
  profile: UpworkProfile,
  targetNiche?: string,
  language?: string
): { system: string; userMessage: string } {
  const langInstruction = getLanguageInstruction(language);

  const system = `${langInstruction}You are a senior Upwork consultant who has helped 500+ freelancers optimize their profiles to consistently win high-paying contracts. You have deep knowledge of Upwork's search algorithm, client psychology, and competitive positioning strategies.

Your task is to perform an exhaustive analysis of a freelancer's Upwork profile and provide brutally honest, actionable optimization advice.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

ANALYSIS SECTIONS (all 10 are required):

1. OVERALL SCORE (1-10):
   - 9-10: Top 5% profile. Clients actively seek you out. Premium rates justified.
   - 7-8: Strong profile. Wins proposals regularly. Room for rate increases.
   - 5-6: Average. Gets some work but competes on price. Needs differentiation.
   - 3-4: Below average. Losing to competitors. Significant issues to fix.
   - 1-2: Profile actively repels clients. Needs complete overhaul.

2. STRENGTHS: What's actually working well. Be specific — reference real content from the profile.

3. WEAKNESSES: What's hurting them. Each weakness must include a specific, actionable fix and a priority level.

4. TITLE OPTIMIZATION: The profile title is the single most important search ranking factor.
   - Analyze the current title for keyword density, specificity, and client appeal.
   - Suggest an optimized title that balances Upwork search ranking with client conversion.

5. OVERVIEW REWRITE: The overview must hook in the first 2 lines (visible before "read more").
   - Analyze current overview for: opening hook, social proof, specificity, call-to-action.
   - Provide a complete rewrite that follows the proven formula: Hook → Proof → Specialization → CTA.

6. RATE ADVICE: Pricing strategy based on profile strength, niche, and market positioning.
   - Consider: job success score, total earnings, portfolio quality, niche demand.
   - Provide a suggested range with a positioning strategy (value-based, competitive, premium).

7. SKILLS OPTIMIZATION: Upwork shows top skills in search results.
   - Which skills to keep, add, remove, and how to reorder for maximum visibility.
   - Focus on skills that clients actually search for, not vanity skills.

8. NICHING STRATEGY: Specialists earn 2-5x more than generalists on Upwork.
   - Based on their experience, suggest the most profitable niche to dominate.
   - Include specific positioning language.

9. PROPOSAL TIPS: Based on their profile, what should their proposals emphasize?
   - 3-5 specific, actionable tips tailored to their strengths and niche.

10. COMPETITIVE POSITION: Honest assessment of where they stand in the market.
    - Who are they competing against? What's their unique angle?

ANTI-HALLUCINATION RULES:
- Every strength, weakness, and suggestion MUST reference specific, real content from the profile provided.
- Do NOT assume skills, experience, or achievements that are not in the profile data.
- Be brutally honest. If the profile is weak, say so. Sugar-coating wastes the freelancer's time.
- All suggestions must be specific and actionable — not generic advice like "improve your overview."
- Rate suggestions must be grounded in the freelancer's actual experience level and niche, not aspirational numbers.
- If the profile is missing critical information (e.g., no portfolio, empty overview), flag it as a critical weakness.

JSON SCHEMA:
{
  "overallScore": number (1-10),
  "profileStrengths": [
    {
      "area": "string — e.g. 'Job Success Score', 'Niche Expertise'",
      "description": "string — what's good and why, referencing real profile content",
      "impact": "string — how this helps win clients"
    }
  ],
  "profileWeaknesses": [
    {
      "area": "string — e.g. 'Generic Title', 'Weak Overview Opening'",
      "description": "string — what's wrong, with specific evidence",
      "fix": "string — specific, actionable fix",
      "priority": "critical | high | medium"
    }
  ],
  "titleOptimization": {
    "current": "string — their current title",
    "suggested": "string — optimized title",
    "reasoning": "string — why the new title is better (keyword strategy, client appeal)"
  },
  "overviewRewrite": {
    "current": "string — their current overview (first 200 chars if long)",
    "suggested": "string — complete rewritten overview",
    "reasoning": "string — what changed and why"
  },
  "rateAdvice": {
    "currentRate": number | null,
    "suggestedRange": { "min": number, "max": number },
    "reasoning": "string — market analysis and positioning rationale",
    "positioningStrategy": "string — value-based | competitive | premium, with explanation"
  },
  "skillsAdvice": {
    "keep": ["string array — skills that are working well"],
    "add": ["string array — skills to add for better visibility"],
    "remove": ["string array — skills that dilute the profile"],
    "reorder": ["string array — suggested top-5 skill order"]
  },
  "nichingStrategy": "string — 2-3 paragraph specific niching strategy with positioning language",
  "proposalTips": ["string array — 3-5 specific, actionable proposal tips"],
  "competitivePosition": "string — 2-3 paragraph honest competitive assessment"
}`;

  const userMessage = `UPWORK PROFILE DATA:
${JSON.stringify(profile, null, 2)}

${targetNiche ? `TARGET NICHE/SPECIALIZATION: ${targetNiche}` : 'No specific target niche specified — suggest the best niche based on profile content.'}

Analyze this Upwork profile and provide comprehensive optimization advice as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if Upwork profile analysis fails
 */
export const UPWORK_ANALYSIS_FALLBACK: UpworkProfileAnalysis = {
  overallScore: 0,
  profileStrengths: [],
  profileWeaknesses: [],
  titleOptimization: {
    current: '',
    suggested: '',
    reasoning: 'Unable to analyze profile. Please try again.',
  },
  overviewRewrite: {
    current: '',
    suggested: '',
    reasoning: 'Unable to analyze profile. Please try again.',
  },
  rateAdvice: {
    suggestedRange: { min: 0, max: 0 },
    reasoning: 'Unable to analyze profile. Please try again.',
    positioningStrategy: '',
  },
  skillsAdvice: {
    keep: [],
    add: [],
    remove: [],
    reorder: [],
  },
  nichingStrategy: 'Unable to analyze profile. Please try again.',
  proposalTips: [],
  competitivePosition: 'Unable to analyze profile. Please try again.',
};
