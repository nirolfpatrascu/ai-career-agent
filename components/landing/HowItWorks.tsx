'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Upload, Sparkles, Rocket } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ─── Step mockups (pure CSS/Tailwind) ─── */

function UploadMockup() {
  const [uploaded, setUploaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setUploaded(true), 1200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="w-full space-y-2.5 px-2">
      {/* PDF indicator */}
      <div className={`border-2 border-dashed rounded-lg p-3 text-center transition-all duration-500 ${
        uploaded ? 'border-[#22C55E]/40 bg-[#22C55E]/[0.04]' : 'border-black/[0.08]'
      }`}>
        {uploaded ? (
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#22C55E] font-bold text-sm">&#10003;</span>
            <span className="text-[10px] font-semibold text-[#22C55E]">Resume.pdf uploaded</span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-[#9CA3AF]">
            <Upload className="w-4 h-4" />
            <span className="text-[10px]">Drop your CV here...</span>
          </div>
        )}
      </div>
      {/* Form fields */}
      {[
        { label: 'Current Role', value: 'RPA Developer' },
        { label: 'Target Role', value: 'AI Solutions Architect' },
        { label: 'Country', value: 'Romania' },
      ].map((f) => (
        <div key={f.label}>
          <div className="text-[9px] font-medium text-[#9CA3AF] mb-0.5">{f.label}</div>
          <div className="bg-black/[0.03] border border-black/[0.06] rounded-md px-2 py-1 text-[10px] text-[#1A1A1A]">{f.value}</div>
        </div>
      ))}
    </div>
  );
}

function AnalysisMockup() {
  const [done, setDone] = useState(0);
  useEffect(() => {
    const items = [600, 1000, 1400, 1800];
    const timers = items.map((ms, i) => setTimeout(() => setDone(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, []);

  const steps = [
    'Skills extracted',
    'Gaps identified',
    'Salary benchmarked',
    'Roadmap built',
  ];

  return (
    <div className="w-full space-y-2 px-2">
      {steps.map((label, i) => (
        <div key={label} className="flex items-center gap-2.5">
          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold transition-all duration-300 ${
            i < done
              ? 'bg-[#22C55E] text-white'
              : 'bg-black/[0.04] text-[#9CA3AF]'
          }`}>
            {i < done ? '✓' : '·'}
          </div>
          <span className={`text-[11px] transition-colors duration-300 ${
            i < done ? 'text-[#1A1A1A] font-medium' : 'text-[#9CA3AF]'
          }`}>{label}</span>
        </div>
      ))}
      {done >= 4 && (
        <div className="mt-1 text-center">
          <span className="text-[9px] font-semibold text-[#E8890A]">Analysis complete!</span>
        </div>
      )}
    </div>
  );
}

function PlaybookMockup() {
  return (
    <div className="w-full px-2">
      {/* Mini dashboard header */}
      <div className="flex items-center gap-1 mb-3 pb-2 border-b border-black/[0.06]">
        {[
          { label: 'Score', active: true },
          { label: 'Gaps', active: false },
          { label: 'Salary', active: false },
          { label: 'Coach', active: false },
        ].map((tab) => (
          <div
            key={tab.label}
            className={`text-[9px] font-medium px-2 py-1 rounded-md ${
              tab.active ? 'bg-[#E8890A]/10 text-[#E8890A]' : 'text-[#9CA3AF]'
            }`}
          >
            {tab.label}
          </div>
        ))}
      </div>
      {/* Mini score display */}
      <div className="flex items-center gap-3 mb-3">
        <div className="relative w-10 h-10">
          <svg className="-rotate-90" viewBox="0 0 40 40">
            <circle cx="20" cy="20" r="16" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="3" />
            <circle cx="20" cy="20" r="16" fill="none" stroke="#E8890A" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={`${72 * 1.005} ${100 * 1.005}`} />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-[#E8890A]">7.2</span>
        </div>
        <div>
          <div className="text-[10px] font-semibold text-[#1A1A1A]">Strong Fit</div>
          <div className="text-[8px] text-[#9CA3AF]">AI Solutions Architect</div>
        </div>
      </div>
      {/* Mini stat row */}
      <div className="grid grid-cols-3 gap-1.5">
        {[
          { val: '5', label: 'Strengths', color: 'text-[#22C55E]' },
          { val: '3', label: 'Gaps', color: 'text-[#EAB308]' },
          { val: '12', label: 'Actions', color: 'text-[#E8890A]' },
        ].map((s) => (
          <div key={s.label} className="bg-black/[0.02] rounded-md p-1.5 text-center">
            <div className={`text-xs font-bold ${s.color}`}>{s.val}</div>
            <div className="text-[8px] text-[#9CA3AF]">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Step definitions ─── */

const STEPS: { key: string; Icon: LucideIcon; Mockup: React.ComponentType }[] = [
  { key: 'step1', Icon: Upload, Mockup: UploadMockup },
  { key: 'step2', Icon: Sparkles, Mockup: AnalysisMockup },
  { key: 'step3', Icon: Rocket, Mockup: PlaybookMockup },
];

/* ─── Component ─── */

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
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );
    const els = sectionRef.current?.querySelectorAll('.fade-in-up');
    els?.forEach((el) => observer.observe(el));
    const timeout = setTimeout(() => {
      els?.forEach((el) => el.classList.add('visible'));
    }, 1000);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <section id="how-it-works" ref={sectionRef} className="relative py-24 sm:py-32 bg-surface-raised">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-18 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            {t('howItWorks.sectionTitle')}
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed">
            {t('howItWorks.sectionSubtitle')}
          </p>
        </div>

        {/* Steps row with connecting line */}
        <div className="relative">
          {/* Connecting dashed line — desktop only */}
          <div className="hidden lg:block absolute top-5 left-[calc(16.67%+20px)] right-[calc(16.67%+20px)] h-[2px] border-t-2 border-dashed border-black/[0.1]" />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-6">
            {STEPS.map(({ key, Mockup }, i) => (
              <div
                key={key}
                className="fade-in-up relative flex flex-col items-center text-center"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Step number badge */}
                <div className="w-10 h-10 rounded-full bg-[#E8890A] text-white font-bold flex items-center justify-center text-lg mb-4 relative z-10">
                  {i + 1}
                </div>

                {/* Card */}
                <div className="bg-white rounded-2xl border border-black/[0.08] p-6 w-full transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.06]">
                  {/* Visual mockup area */}
                  <div className="h-48 mb-5 rounded-xl bg-[#FAF8F5] border border-black/[0.04] flex items-center justify-center overflow-hidden">
                    <Mockup />
                  </div>

                  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">
                    {t(`howItWorks.${key}.title`)}
                  </h3>
                  <p className="text-[#6B7280] text-sm leading-relaxed">
                    {t(`howItWorks.${key}.desc`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
