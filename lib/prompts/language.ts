// ============================================================================
// Language instruction helper for the AI Chat panel
// Used ONLY by the chat API — analysis translation is handled by translate.ts
// ============================================================================

const LANGUAGE_NAMES: Record<string, string> = {
  en: 'English',
  ro: 'Romanian (Română)',
  de: 'German (Deutsch)',
  fr: 'French (Français)',
  es: 'Spanish (Español)',
  it: 'Italian (Italiano)',
};

/**
 * Returns a language instruction for the chat system prompt.
 * When language is 'en' or undefined, returns empty string.
 */
export function getLanguageInstruction(language?: string): string {
  if (!language || language === 'en') return '';

  const langName = LANGUAGE_NAMES[language] || language;

  return `\nLANGUAGE: You MUST respond entirely in ${langName}. Write naturally and professionally — not machine-translated. Keep company names, technology names, and certification names in their original form.\n`;
}
