import type { AnalysisResult } from './types';

// Fields whose values must never be translated (identifiers, codes, URLs, etc.)
const SKIP_KEYS = new Set([
  'analyzedAt', 'cvFileName', 'githubUrl', 'resourceUrl', 'currency',
  'name', 'company', 'institution', 'exampleCompanies',
  'skills', 'technologies', 'techStack', 'keyword', 'matchedAs',
  'matchingSkills', 'keywords', 'tier', 'severity', 'priority',
  'toneUsed', 'importance', 'actionType', 'category', 'proficiencyLevel',
  'atsSystem', 'dataSources', 'signature', 'topLanguages',
]);

const URL_RE = /^https?:\/\//i;
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}/;

function isSkippableValue(v: string): boolean {
  if (v.length <= 2) return true;
  if (URL_RE.test(v)) return true;
  if (ISO_DATE_RE.test(v)) return true;
  if (/^\d+(\.\d+)?$/.test(v)) return true;
  return false;
}

export interface ExtractedEntry {
  /** Dot-path to the value, e.g. "strengths.0.title" */
  path: string;
}

/**
 * Walk `obj` recursively and collect all translatable strings.
 * Returns parallel arrays: `entries[i]` is the path, `texts[i]` is the string.
 */
export function extractTranslatableStrings(result: AnalysisResult): {
  entries: ExtractedEntry[];
  texts: string[];
} {
  const entries: ExtractedEntry[] = [];
  const texts: string[] = [];

  function walk(node: unknown, path: string): void {
    if (node === null || node === undefined) return;
    if (typeof node === 'string') {
      if (!isSkippableValue(node)) {
        entries.push({ path });
        texts.push(node);
      }
      return;
    }
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, `${path}.${i}`));
      return;
    }
    if (typeof node === 'object') {
      for (const [key, value] of Object.entries(node as Record<string, unknown>)) {
        if (SKIP_KEYS.has(key)) continue;
        walk(value, path ? `${path}.${key}` : key);
      }
    }
  }

  walk(result, '');
  return { entries, texts };
}

/**
 * Deep-clone `result` and inject translated strings at the recorded paths.
 */
export function injectTranslatedStrings(
  result: AnalysisResult,
  entries: ExtractedEntry[],
  translatedTexts: string[],
): AnalysisResult {
  // Deep clone so we never mutate the original
  const clone = JSON.parse(JSON.stringify(result)) as AnalysisResult;

  entries.forEach(({ path }, i) => {
    const translated = translatedTexts[i];
    if (translated === undefined) return;
    setPath(clone as unknown as Record<string, unknown>, path, translated);
  });

  return clone;
}

function setPath(obj: Record<string, unknown>, path: string, value: string): void {
  const parts = path.replace(/^\./, '').split('.');
  let current: unknown = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i];
    if (current === null || typeof current !== 'object') return;
    current = (current as Record<string, unknown>)[key];
  }
  if (current !== null && typeof current === 'object') {
    (current as Record<string, unknown>)[parts[parts.length - 1]] = value;
  }
}
