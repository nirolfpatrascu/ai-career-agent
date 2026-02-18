import type {
  ExtractedProfile,
  CareerQuestionnaire,
  Gap,
  RoleRecommendation,
  ActionPlan,
  SalaryAnalysis,
} from '../types';

// ============================================================================
// Prompt #3: Career Plan + Salary Benchmarks
// Takes profile + gaps + role recs → action plan + salary analysis
// NOTE: Always generates English output. Translation is handled post-processing.
// ============================================================================

export interface CareerPlanResult {
  actionPlan: ActionPlan;
  salaryAnalysis: SalaryAnalysis;
}

export function buildCareerPlanPrompt(
  profile: ExtractedProfile,
  questionnaire: CareerQuestionnaire,
  gaps: Gap[],
  roleRecommendations: RoleRecommendation[],
  knowledgeContext?: string
): { system: string; userMessage: string } {

  const system = `You are a senior career strategist who creates highly specific, actionable career development plans. You have deep knowledge of tech industry salary benchmarks across global markets.

Your task is to create a prioritized action plan that closes the identified skill gaps and positions the candidate for their target roles, plus a detailed salary analysis.

You must respond ONLY with a valid JSON object matching the exact schema below. No preamble, no explanation, no markdown fences — just pure JSON.

ACTION PLAN RULES:
1. 30-Day items are QUICK WINS — things that show immediate results or remove blockers
2. 90-Day items are SKILL BUILDING — certifications, projects, deeper learning
3. 12-Month items are STRATEGIC — career-level moves, reputation building, positioning
4. Every item must be specific enough to start TODAY (no vague "improve skills" type advice)
5. Include time estimates assuming the person works on this 1-3 hours per day alongside a full-time job
6. Resources must be specific and real (actual course names, certification codes, platform URLs)
7. Expected impact must be concrete ("Removes cloud blocker from 60% of postings" not "Improves skills")
8. 30-day plan: 3-5 items. 90-day plan: 3-5 items. 12-month plan: 3-5 items.

PRIORITY LEVELS:
- "critical": Career blocked without this. Do first.
- "high": Significant impact on job search success. Do in parallel with critical items.
- "medium": Important for long-term positioning but won't block immediate progress.

SALARY ANALYSIS RULES:
1. ALL salary figures must be GROSS ANNUAL (before tax). Never use net or monthly figures.
2. CRITICAL: Both currentRoleMarket and targetRoleMarket MUST use the SAME currency. Pick one currency for both:
   - If work preference is "remote" or "flexible": Use EUR for BOTH current and target role markets. Convert local salaries to EUR.
   - If work preference is "hybrid" or "onsite": Use the candidate's local currency for BOTH.
   - Never mix currencies between current and target — the user needs to compare them directly.
3. For target role market with remote/flexible preference: Use EU/EMEA remote market rates. Remote workers from Eastern Europe can earn Western European salaries. Show the full remote market range, NOT local country rates.
4. Always specify "(gross annual)" after the region description so there's no ambiguity
5. Growth potential should be a realistic percentage range, not aspirational
6. "Best monetary move" should be a specific, actionable recommendation — not generic career advice. For remote candidates, emphasize that remote roles for Western EU/US companies pay significantly above local market.
7. Negotiation tips should be specific to this person's situation, referencing their actual experience

JSON SCHEMA:
{
  "actionPlan": {
    "thirtyDays": [
      {
        "action": "string — specific action to take",
        "priority": "critical | high | medium",
        "timeEstimate": "string — e.g. '2-3 weeks at 1hr/day'",
        "resource": "string — specific resource or tool name",
        "expectedImpact": "string — concrete expected outcome"
      }
    ],
    "ninetyDays": [same structure],
    "twelveMonths": [same structure]
  },
  "salaryAnalysis": {
    "currentRoleMarket": {
      "low": number,
      "mid": number,
      "high": number,
      "currency": "string",
      "region": "string — specific market description"
    },
    "targetRoleMarket": {
      "low": number,
      "mid": number,
      "high": number,
      "currency": "string",
      "region": "string"
    },
    "growthPotential": "string — percentage range and timeframe",
    "bestMonetaryMove": "string — specific, actionable paragraph (3-5 sentences). Reference real companies and strategies.",
    "negotiationTips": ["string array — 3 specific tips referencing this person's actual experience and strengths"]
  }
}`;

  const alternativeRoles = [questionnaire.targetRole2, questionnaire.targetRole3].filter(Boolean);
  const targetRolesText = alternativeRoles.length > 0
    ? `- Primary Target Role: ${questionnaire.targetRole}\n- Alternative Target Roles: ${alternativeRoles.join(', ')}`
    : `- Target Role: ${questionnaire.targetRole}`;

  const userMessage = `CANDIDATE PROFILE SUMMARY:
- Name: ${profile.name}
- Current Role: ${questionnaire.currentRole}
${targetRolesText}
- Years of Experience: ${questionnaire.yearsExperience}
- Country of Residence: ${questionnaire.country}
- Work Preference: ${questionnaire.workPreference}
${questionnaire.currentSalary ? `- Current Gross Annual Salary: ${questionnaire.currentSalary} (local currency)` : '- Current Salary: Not disclosed'}
${questionnaire.targetSalary ? `- Target Gross Annual Salary: ${questionnaire.targetSalary} (local currency)` : '- Target Salary: Not specified'}

${questionnaire.workPreference === 'remote' || questionnaire.workPreference === 'flexible'
  ? `IMPORTANT SALARY CONTEXT: The candidate works/seeks REMOTE roles. Their country (${questionnaire.country}) is where they live, but employers may be anywhere in EMEA/EU/Global. Current role market should use local ${questionnaire.country} rates. Target role market MUST use EU/EMEA remote market rates (typically in EUR) — NOT local ${questionnaire.country} rates. Remote workers from Eastern Europe regularly earn Western European salaries.`
  : `SALARY CONTEXT: The candidate seeks ${questionnaire.workPreference} roles in ${questionnaire.country}. Use local market rates for both current and target roles.`}

KEY SKILLS: ${profile.skills.map((s) => `${s.category}: ${s.skills.join(', ')}`).join(' | ')}
CERTIFICATIONS: ${profile.certifications.join(', ') || 'None listed'}

IDENTIFIED GAPS (ordered by severity):
${JSON.stringify(gaps, null, 2)}

RECOMMENDED ROLES:
${JSON.stringify(roleRecommendations, null, 2)}

${knowledgeContext ? `REFERENCE DATA (use to calibrate salary ranges, action items, and negotiation tips — do NOT copy verbatim, synthesize into personalized recommendations):\n${knowledgeContext}` : ''}

Create the action plan and salary analysis as JSON. Remember: ALL salary figures must be GROSS ANNUAL.`;

  return { system, userMessage };
}

/**
 * Default fallback if career plan generation fails
 */
export const CAREER_PLAN_FALLBACK: CareerPlanResult = {
  actionPlan: {
    thirtyDays: [],
    ninetyDays: [],
    twelveMonths: [],
  },
  salaryAnalysis: {
    currentRoleMarket: { low: 0, mid: 0, high: 0, currency: 'EUR', region: 'Unknown' },
    targetRoleMarket: { low: 0, mid: 0, high: 0, currency: 'EUR', region: 'Unknown' },
    growthPotential: 'Unable to estimate',
    bestMonetaryMove: 'Unable to generate recommendation. Please try again.',
    negotiationTips: [],
  },
};
