'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import en from './translations/en.json';
import ro from './translations/ro.json';
import de from './translations/de.json';

export type Locale = 'en' | 'ro' | 'de';

export const LOCALE_NAMES: Record<Locale, string> = {
  en: 'English',
  ro: 'Romana',
  de: 'Deutsch',
};

export const LOCALE_FLAGS: Record<Locale, string> = {
  en: '🇬🇧',
  ro: '🇷🇴',
  de: '🇩🇪',
};

type TranslationDict = Record<string, unknown>;
const translations: Record<Locale, TranslationDict> = { en, ro, de };

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split('.');
  let current: unknown = obj;
  for (const key of keys) {
    if (current === null || current === undefined || typeof current !== 'object') {
      return path; // Return key as fallback
    }
    current = (current as Record<string, unknown>)[key];
  }
  return typeof current === 'string' ? current : path;
}

function interpolate(str: string, params?: Record<string, string | number>): string {
  if (!params) return str;
  return str.replace(/\{(\w+)\}/g, (_, key) => {
    return params[key] !== undefined ? String(params[key]) : `{${key}}`;
  });
}

function getInitialLocale(): Locale {
  if (typeof window === 'undefined') return 'en';
  // Check cookie
  const match = document.cookie.match(/(?:^|; )locale=([^;]*)/);
  if (match) {
    const val = match[1] as Locale;
    if (val in translations) return val;
  }
  // Check browser language
  const browserLang = navigator.language.slice(0, 2).toLowerCase();
  if (browserLang in translations) return browserLang as Locale;
  return 'en';
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setLocaleState(getInitialLocale());
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    document.cookie = `locale=${newLocale};path=/;max-age=${60 * 60 * 24 * 365}`;
    document.documentElement.lang = newLocale;
  }, []);

  const t = useCallback(
    (key: string, params?: Record<string, string | number>): string => {
      const dict = translations[locale] || translations.en;
      const value = getNestedValue(dict, key);
      // Fallback to English if key not found in current locale
      const resolved = value === key ? getNestedValue(translations.en, key) : value;
      return interpolate(resolved, params);
    },
    [locale]
  );

  // Prevent hydration mismatch by rendering children only after mount
  if (!mounted) {
    return (
      <I18nContext.Provider value={{ locale: 'en', setLocale, t: (key) => getNestedValue(translations.en, key) }}>
        {children}
      </I18nContext.Provider>
    );
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useTranslation must be used within I18nProvider');
  return ctx;
}
