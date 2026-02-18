// ============================================================================
// Language instruction helper for multilingual AI responses
// ============================================================================

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ro: 'Romanian (Română)',
  de: 'German (Deutsch)',
};

/**
 * Returns a PRIORITY language instruction to PREPEND to Claude system prompts.
 * Must be placed at the very top of the system prompt to override English schema examples.
 */
export function getLanguageInstruction(language?: string): string {
  if (!language || language === 'en') return '';

  const langName = LANGUAGE_NAMES[language] || language;

  return `⚠️ MANDATORY LANGUAGE REQUIREMENT — READ FIRST ⚠️
You MUST write ALL human-readable text values in ${langName}. This overrides any English examples in the schema below.

TRANSLATE into ${langName} — every single one of these:
✅ fitScore.label (e.g. translate "Strong Fit" → the equivalent in ${langName})
✅ fitScore.summary
✅ strengths[].title, strengths[].description, strengths[].relevance
✅ gaps[].skill (the display name), gaps[].currentLevel, gaps[].requiredLevel
✅ gaps[].impact, gaps[].closingPlan, gaps[].timeToClose
✅ gaps[].resources[] (translate descriptions, keep course/cert names in original)
✅ roleRecommendations[].title, roleRecommendations[].reasoning
✅ roleRecommendations[].timeToReady
✅ actionPlan items: action, timeEstimate, resource, expectedImpact
✅ salaryAnalysis: region, growthPotential, bestMonetaryMove, negotiationTips
✅ jobMatch: overallAdvice, cvSuggestions[].current, cvSuggestions[].suggested, cvSuggestions[].reasoning

KEEP in English (code logic depends on these exact values):
❌ JSON keys (title, description, severity, etc.)
❌ severity: "critical" | "moderate" | "minor"
❌ tier: "differentiator" | "strong" | "supporting"
❌ priority: "critical" | "high" | "medium"
❌ Currency codes: EUR, USD, etc.
❌ Company names, certification codes (AWS, AZ-900, Docker)

The English examples in the schema below are for STRUCTURE only. Replace all human-readable text with natural, professional ${langName}.
---

`;
}