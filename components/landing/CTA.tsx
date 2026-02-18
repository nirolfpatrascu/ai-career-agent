'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-28 sm:py-36">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl border border-white/[0.10]">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.12] via-white/[0.03] to-accent-cyan/[0.10]" />
          <div className="absolute inset-0 grid-bg opacity-40" />

          {/* Glow orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/15 blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-accent-cyan/12 blur-[80px]" />

          <div className="relative z-10 text-center py-16 sm:py-20 px-6">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white mb-5">
              {t('cta.title')}
            </h2>
            <p className="max-w-xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed mb-10">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/analyze"
              className="group btn-primary text-base sm:text-lg px-10 py-4 inline-flex items-center gap-3 rounded-2xl"
            >
              {t('cta.button')}
              <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-6 text-sm text-text-secondary">
              {t('cta.footer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}