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
LANGUAGE INSTRUCTION:
- All human-readable string VALUES in your JSON response must be written in ${langName}.
- This includes: descriptions, summaries, explanations, advice, titles of strengths/gaps, reasoning, tips, plans, and any other text the user will read.
- JSON KEYS (field names like "title", "description", "severity") must stay in English exactly as specified in the schema.
- Enum values like severity levels ("critical", "moderate", "minor"), tier values ("differentiator", "strong", "supporting"), and fit labels ("Strong Fit", "Moderate Fit", etc.) must stay in English — these are used for UI logic.
- Skill names, company names, certification names, course names, and resource names should stay in their original/English form (e.g., "AWS", "Docker", "AZ-900", "Coursera").
- Write naturally in ${langName} — not machine-translated. Use proper grammar, idioms, and professional tone appropriate for career advice.`;
}