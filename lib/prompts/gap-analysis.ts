import type {
  ExtractedProfile,
  CareerQuestionnaire,
  FitScore,
  Strength,
  Gap,
  RoleRecommendation,
} from '../types';

// ============================================================================
// Prompt #2: Gap Analysis + Role Recommendations
// Takes extracted profile + questionnaire → strengths, gaps, fit score, roles
// ============================================================================

export interface GapAnalysisResult {
  fitScore: FitScore;
  strengths: Strength[];
  gaps: Gap[];
  roleRecommendations: RoleRecommendation[];
}

export function buildGapAnalysisPrompt(
  profile: ExtractedProfile,
  questionnaire: CareerQuestionnaire
): { system: string; userMessage: string } {
  const system = `You are a senior career strategist with 20 years in tech recruitment and career coaching. You specialize in helping technology professionals navigate career transitions.

Your task is to perform a comprehensive gap analysis between a candidate's current profile and their target role, then recommend the best-fit roles.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

ANALYSIS RULES:

FIT SCORE (1-10):
- 9-10: Could get the job interview tomorrow. All critical skills present.
- 7-8: Strong fit. Has 80%+ of requirements. Minor gaps closable in weeks.
- 5-6: Moderate fit. Has core transferable skills but 1-2 critical gaps. 2-3 months of focused effort needed.
- 3-4: Stretch. Significant gaps. 6-12 months of preparation needed.
- 1-2: Major pivot. Would need extensive retraining (1+ years).

STRENGTHS — identify 3-6 strengths:
- "differentiator": Rare combination that most competitors don't have. True competitive advantage.
- "strong": Solid match for role requirements. Expected but well-demonstrated.
- "supporting": Helpful context that adds credibility but isn't a direct match.

GAPS — identify 3-8 gaps, ordered by severity:
- "critical": Auto-reject on job applications. Blocker. Must fix first.
- "moderate": Won't auto-reject but hurts in interviews or limits options significantly.
- "minor": Nice to have. Won't block you but improving it helps.

For EACH gap, you MUST provide:
- Specific, actionable closing plan (not generic advice like "take a course")
- Realistic time estimate for someone working 1-2 hours/day on it
- 2-4 specific, named resources (courses, certifications, tutorials) — prefer free resources

ROLE RECOMMENDATIONS — suggest 3 roles:
- Role 1: Best immediate fit (can apply now or within weeks)
- Role 2: Strong fit with minor preparation needed
- Role 3: Aspirational but achievable within 6-12 months
- Include GROSS ANNUAL salary ranges (before tax)
- Name 3-6 specific companies hiring for each role

SALARY RANGES must consider work preference:
- If work preference is "remote" or "flexible": Use EU/EMEA remote market rates (typically EUR). Remote workers from Eastern Europe can earn Western European salaries. Show the full remote market range.
- If work preference is "hybrid" or "onsite": Use the candidate's country local rates.
- All figures are GROSS ANNUAL.

JSON SCHEMA:
{
  "fitScore": {
    "score": number (1-10),
    "label": "Strong Fit" | "Moderate Fit" | "Stretch" | "Significant Gap",
    "summary": "string — 2-3 sentence overall assessment. Be specific about what transfers and what doesn't."
  },
  "strengths": [
    {
      "title": "string — short title, e.g. 'Enterprise Architecture Experience'",
      "description": "string — 2-3 sentences. Specific evidence from their CV.",
      "relevance": "string — How this applies to their target role specifically.",
      "tier": "differentiator | strong | supporting"
    }
  ],
  "gaps": [
    {
      "skill": "string — specific skill or area",
      "severity": "critical | moderate | minor",
      "currentLevel": "string — what they have now, based on CV evidence",
      "requiredLevel": "string — what the target role typically requires",
      "impact": "string — concrete impact on job search, e.g. 'Auto-reject on 60% of postings'",
      "closingPlan": "string — specific, step-by-step plan to close this gap",
      "timeToClose": "string — realistic timeframe, e.g. '2-3 weeks at 1hr/day'",
      "resources": ["string array — 2-4 SPECIFIC named resources, courses, certifications"]
    }
  ],
  "roleRecommendations": [
    {
      "title": "string — specific role title",
      "fitScore": number (1-10),
      "salaryRange": {
        "low": number,
        "mid": number,
        "high": number,
        "currency": "string — e.g. EUR, USD, GBP"
      },
      "reasoning": "string — why this role fits, referencing specific profile strengths",
      "exampleCompanies": ["string array — 3-6 specific companies that hire this role"],
      "timeToReady": "string — 'Ready now' | '1-3 months' | '6-12 months'"
    }
  ]
}`;

  const userMessage = `CANDIDATE PROFILE:
${JSON.stringify(profile, null, 2)}

CAREER GOALS:
- Current Role: ${questionnaire.currentRole}
- Target Role: ${questionnaire.targetRole}
- Years of Experience: ${questionnaire.yearsExperience}
- Country of Residence: ${questionnaire.country}
- Work Preference: ${questionnaire.workPreference}
${questionnaire.currentSalary ? `- Current Gross Annual Salary: ${questionnaire.currentSalary} (local currency)` : ''}
${questionnaire.targetSalary ? `- Target Gross Annual Salary: ${questionnaire.targetSalary} (local currency)` : ''}

${questionnaire.workPreference === 'remote' || questionnaire.workPreference === 'flexible'
  ? `NOTE: Candidate seeks REMOTE/FLEXIBLE work. Role salary ranges should reflect EU/EMEA remote market rates, not local ${questionnaire.country} rates. All salaries must be GROSS ANNUAL.`
  : 'All salaries must be GROSS ANNUAL.'}

Perform the gap analysis and provide role recommendations as JSON.`;

  return { system, userMessage };
}

/**
 * Default fallback if gap analysis fails
 */
export const GAP_ANALYSIS_FALLBACK: GapAnalysisResult = {
  fitScore: {
    score: 5,
    label: 'Moderate Fit',
    summary: 'Analysis could not be completed. Please try again.',
  },
  strengths: [],
  gaps: [],
  roleRecommendations: [],
};
