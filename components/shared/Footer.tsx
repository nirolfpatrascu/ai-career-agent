'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
      <defs>
        <linearGradient id="flogo" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6"/>
          <stop offset="100%" stopColor="#06B6D4"/>
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="#111113"/>
      <rect x="1" y="1" width="30" height="30" rx="7" stroke="url(#flogo)" strokeWidth="1.5" fill="none" opacity="0.4"/>
      <path d="M9 16 L14 21 L23 11" stroke="url(#flogo)" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-white/[0.04]">
      <div className="max-w-container mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Logo + brand */}
          <div className="flex items-center gap-3">
            <LogoMark />
            <span className="text-base font-semibold text-text-primary font-display tracking-tight">
              Gap<span className="text-gradient">Zero</span>
            </span>
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-sm text-text-tertiary">
            <Link href="/#features" className="hover:text-text-secondary transition-colors">
              {t('common.features')}
            </Link>
            <Link href="/#how-it-works" className="hover:text-text-secondary transition-colors">
              {t('common.howItWorks')}
            </Link>
            <Link href="/analyze" className="hover:text-text-secondary transition-colors">
              {t('common.analyzeMyCareer')}
            </Link>
          </div>

          {/* Credits */}
          <div className="text-sm text-text-tertiary flex items-center gap-1.5">
            {t('common.builtBy')}{' '}
            <a
              href="https://linkedin.com/in/florinpatrascu"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-secondary hover:text-primary transition-colors font-medium"
            >
              Florin Pătrascu
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
