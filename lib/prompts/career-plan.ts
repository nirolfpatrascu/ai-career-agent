import type {
  ExtractedProfile,
  CareerQuestionnaire,
  Gap,
  RoleRecommendation,
  ActionPlan,
  SalaryAnalysis,
} from '../types';
import { lookupSalary, lookupRemoteSalary } from '../salary-lookup';

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
8. IMPORTANT — If SALARY REFERENCE DATA is provided below, you MUST use those exact figures for low/mid/high and set the source field to the value specified (e.g., "government_bls", "government_ons", "government_eurostat", "survey_stackoverflow", or "market"). Only estimate when no data is available — in that case set source to "estimate" and provide wider ranges.
9. Valid source values: "government_bls", "government_ons", "government_eurostat", "survey_stackoverflow", "market", "estimate". Use the source specified in the reference data. If not confident, mark source as "estimate" and widen the range (e.g., +/- 20%)

STRICT DATA SOURCING:
- Base your action plan STRICTLY on the provided candidate profile, identified gaps, and role recommendations.
- Every action item must be relevant to THIS candidate's actual skills, gaps, and goals — not generic career advice.
- Use the provided salary reference data and knowledge context for benchmarking. Do NOT copy example data verbatim.
- Do NOT invent, assume, or infer any skills, experience, or career details not present in the provided data.

ANTI-HALLUCINATION RULES:
- Only suggest real, existing platforms and tools. Do NOT invent app names, website names, or community names.
- Only suggest actions that a real person could actually complete. Do NOT suggest "get hired at [specific company]" as an action item — suggest "apply to [type of company]" instead.
- Resource links/names must reference real, verifiable resources.
- Time estimates must be realistic. If suggesting a course, base the time on the actual course length. If suggesting a project, base on realistic development time for the described scope.
- If not confident about salary data for a specific role/region combination, explicitly state this is an estimate and provide a wider range. Use phrasing: "Estimated range (limited market data for this region)" rather than stating numbers with false confidence.
- Salary figures should be in the currency appropriate for the user's country. Do NOT mix currencies.
- Negotiation tips must be general best practices, not fabricated statistics (e.g., do NOT say "87% of hiring managers..." unless citing a real source).

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
      "region": "string — specific market description",
      "source": "government_bls | government_ons | government_eurostat | survey_stackoverflow | market | estimate"
    },
    "targetRoleMarket": {
      "low": number,
      "mid": number,
      "high": number,
      "currency": "string",
      "region": "string",
      "source": "government_bls | government_ons | government_eurostat | survey_stackoverflow | market | estimate"
    },
    "growthPotential": "string — percentage range and timeframe",
    "bestMonetaryMove": "string — specific, actionable paragraph (3-5 sentences). Reference real companies and strategies.",
    "negotiationTips": ["string array — 3 specific tips referencing this person's actual experience and strengths"],
    "dataSource": "government_bls | government_ons | government_eurostat | survey_stackoverflow | market | estimate — use the most authoritative source used, or 'estimate' if both roles were estimated"
  }
}`;

  const alternativeRoles = [questionnaire.targetRole2, questionnaire.targetRole3].filter(Boolean);
  const targetRolesText = alternativeRoles.length > 0
    ? `- Primary Target Role: ${questionnaire.targetRole}\n- Alternative Target Roles: ${alternativeRoles.join(', ')}`
    : `- Target Role: ${questionnaire.targetRole}`;

  // --- Salary data lookup (priority cascade: BLS → ONS → SO → Eurostat → curated) ---
  const isRemote = questionnaire.workPreference === 'remote' || questionnaire.workPreference === 'flexible';
  const expLevel = questionnaire.yearsExperience <= 3 ? 'junior' as const : questionnaire.yearsExperience <= 8 ? 'mid' as const : questionnaire.yearsExperience <= 15 ? 'senior' as const : 'lead' as const;

  const currentLookup = lookupSalary(questionnaire.currentRole, questionnaire.country, expLevel);
  const targetLookup = isRemote
    ? lookupRemoteSalary(questionnaire.targetRole)
    : lookupSalary(questionnaire.targetRole, questionnaire.country, expLevel);

  let curatedSalaryContext = '';
  if (currentLookup || targetLookup) {
    curatedSalaryContext += '\nSALARY REFERENCE DATA (use these figures for the corresponding role, set source accordingly):\n';
    if (currentLookup) {
      curatedSalaryContext += `CURRENT ROLE (${questionnaire.currentRole} in ${questionnaire.country}): ${currentLookup.currency} ${currentLookup.low}-${currentLookup.mid}-${currentLookup.high} (p25/median/p75, ${expLevel} level) — Source: ${currentLookup.sourceLabel}, set source to "${currentLookup.source}"\n`;
    }
    if (targetLookup) {
      curatedSalaryContext += `TARGET ROLE (${questionnaire.targetRole}${isRemote ? ' Remote EU' : ` in ${questionnaire.country}`}): ${targetLookup.currency} ${targetLookup.low}-${targetLookup.mid}-${targetLookup.high} (p25/median/p75) — Source: ${targetLookup.sourceLabel}, set source to "${targetLookup.source}"\n`;
    }
    if (!currentLookup) {
      curatedSalaryContext += `NOTE: No data for current role "${questionnaire.currentRole}" in ${questionnaire.country}. Estimate it and set source to "estimate".\n`;
    }
    if (!targetLookup) {
      curatedSalaryContext += `NOTE: No data for target role "${questionnaire.targetRole}". Estimate it and set source to "estimate".\n`;
    }
  } else {
    curatedSalaryContext = '\nNO SALARY DATA available for these roles/regions. Estimate both and set source to "estimate" and dataSource to "estimate". If not confident, provide wider ranges.\n';
  }

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

${curatedSalaryContext}

${knowledgeContext ? `REFERENCE DATA (use to calibrate salary ranges, action items, and negotiation tips — do NOT copy verbatim, synthesize into personalized recommendations):\n${knowledgeContext}` : ''}

Create the action plan and salary analysis as JSON. Remember: ALL salary figures must be GROSS ANNUAL. Use curated data when provided (source: "market"), estimate otherwise (source: "estimate").`;

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
    currentRoleMarket: { low: 0, mid: 0, high: 0, currency: 'EUR', region: 'Unknown', source: 'estimate' },
    targetRoleMarket: { low: 0, mid: 0, high: 0, currency: 'EUR', region: 'Unknown', source: 'estimate' },
    growthPotential: 'Unable to estimate',
    bestMonetaryMove: 'Unable to generate recommendation. Please try again.',
    negotiationTips: [],
    dataSource: 'estimate',
  },
};
