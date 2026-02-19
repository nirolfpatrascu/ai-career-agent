'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

// Mini mockup UIs for each step
function UploadMockup() {
  const [uploaded, setUploaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setUploaded(true), 1200);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bg-white border border-black/[0.06] rounded-xl p-4 shadow-sm">
      <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-500 ${
        uploaded ? 'border-success/40 bg-success/[0.04]' : 'border-black/[0.08]'
      }`}>
        {uploaded ? (
          <div className="flex items-center justify-center gap-2">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span className="text-xs font-semibold text-success">Resume_2026.pdf uploaded</span>
          </div>
        ) : (
          <>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto text-text-tertiary mb-2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            <span className="text-[11px] text-text-tertiary">Drop your CV here...</span>
          </>
        )}
      </div>
    </div>
  );
}

function QuestionnaireMockup() {
  return (
    <div className="bg-white border border-black/[0.06] rounded-xl p-4 shadow-sm space-y-2.5">
      {[
        { label: 'Current Role', value: 'RPA Developer' },
        { label: 'Target Role', value: 'AI Solutions Architect' },
        { label: 'Location', value: 'Romania 🇷🇴' },
      ].map((f) => (
        <div key={f.label}>
          <div className="text-[10px] font-medium text-text-tertiary mb-0.5">{f.label}</div>
          <div className="bg-black/[0.03] border border-black/[0.06] rounded-lg px-2.5 py-1.5 text-xs text-text-primary">{f.value}</div>
        </div>
      ))}
    </div>
  );
}

function ResultsMockup() {
  const [score, setScore] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setScore(7.2), 800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="bg-white border border-black/[0.06] rounded-xl p-4 shadow-sm">
      {/* Score */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-12 h-12">
          <svg viewBox="0 0 36 36" className="w-12 h-12 -rotate-90">
            <circle cx="18" cy="18" r="14" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
            <circle cx="18" cy="18" r="14" fill="none" stroke="#E8890A" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${score * 8.8} 88`}
              className="transition-all duration-1000 ease-out" />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-primary">
            {score > 0 ? score.toFixed(1) : '—'}
          </span>
        </div>
        <div>
          <div className="text-xs font-semibold text-text-primary">Strong Fit</div>
          <div className="text-[10px] text-text-tertiary">for AI Solutions Architect</div>
        </div>
      </div>
      {/* Mini results */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { label: 'Strengths', val: '5', color: 'text-success' },
          { label: 'Gaps', val: '3', color: 'text-warning' },
          { label: 'Actions', val: '12', color: 'text-primary' },
        ].map((s) => (
          <div key={s.label} className="bg-black/[0.02] rounded-lg p-2 text-center">
            <div className={`text-sm font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[9px] text-text-tertiary font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

const STEP_MOCKUPS = [UploadMockup, QuestionnaireMockup, ResultsMockup];

export default function HowItWorks() {
  const { t, tRaw } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    const els = sectionRef.current?.querySelectorAll('.fade-in-up');
    els?.forEach((el) => observer.observe(el));
    const timeout = setTimeout(() => {
      els?.forEach((el) => el.classList.add('visible'));
    }, 1000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  const steps = tRaw('howItWorks.steps') as { title: string; description: string; detail: string }[];

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 sm:py-32 bg-surface-raised">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-18 fade-in-up">
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

        {/* Steps — alternating layout */}
        <div className="max-w-4xl mx-auto space-y-16 sm:space-y-20">
          {Array.isArray(steps) && steps.map((step, i) => {
            const Mockup = STEP_MOCKUPS[i];
            const isEven = i % 2 === 0;
            return (
              <div key={i} className="fade-in-up" style={{ transitionDelay: `${i * 120}ms` }}>
                <div className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-8 md:gap-12`}>
                  {/* Text */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="w-8 h-8 rounded-full bg-gradient-to-r from-primary to-accent-orange text-white text-sm font-bold flex items-center justify-center flex-shrink-0">
                        {i + 1}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-bold text-text-primary tracking-tight">
                        {step.title}
                      </h3>
                    </div>
                    <p className="text-text-secondary leading-relaxed text-base mb-3">
                      {step.description}
                    </p>
                    {step.detail && (
                      <p className="text-sm text-text-tertiary leading-relaxed italic">
                        {step.detail}
                      </p>
                    )}
                  </div>

                  {/* Mockup */}
                  <div className="flex-1 w-full max-w-sm">
                    {Mockup && <Mockup />}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Time estimate */}
        <div className="text-center mt-16 fade-in-up">
          <div className="inline-flex items-center gap-2.5 bg-white border border-black/[0.06] rounded-full px-5 py-2.5 shadow-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
            <span className="text-sm font-medium text-text-primary">{t('howItWorks.timeEstimate')}</span>
          </div>
        </div>
      </div>
    </section>
  );
}