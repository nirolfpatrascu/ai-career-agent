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
            {/* Testimonial-style quote */}
            <div className="max-w-2xl mx-auto text-center mb-10">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="mx-auto mb-4 text-primary/30">
                <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z" fill="currentColor"/>
                <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z" fill="currentColor"/>
              </svg>
              <p className="text-lg sm:text-xl text-text-primary leading-relaxed font-medium italic mb-4">
                {t('cta.quote')}
              </p>
              <p className="text-sm text-text-tertiary">
                {t('cta.quoteAuthor')}
              </p>
            </div>

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