'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { AnalysisResult } from '@/lib/types';
import type { Locale } from '@/lib/i18n';
import { extractTranslatableStrings, injectTranslatedStrings } from '@/lib/translate-result';

export type TranslationStatus = 'idle' | 'translating' | 'done' | 'error';

const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000; // 7 days
const BATCH_SIZE = 50;

interface CacheEntry {
  result: AnalysisResult;
  expiresAt: number;
}

function cacheKey(hash: string, locale: string): string {
  return `gapzero_tr2_${locale}_${hash}`;
}

/** Cheap but sufficient content hash — first 200 chars of JSON */
function hashResult(result: AnalysisResult): string {
  const s = JSON.stringify(result).slice(0, 200);
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (Math.imul(31, h) + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h).toString(36);
}

function readCache(hash: string, locale: string): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(cacheKey(hash, locale));
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (Date.now() > entry.expiresAt) {
      localStorage.removeItem(cacheKey(hash, locale));
      return null;
    }
    return entry.result;
  } catch {
    return null;
  }
}

function writeCache(hash: string, locale: string, result: AnalysisResult): void {
  try {
    const entry: CacheEntry = { result, expiresAt: Date.now() + CACHE_TTL_MS };
    localStorage.setItem(cacheKey(hash, locale), JSON.stringify(entry));
  } catch {
    // Storage full — silently ignore
  }
}

async function translateBatch(texts: string[], targetLang: string, signal: AbortSignal): Promise<string[]> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts, targetLang }),
    signal,
  });
  if (!res.ok) throw new Error(`translate API ${res.status}`);
  const data = await res.json() as { translations: string[] };
  return data.translations;
}

export function useTranslatedResult(
  result: AnalysisResult | null,
  locale: Locale,
): {
  displayResult: AnalysisResult | null;
  translationStatus: TranslationStatus;
  translationError: string | null;
  retryTranslation: () => void;
} {
  const [displayResult, setDisplayResult] = useState<AnalysisResult | null>(result);
  const [translationStatus, setTranslationStatus] = useState<TranslationStatus>('idle');
  const [translationError, setTranslationError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const retryCountRef = useRef(0);

  const runTranslation = useCallback(async (r: AnalysisResult, lang: Locale, attempt: number) => {
    // English — no-op
    if (lang === 'en') {
      setDisplayResult(r);
      setTranslationStatus('done');
      return;
    }

    const hash = hashResult(r);

    // Check cache first
    const cached = readCache(hash, lang);
    if (cached) {
      setDisplayResult(cached);
      setTranslationStatus('done');
      return;
    }

    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    // Show English original immediately while translation runs
    setDisplayResult(r);
    setTranslationStatus('translating');
    setTranslationError(null);

    try {
      const { entries, texts } = extractTranslatableStrings(r);

      // Translate in batches of BATCH_SIZE
      const allTranslated: string[] = [];
      for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        const translated = await translateBatch(batch, lang, controller.signal);
        allTranslated.push(...translated);
      }

      const translated = injectTranslatedStrings(r, entries, allTranslated);
      writeCache(hash, lang, translated);
      setDisplayResult(translated);
      setTranslationStatus('done');
    } catch (err) {
      if ((err as Error).name === 'AbortError') return; // Intentionally cancelled
      console.error('Translation error:', err);
      setTranslationError(String(err));
      setTranslationStatus('error');
      // Fall back to English original so content is still visible
      setDisplayResult(r);
    }
  }, []);

  useEffect(() => {
    if (!result) {
      setDisplayResult(null);
      setTranslationStatus('idle');
      return;
    }
    retryCountRef.current = 0;
    runTranslation(result, locale, 0);

    return () => {
      abortRef.current?.abort();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result, locale]);

  const retryTranslation = useCallback(() => {
    if (!result) return;
    retryCountRef.current++;
    runTranslation(result, locale, retryCountRef.current);
  }, [result, locale, runTranslation]);

  return { displayResult, translationStatus, translationError, retryTranslation };
}
