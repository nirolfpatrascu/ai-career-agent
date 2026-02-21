'use client';

import { useState } from 'react';
import type { SalaryAnalysis, SalaryDataSource } from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';

interface SalaryBenchmarkProps {
  salary: SalaryAnalysis;
}

function SourceBadge({ source, t }: { source?: SalaryDataSource; t: (key: string) => string }) {
  if (!source) return null;

  const isGov = source === 'government_bls' || source === 'government_ons' || source === 'government_eurostat';
  const isSurvey = source === 'survey_stackoverflow' || source === 'market';
  const isEstimate = source === 'estimate';

  if (isGov) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/[0.08] text-success border border-success/15">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        {t(`results.salary.source.${source}`)}
      </span>
    );
  }
  if (isSurvey) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/[0.08] text-primary border border-primary/15">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
        {t(`results.salary.source.${source}`)}
      </span>
    );
  }
  if (isEstimate) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-warning/[0.08] text-warning border border-warning/15">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        {t(`results.salary.source.${source}`)}
      </span>
    );
  }
  return null;
}

export default function SalaryBenchmark({ salary }: SalaryBenchmarkProps) {
  const { t } = useTranslation();
  const [showTooltip, setShowTooltip] = useState(false);
  const currentMid = salary.currentRoleMarket.mid;
  const targetMid = salary.targetRoleMarket.mid;
  const currentCurrency = salary.currentRoleMarket.currency;
  const targetCurrency = salary.targetRoleMarket.currency;

  const toEurRate: Record<string, number> = {
    'EUR': 1, 'USD': 0.92, 'GBP': 1.17, 'CHF': 1.05,
    'RON': 0.20, 'PLN': 0.23, 'CZK': 0.04, 'HUF': 0.0025,
    'SEK': 0.088, 'DKK': 0.134, 'NOK': 0.087,
    'CAD': 0.68, 'AUD': 0.60, 'INR': 0.011, 'SGD': 0.69,
    'JPY': 0.0062, 'BRL': 0.17,
  };
  const currentRate = toEurRate[currentCurrency] || 1;
  const targetRate = toEurRate[targetCurrency] || 1;

  const currentHighEur = salary.currentRoleMarket.high * currentRate;
  const targetHighEur = salary.targetRoleMarket.high * targetRate;
  const maxEur = Math.max(currentHighEur, targetHighEur);

  const currentWidth = maxEur > 0 ? ((currentMid * currentRate) / maxEur) * 100 : 0;
  const targetWidth = maxEur > 0 ? ((targetMid * targetRate) / maxEur) * 100 : 0;

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center text-success">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
          </svg>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-text-primary font-display">{t('results.salary.title')}</h2>
              <div className="relative">
                <button
                  onClick={() => setShowTooltip(!showTooltip)}
                  onMouseEnter={() => setShowTooltip(true)}
                  onMouseLeave={() => setShowTooltip(false)}
                  className="w-5 h-5 rounded-full border border-black/[0.12] bg-black/[0.04] flex items-center justify-center text-text-tertiary hover:bg-black/[0.08] transition-colors"
                  aria-label="Salary data info"
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                </button>
                {showTooltip && (
                  <div className="absolute left-1/2 -translate-x-1/2 top-7 z-50 w-72 p-3 rounded-xl bg-white border border-black/[0.1] shadow-lg text-xs text-text-secondary leading-relaxed">
                    {t('results.salary.source.tooltip')}
                  </div>
                )}
              </div>
            </div>
            <FeedbackButton section="salaryAnalysis" />
          </div>
          <p className="text-xs text-text-tertiary">{t('results.salary.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Salary comparison */}
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6 space-y-6">
          {/* Current role bar */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-secondary">{t('results.salary.currentRoleMarket')}</p>
                <SourceBadge source={salary.currentRoleMarket.source} t={t} />
              </div>
              <p className="text-xs text-text-tertiary">{salary.currentRoleMarket.region}</p>
            </div>
            <div className="h-11 rounded-xl bg-black/[0.04] border border-black/[0.08] overflow-hidden relative">
              <div
                className="h-full rounded-xl bg-gradient-to-r from-zinc-700/80 to-zinc-600/80 flex items-center justify-end px-4 transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(currentWidth, 25)}%` }}
              >
                <span className="text-sm font-bold text-text-primary font-display">{formatCurrency(currentMid, currentCurrency)}</span>
              </div>
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-text-tertiary px-1">
              <span>{formatCurrency(salary.currentRoleMarket.low, currentCurrency)}</span>
              <span>{formatCurrency(salary.currentRoleMarket.high, currentCurrency)}</span>
            </div>
          </div>

          {/* Growth indicator */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-black/[0.04]" />
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/[0.08] border border-success/15">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
              <span className="text-sm font-bold text-success">{salary.growthPotential}</span>
            </div>
            <div className="flex-1 h-px bg-black/[0.04]" />
          </div>

          {/* Target role bar */}
          <div>
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-text-secondary">{t('results.salary.targetRoleMarket')}</p>
                <SourceBadge source={salary.targetRoleMarket.source} t={t} />
              </div>
              <p className="text-xs text-text-tertiary">{salary.targetRoleMarket.region}</p>
            </div>
            <div className="h-11 rounded-xl bg-black/[0.04] border border-black/[0.08] overflow-hidden relative">
              <div
                className="h-full rounded-xl bg-gradient-to-r from-success/70 to-success/90 flex items-center justify-end px-4 transition-all duration-1000 ease-out"
                style={{ width: `${Math.max(targetWidth, 25)}%` }}
              >
                <span className="text-sm font-bold text-text-primary font-display">{formatCurrency(targetMid, targetCurrency)}</span>
              </div>
            </div>
            <div className="flex justify-between mt-1.5 text-[11px] text-text-tertiary px-1">
              <span>{formatCurrency(salary.targetRoleMarket.low, targetCurrency)}</span>
              <span>{formatCurrency(salary.targetRoleMarket.high, targetCurrency)}</span>
            </div>
          </div>
        </div>

        {/* Best move */}
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-7 h-7 rounded-lg bg-warning/10 border border-warning/15 flex items-center justify-center text-warning text-sm">💡</div>
            <h3 className="font-semibold text-text-primary">{t('results.salary.bestMove')}</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed">{salary.bestMonetaryMove}</p>
        </div>

        {/* Negotiation tips */}
        {salary.negotiationTips.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary text-sm">🎯</div>
              <h3 className="font-semibold text-text-primary">{t('results.salary.negotiationTips')}</h3>
            </div>
            <div className="space-y-3">
              {salary.negotiationTips.map((tip, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-primary/60 font-bold text-sm flex-shrink-0 mt-0.5 font-display">{i + 1}.</span>
                  <p className="text-sm text-text-secondary leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sources footer */}
        <p className="text-[11px] text-text-tertiary text-center mt-2 px-1">
          {t('results.salary.source.footer')}
        </p>
      </div>
    </section>
  );
}
