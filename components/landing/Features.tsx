'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

const FEATURE_ICONS = [
  // CV Deep Analysis
  <svg key="0" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  // Gap Analysis
  <svg key="1" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  // Salary
  <svg key="2" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>,
  // Role Recommendations
  <svg key="3" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  // Action Plan
  <svg key="4" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
  // AI Coach
  <svg key="5" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
];

// Sample output previews shown inside each card
const FEATURE_PREVIEWS = [
  // CV Analysis — skill tags
  () => (
    <div className="mt-4 flex flex-wrap gap-1.5">
      {['Python', 'RPA', 'API Design', 'CI/CD', 'SQL', 'Agile', '+8'].map((s) => (
        <span key={s} className={`text-[10px] font-semibold px-2 py-1 rounded-md ${
          s === '+8' ? 'bg-primary/10 text-primary' : 'bg-black/[0.04] text-text-secondary'
        }`}>{s}</span>
      ))}
    </div>
  ),
  // Gap Analysis — severity bars
  () => (
    <div className="mt-4 space-y-2">
      {[
        { label: 'Cloud (AWS/Azure)', severity: 'critical', w: '85%' },
        { label: 'TypeScript', severity: 'moderate', w: '55%' },
        { label: 'Docker', severity: 'minor', w: '30%' },
      ].map((g) => (
        <div key={g.label}>
          <div className="flex items-center justify-between text-[10px] mb-0.5">
            <span className="text-text-secondary font-medium">{g.label}</span>
            <span className={`font-semibold ${
              g.severity === 'critical' ? 'text-danger' : g.severity === 'moderate' ? 'text-warning' : 'text-success'
            }`}>{g.severity}</span>
          </div>
          <div className="h-1.5 rounded-full bg-black/[0.04]">
            <div className={`h-full rounded-full transition-all duration-1000 ${
              g.severity === 'critical' ? 'bg-danger' : g.severity === 'moderate' ? 'bg-warning' : 'bg-success'
            }`} style={{ width: g.w }} />
          </div>
        </div>
      ))}
    </div>
  ),
  // Salary — range visualization
  () => (
    <div className="mt-4">
      <div className="flex items-end justify-between gap-1 h-12 mb-1.5">
        {[35, 48, 55, 70, 80, 95, 100, 85, 70].map((h, i) => (
          <div key={i} className="flex-1 rounded-t-sm bg-gradient-to-t from-primary/20 to-primary/40 transition-all duration-500" style={{ height: `${h}%` }} />
        ))}
      </div>
      <div className="flex justify-between text-[10px] text-text-tertiary font-medium">
        <span>€45K</span>
        <span className="text-primary font-semibold">€75K</span>
        <span>€120K</span>
      </div>
    </div>
  ),
  // Role Recommendations — fit cards
  () => (
    <div className="mt-4 space-y-1.5">
      {[
        { role: 'Solutions Architect', score: 8 },
        { role: 'AI Consultant', score: 7 },
        { role: 'Tech Lead', score: 6 },
      ].map((r) => (
        <div key={r.role} className="flex items-center justify-between bg-black/[0.03] rounded-lg px-2.5 py-1.5">
          <span className="text-[11px] text-text-secondary font-medium">{r.role}</span>
          <span className="text-[10px] font-bold text-primary">{r.score}/10</span>
        </div>
      ))}
    </div>
  ),
  // Action Plan — timeline
  () => (
    <div className="mt-4 space-y-2">
      {[
        { label: '30 days', items: '5 actions', color: 'bg-success' },
        { label: '90 days', items: '4 actions', color: 'bg-primary' },
        { label: '12 months', items: '3 goals', color: 'bg-accent-rose' },
      ].map((p) => (
        <div key={p.label} className="flex items-center gap-2.5">
          <div className={`w-2 h-2 rounded-full ${p.color} flex-shrink-0`} />
          <div className="flex items-center justify-between flex-1 text-[11px]">
            <span className="font-semibold text-text-primary">{p.label}</span>
            <span className="text-text-tertiary">{p.items}</span>
          </div>
        </div>
      ))}
    </div>
  ),
  // AI Coach — chat bubbles
  () => (
    <div className="mt-4 space-y-2">
      <div className="bg-black/[0.04] rounded-lg rounded-bl-sm px-2.5 py-1.5 text-[10px] text-text-secondary max-w-[85%]">
        How should I prepare for the SA interview?
      </div>
      <div className="bg-primary/10 rounded-lg rounded-br-sm px-2.5 py-1.5 text-[10px] text-primary ml-auto max-w-[85%]">
        Based on your gaps, focus on system design and cloud architecture...
      </div>
    </div>
  ),
];

export default function Features() {
  const { t } = useTranslation();
  const sectionRef = useRef<HTMLElement>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

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

  const cards = t('features.cards') as unknown as { title: string; description: string; highlight: string }[];

  return (
    <section id="features" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-container mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-18 fade-in-up">
          <div className="section-badge mb-5">
            {t('features.sectionLabel')}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            {t('features.title')}
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed">
            {t('features.subtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.isArray(cards) && cards.map((card, i) => {
            const Preview = FEATURE_PREVIEWS[i];
            return (
              <div
                key={i}
                className="fade-in-up group relative bg-white border border-black/[0.06] rounded-2xl p-7 transition-all duration-500 hover:shadow-lg hover:shadow-black/[0.06] hover:border-primary/20 hover:-translate-y-1"
                style={{ transitionDelay: `${i * 80}ms` }}
                onMouseEnter={() => setHoveredCard(i)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                {/* Icon */}
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-primary/15 to-accent-orange/10 border border-primary/10 flex items-center justify-center text-primary mb-4 transition-transform duration-500 group-hover:scale-110">
                  {FEATURE_ICONS[i]}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-text-primary mb-2 tracking-tight">
                  {card.title}
                </h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {card.description}
                </p>

                {/* Highlight tag */}
                {card.highlight && (
                  <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-primary bg-primary/[0.06] rounded-full px-2.5 py-1">
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                    {card.highlight}
                  </div>
                )}

                {/* Interactive preview */}
                {Preview && <Preview />}

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(300px circle at 50% 50%, rgba(232,137,10,0.04), transparent 70%)' }}
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}