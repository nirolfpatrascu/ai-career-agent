'use client';

import type { Strength } from '@/lib/types';
import { getTierBg } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface StrengthsPanelProps {
  strengths: Strength[];
}

const TIER_ICON: Record<string, React.ReactNode> = {
  differentiator: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
  ),
  strong: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
  ),
  supporting: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
  ),
};

export default function StrengthsPanel({ strengths }: StrengthsPanelProps) {
  const { t } = useTranslation();
  if (strengths.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('results.strengths.title')}</h2>
          <p className="text-xs text-text-tertiary">{strengths.length} {strengths.length === 1 ? 'strength' : 'strengths'} identified</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.map((s, i) => (
          <div
            key={i}
            className="group relative rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6 transition-all duration-300 hover:bg-black/[0.04] hover:border-black/[0.10]"
          >
            {/* Tier accent line */}
            <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full ${
              s.tier === 'differentiator' ? 'bg-primary' :
              s.tier === 'strong' ? 'bg-success' : 'bg-text-tertiary/30'
            }`} />

            <div className="pl-3">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-semibold text-text-primary text-[15px] leading-snug">{s.title}</h3>
                <span className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border capitalize whitespace-nowrap flex-shrink-0 ${getTierBg(s.tier)}`}>
                  {TIER_ICON[s.tier]}
                  {t(`results.strengths.tiers.${s.tier}`)}
                </span>
              </div>
              <p className="text-sm text-text-secondary leading-relaxed mb-3">{s.description}</p>
              <p className="text-sm text-primary/70 leading-relaxed">{s.relevance}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
