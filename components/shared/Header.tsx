'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';
import { useTranslation, LOCALE_NAMES } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';
import UserMenu from '@/components/auth/UserMenu';

const LOCALE_SHORT: Record<Locale, string> = {
  en: 'EN', ro: 'RO', de: 'DE', fr: 'FR', es: 'ES', it: 'IT',
};

function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="flex-shrink-0">
        <defs>
          <linearGradient id="hlogo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#E8890A"/>
            <stop offset="100%" stopColor="#EA7E2E"/>
          </linearGradient>
        </defs>
        <rect width="32" height="32" rx="8" fill="#1C1410" className="transition-all duration-300 group-hover:fill-[#2A2118]"/>
        <rect x="1" y="1" width="30" height="30" rx="7" stroke="url(#hlogo)" strokeWidth="1.5" fill="none" opacity="0.4"/>
        <path d="M9 16 L14 21 L23 11" stroke="url(#hlogo)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      </svg>
      <span className="text-xl font-bold tracking-tight font-display">
        <span className="text-text-primary">Gap</span>
        <span className="text-gradient">Zero</span>
      </span>
    </Link>
  );
}

function GlobeIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-50">
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  );
}

export default function Header() {
  const pathname = usePathname();
  const { t, locale, setLocale } = useTranslation();
  const [langOpen, setLangOpen] = useState(false);
  const langRef = useRef<HTMLDivElement>(null);
  const isLanding = pathname === '/';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 no-print">
      <div className="mx-auto max-w-container px-4 sm:px-6 py-3">
        <nav className="flex items-center justify-between bg-white/80 backdrop-blur-2xl border border-black/[0.06] rounded-2xl px-5 sm:px-6 py-3 shadow-sm shadow-black/[0.04]">
          <Logo />

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Landing page nav links — bigger, more spaced */}
            {isLanding && (
              <div className="hidden sm:flex items-center gap-2">
                <a href="#features" className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-xl hover:bg-black/[0.04]">
                  {t('common.features')}
                </a>
                <a href="#how-it-works" className="text-base font-medium text-text-secondary hover:text-text-primary transition-colors px-4 py-2 rounded-xl hover:bg-black/[0.04]">
                  {t('common.howItWorks')}
                </a>
              </div>
            )}

            {/* Language switcher */}
            <div ref={langRef} className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors px-3 py-2 rounded-xl hover:bg-black/[0.04]"
              >
                <GlobeIcon />
                <span>{LOCALE_SHORT[locale]}</span>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`transition-transform duration-200 opacity-40 ${langOpen ? 'rotate-180' : ''}`}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {langOpen && (
                <div className="absolute right-0 top-full mt-2 w-44 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-lg shadow-black/[0.06] py-1.5 z-50">
                  {(Object.keys(LOCALE_NAMES) as Locale[]).map((loc) => (
                    <button
                      key={loc}
                      onClick={() => { setLocale(loc); setLangOpen(false); }}
                      className={`w-full text-left px-3.5 py-2.5 text-sm flex items-center justify-between transition-colors rounded-lg mx-0.5 ${
                        locale === loc
                          ? 'text-primary bg-primary/[0.06] font-medium'
                          : 'text-text-secondary hover:text-text-primary hover:bg-black/[0.03]'
                      }`}
                      style={{ width: 'calc(100% - 4px)' }}
                    >
                      <span>{LOCALE_NAMES[loc]}</span>
                      <span className="text-xs text-text-tertiary">{LOCALE_SHORT[loc]}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User menu */}
            <UserMenu />

            {/* CTA */}
            <Link
              href="/analyze"
              className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl ml-1"
            >
              <span className="hidden sm:inline">{t('common.analyzeMyCareer')}</span>
              <span className="sm:hidden">Analyze</span>
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
