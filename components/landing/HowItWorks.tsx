'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';

const STEP_ICONS = [
  // Upload
  <svg key="0" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>,
  // Tell Us
  <svg key="1" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  // Get Roadmap
  <svg key="2" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
];

export default function HowItWorks() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    );

    const els = sectionRef.current?.querySelectorAll('.fade-in-up');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const steps = t('howItWorks.steps') as unknown as { title: string; description: string }[];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-28 sm:py-36">
      {/* Subtle top divider */}
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-black/[0.08] to-transparent" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-16 sm:mb-20 fade-in-up">
          <div className="section-badge mb-5">
            {t('howItWorks.sectionLabel')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            {t('howItWorks.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed">
            {t('howItWorks.subtitle')}
          </p>
        </div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto">
          {Array.isArray(steps) && steps.map((step, i) => (
            <div key={i} className="fade-in-up relative flex gap-6 sm:gap-8" style={{ transitionDelay: `${i * 120}ms` }}>
              {/* Timeline */}
              <div className="flex flex-col items-center flex-shrink-0">
                {/* Number circle */}
                <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-accent-orange/15 border border-primary/25 flex items-center justify-center text-primary">
                  {STEP_ICONS[i]}
                  {/* Step number badge */}
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-gradient-to-r from-primary to-accent-orange text-[10px] font-bold text-white flex items-center justify-center">
                    {i + 1}
                  </div>
                </div>
                {/* Connector line */}
                {i < steps.length - 1 && (
                  <div className="w-px flex-1 my-3 bg-gradient-to-b from-primary/30 to-transparent min-h-[40px]" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-12 ${i === steps.length - 1 ? 'pb-0' : ''}`}>
                <h3 className="text-xl sm:text-2xl font-bold text-text-primary mb-2 tracking-tight">
                  {step.title}
                </h3>
                <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}