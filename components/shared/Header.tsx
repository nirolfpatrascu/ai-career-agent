'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useTranslation, LOCALE_NAMES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN',
  ro: 'RO',
  de: 'DE',
};

function GlobeIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Header() {
  const { t, locale, setLocale } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-card-border bg-background/80 backdrop-blur-xl">
      <div className="max-w-container mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
            </svg>
          </div>
          <span className="text-lg font-semibold text-text-primary">
            Gap<span className="text-primary">Zero</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4 sm:gap-6">
          <Link
            href="/#features"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            {t('common.features')}
          </Link>
          <Link
            href="/#how-it-works"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors hidden sm:block"
          >
            {t('common.howItWorks')}
          </Link>

          {/* Language switcher */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setLangOpen(!langOpen)}
              className="flex items-center gap-1.5 text-sm text-text-secondary hover:text-text-primary transition-colors px-2.5 py-1.5 rounded-lg hover:bg-card border border-transparent hover:border-card-border"
              aria-label="Change language"
            >
              <GlobeIcon />
              <span className="font-medium">{LOCALE_SHORT[locale]}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {langOpen && (
              <div className="absolute right-0 top-full mt-2 bg-card border border-card-border rounded-xl shadow-lg overflow-hidden min-w-[160px] z-50">
                {(Object.keys(LOCALE_NAMES) as Locale[]).map((loc) => (
                  <button
                    key={loc}
                    onClick={() => {
                      setLocale(loc);
                      setLangOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                      locale === loc
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-secondary hover:bg-card-border/50 hover:text-text-primary'
                    }`}
                  >
                    <span className="font-medium w-6">{LOCALE_SHORT[loc]}</span>
                    <span>{LOCALE_NAMES[loc]}</span>
                    {locale === loc && (
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="ml-auto">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link
            href="/analyze"
            className="text-sm font-medium bg-primary hover:bg-primary-hover text-white px-4 py-2 rounded-lg transition-all duration-200"
          >
            {t('common.analyzeMyCareer')}
          </Link>
        </nav>
      </div>
    </header>
  );
}