'use client';

import type { Strength } from '@/lib/types';
import { getTierBg } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface StrengthsPanelProps {
  strengths: Strength[];
}

export default function StrengthsPanel({ strengths }: StrengthsPanelProps) {
  const { t } = useTranslation();
  if (strengths.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">{t('results.strengths.title')}</h2>
        <span className="text-sm text-text-secondary">({strengths.length})</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {strengths.map((s, i) => (
          <div key={i} className="card border-l-4 border-l-success/60 hover:border-l-success transition-colors duration-200">
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-semibold text-text-primary">{s.title}</h3>
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full border capitalize whitespace-nowrap ${getTierBg(s.tier)}`}>
                {t(`results.strengths.tiers.${s.tier}`)}
              </span>
            </div>
            <p className="text-sm text-text-secondary leading-relaxed mb-2">{s.description}</p>
            <p className="text-sm text-primary/80 leading-relaxed">{s.relevance}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
