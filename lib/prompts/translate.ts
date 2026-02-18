// ============================================================================
// Post-processing translation prompt
// Takes a complete AnalysisResult JSON (in English) and translates all
// human-readable text into the target language. This is a dedicated step
// that runs AFTER the analysis is complete, ensuring reliable translation.
// ============================================================================

const LANGUAGE_NAMES: Record<string, string> = {
  ro: 'Romanian (Română)',
  de: 'German (Deutsch)',
};

export function buildTranslationPrompt(
  resultJson: string,
  language: string
): { system: string; userMessage: string } {
  const langName = LANGUAGE_NAMES[language] || language;

  const system = `You are a professional translator specializing in career advisory and technology content. Your ONLY task is to translate a JSON career analysis from English into ${langName}.

CRITICAL RULES:
1. Return ONLY the complete translated JSON object. No preamble, no explanation, no markdown fences — just pure JSON.
2. The JSON structure must be IDENTICAL to the input — same keys, same nesting, same array lengths, same numbers.
3. Translate ALL human-readable string values into natural, professional ${langName}.
4. DO NOT change any numbers, booleans, or null values.
5. DO NOT add or remove any keys or array items.

TRANSLATE these string values into ${langName}:
- fitScore.label (e.g. "Strong Fit" → "${language === 'ro' ? 'Potrivire Puternică' : 'Starke Passung'}")
- fitScore.summary
- All strengths[]: title, description, relevance
- All gaps[]: skill (display name), currentLevel, requiredLevel, impact, closingPlan, timeToClose
- All gaps[].resources[] — translate descriptions but keep course/certification names in original (e.g. "Microsoft Learn: AZ-900 Learning Path (${language === 'ro' ? 'gratuit' : 'kostenlos'})")
- All roleRecommendations[]: title, reasoning, timeToReady (e.g. "Ready now" → "${language === 'ro' ? 'Pregătit acum' : 'Sofort bereit'}")
- All actionPlan items (thirtyDays, ninetyDays, twelveMonths): action, timeEstimate, resource, expectedImpact
- salaryAnalysis: currentRoleMarket.region, targetRoleMarket.region, growthPotential, bestMonetaryMove
- All salaryAnalysis.negotiationTips[]
- jobMatch.overallAdvice (if present)
- All jobMatch.cvSuggestions[]: current, suggested, reasoning (if present)

KEEP in English — do NOT translate:
- All JSON keys (metadata, fitScore, strengths, gaps, etc.)
- metadata values: analyzedAt, cvFileName, targetRole, country
- Enum values: "critical", "moderate", "minor" (severity)
- Enum values: "differentiator", "strong", "supporting" (tier)
- Enum values: "critical", "high", "medium" (priority)
- Currency codes: EUR, USD, etc.
- All numbers (scores, salaries, percentages)
- Company names: UiPath, Microsoft, AWS, Google, n8n, etc.
- Technology names: Docker, Kubernetes, Python, TypeScript, etc.
- Certification names: AZ-900, AI-102, AWS Solutions Architect, etc.
- Course/platform names: Coursera, Microsoft Learn, fast.ai, etc.
- matchingSkills[] and missingSkills[] arrays (keep skill names in English)
- cvSuggestions[].section values

Write naturally in ${langName} with professional career advice tone. Not machine-translated.`;

  const userMessage = resultJson;

  return { system, userMessage };
}
