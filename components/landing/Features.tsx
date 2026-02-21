'use client';

import { useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { Target, TrendingUp, Shield, MessageSquare, FileText, Map } from 'lucide-react';

/* ─── Mini-mockups (pure CSS/Tailwind, no images/SVGs/external assets) ─── */

function GapAnalysisMockup() {
  return (
    <div className="flex items-center gap-4">
      {/* Fit score ring */}
      <div className="relative w-16 h-16 flex-shrink-0">
        <svg className="-rotate-90" viewBox="0 0 64 64">
          <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
          <circle cx="32" cy="32" r="28" fill="none" stroke="#E8890A" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${72 * 1.76} ${100 * 1.76}`} />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-base font-bold text-[#E8890A] leading-none">7.2</span>
          <span className="text-[8px] text-[#9CA3AF]">/10</span>
        </span>
      </div>
      {/* Severity pills */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444]">Critical &times; 1</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EAB308]/10 text-[#EAB308]">Moderate &times; 2</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">Minor &times; 1</span>
      </div>
    </div>
  );
}

function SalaryMockup() {
  return (
    <div className="w-full space-y-3 px-1">
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-[#6B7280] font-medium">Current</span>
          <span className="font-semibold text-[#6B7280]">&euro;48K</span>
        </div>
        <div className="h-2.5 rounded-full bg-black/[0.04]">
          <div className="h-full rounded-full bg-[#6B7280]/40 transition-all duration-700" style={{ width: '55%' }} />
        </div>
      </div>
      <div>
        <div className="flex justify-between text-[10px] mb-1">
          <span className="text-[#22C55E] font-medium">Target</span>
          <span className="font-semibold text-[#22C55E]">&euro;80K</span>
        </div>
        <div className="h-2.5 rounded-full bg-black/[0.04]">
          <div className="h-full rounded-full bg-[#22C55E] transition-all duration-700" style={{ width: '85%' }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-[#22C55E]">&uarr; +67% growth</span>
        <span className="text-[8px] font-medium px-1.5 py-0.5 rounded bg-black/[0.04] text-[#9CA3AF]">US Gov (BLS)</span>
      </div>
    </div>
  );
}

function ATSMockup() {
  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-14 h-14">
        <svg className="-rotate-90" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="4" />
          <circle cx="28" cy="28" r="24" fill="none" stroke="#3B82F6" strokeWidth="4" strokeLinecap="round"
            strokeDasharray={`${78 * 1.508} ${100 * 1.508}`} />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-[#3B82F6]">78%</span>
      </div>
      <div className="flex flex-wrap justify-center gap-1.5">
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">&#10003; Python</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#22C55E]/10 text-[#22C55E]">&#10003; React</span>
        <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[#EF4444]/10 text-[#EF4444]">&#10007; Docker</span>
      </div>
    </div>
  );
}

function CoachMockup() {
  return (
    <div className="w-full space-y-2 px-1">
      <div className="bg-black/[0.04] rounded-lg rounded-bl-sm px-3 py-2 text-[10px] text-[#6B7280] max-w-[85%]">
        Should I get AWS certified first?
      </div>
      <div className="bg-[#8B5CF6]/10 rounded-lg rounded-br-sm px-3 py-2 text-[10px] text-[#8B5CF6] ml-auto max-w-[85%]">
        Yes — AWS certs close your #1 gap and boost ATS scores by ~15%.
      </div>
    </div>
  );
}

function CVMockup() {
  return (
    <div className="w-full space-y-2 px-1">
      {(['Summary', 'Skills', 'Experience'] as const).map((label) => (
        <div key={label} className="flex items-center justify-between bg-black/[0.03] rounded-lg px-3 py-1.5">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-4 rounded-full bg-[#E8890A]/30" />
            <span className="text-[11px] font-medium text-[#6B7280]">{label}</span>
          </div>
          <span className="text-[10px] text-[#22C55E] font-semibold">&#10003;</span>
        </div>
      ))}
      <div className="flex justify-center pt-1">
        <span className="text-[9px] font-semibold px-3 py-1 rounded-full bg-[#E8890A]/10 text-[#E8890A]">
          Download PDF
        </span>
      </div>
    </div>
  );
}

function RoadmapMockup() {
  const items = [
    { label: '30 days', sub: 'Quick wins', color: '#22C55E' },
    { label: '90 days', sub: 'Skill building', color: '#E8890A' },
    { label: '12 months', sub: 'Career goal', color: '#8B5CF6' },
  ];
  return (
    <div className="flex flex-col gap-0">
      {items.map((item, i) => (
        <div key={item.label} className="flex items-start gap-3">
          <div className="flex flex-col items-center">
            <div className="w-3 h-3 rounded-full border-2 flex-shrink-0" style={{ borderColor: item.color, backgroundColor: `${item.color}20` }} />
            {i < items.length - 1 && <div className="w-0.5 h-6" style={{ backgroundColor: `${item.color}30` }} />}
          </div>
          <div className="-mt-0.5">
            <div className="text-[11px] font-semibold text-[#1A1A1A]">{item.label}</div>
            <div className="text-[9px] text-[#9CA3AF]">{item.sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

/* ─── Feature definitions ─── */

const FEATURES = [
  { key: 'gapAnalysis', Icon: Target, color: '#E8890A', Mockup: GapAnalysisMockup },
  { key: 'salary', Icon: TrendingUp, color: '#22C55E', Mockup: SalaryMockup },
  { key: 'ats', Icon: Shield, color: '#3B82F6', Mockup: ATSMockup },
  { key: 'coach', Icon: MessageSquare, color: '#8B5CF6', Mockup: CoachMockup },
  { key: 'cv', Icon: FileText, color: '#E8890A', Mockup: CVMockup },
  { key: 'roadmap', Icon: Map, color: '#22C55E', Mockup: RoadmapMockup },
] as const;

/* ─── Component ─── */

export default function Features() {
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
    <section id="features" ref={sectionRef} className="relative py-24 sm:py-32">
      <div className="absolute top-0 left-[10%] right-[10%] h-px bg-gradient-to-r from-transparent via-black/[0.06] to-transparent" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-14 sm:mb-18 fade-in-up">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-text-primary mb-5">
            {t('features.sectionTitle')}
          </h2>
          <p className="max-w-2xl mx-auto text-text-secondary text-base sm:text-lg leading-relaxed">
            {t('features.sectionSubtitle')}
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(({ key, Icon, color, Mockup }, i) => (
            <div
              key={key}
              className="fade-in-up group relative bg-white border border-black/[0.08] rounded-2xl p-6 transition-all duration-300 hover:shadow-lg hover:shadow-black/[0.06] hover:-translate-y-1"
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Mini-mockup area */}
              <div className="h-40 mb-5 rounded-xl bg-[#FAF8F5] border border-black/[0.04] flex items-center justify-center overflow-hidden px-4">
                <Mockup />
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-3 mb-3">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${color}15` }}
                >
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A]">
                  {t(`features.${key}.title`)}
                </h3>
              </div>

              {/* Description */}
              <p className="text-[#6B7280] text-sm leading-relaxed">
                {t(`features.${key}.desc`)}
              </p>

              {/* Hover glow */}
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                style={{ background: `radial-gradient(300px circle at 50% 50%, ${color}08, transparent 70%)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
