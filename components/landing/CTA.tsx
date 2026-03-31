'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="relative py-24 sm:py-32">
      <div className="max-w-container mx-auto px-4 sm:px-6">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-black/[0.06] shadow-sm">
          {/* Gradient bg */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.06] via-transparent to-accent-orange/[0.04]" />
          <div className="absolute inset-0 grid-bg opacity-30" />

          {/* Glow orbs */}
          <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute -bottom-20 -right-20 w-60 h-60 rounded-full bg-accent-orange/8 blur-[80px]" />

          <div className="relative z-10 py-16 sm:py-20 px-6">
            {/* CTA */}
            <div className="text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-text-primary mb-4">
                {t('cta.title')}
              </h2>
              <p className="max-w-xl mx-auto text-text-secondary text-base leading-relaxed mb-8">
                {t('cta.subtitle')}
              </p>
              <Link
                href="/analyze"
                className="group btn-primary text-base sm:text-lg px-10 py-4 inline-flex items-center gap-3 rounded-2xl"
              >
                {t('cta.button')}
                <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <p className="mt-5 text-sm text-text-tertiary flex items-center justify-center gap-4">
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('cta.noSignup')}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('cta.noCreditCard')}
                </span>
                <span className="flex items-center gap-1.5">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('cta.resultsIn2Min')}
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
