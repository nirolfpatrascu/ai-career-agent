// ============================================================================
// Language instruction helper for multilingual AI responses
// ============================================================================

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ro: 'Romanian (Română)',
  de: 'German (Deutsch)',
};

/**
 * Returns a language instruction block to append to Claude system prompts.
 * When language is 'en' or undefined, returns empty string (English is the default).
 * For other languages, returns a clear instruction to respond in that language.
 *
 * NOTE: JSON keys (field names) always stay in English — only string VALUES are translated.
 * This keeps the data structure parseable while making the content readable in the user's language.
 */
export function getLanguageInstruction(language?: string): string {
  if (!language || language === 'en') return '';

  const langName = LANGUAGE_NAMES[language] || language;

  return `
CRITICAL — LANGUAGE INSTRUCTION:
You MUST write ALL human-readable text in ${langName}. This is mandatory, not optional.

TRANSLATE into ${langName}:
- ALL descriptions, summaries, explanations, advice, reasoning, tips
- ALL titles of strengths, gaps, role recommendations
- fitScore.label (e.g. "Potrivire Moderată" not "Moderate Fit")
- fitScore.summary
- ALL action items, closing plans, expected impacts
- ALL salary advice, negotiation tips, best monetary move
- ALL resource descriptions (but keep resource/course NAMES in original language)
- timeToClose, timeToReady, timeEstimate values
- growthPotential text

KEEP in English (these are used for code logic):
- JSON keys/field names (title, description, severity, etc.)
- severity enum values: "critical", "moderate", "minor"
- tier enum values: "differentiator", "strong", "supporting"  
- priority enum values: "critical", "high", "medium"
- workPreference values: "remote", "hybrid", "onsite", "flexible"
- Company names, certification names (AWS, AZ-900, Docker, etc.)
- Currency codes (EUR, USD, etc.)

Write naturally and professionally in ${langName} — not machine-translated.`;
}