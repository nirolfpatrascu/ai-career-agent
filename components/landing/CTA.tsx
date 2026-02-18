'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

export default function CTA() {
  const { t } = useTranslation();

  return (
    <section className="py-24">
      <div className="max-w-container mx-auto px-6">
        <div className="relative overflow-hidden rounded-2xl border border-card-border bg-card p-12 sm:p-16 text-center">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-primary/10 rounded-full blur-[100px]" />
          </div>
          <div className="relative z-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-text-primary mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-lg text-text-secondary max-w-xl mx-auto mb-8">
              {t('cta.subtitle')}
            </p>
            <Link
              href="/analyze"
              className="group btn-primary text-lg px-10 py-4 inline-flex items-center gap-3 shadow-lg shadow-primary/20"
            >
              {t('cta.button')}
              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="text-sm text-text-secondary mt-6">
              {t('cta.footer')}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
