'use client';

import { useState } from 'react';
import type { Gap } from '@/lib/types';
import { getSeverityBg } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';

interface GapsPanelProps {
  gaps: Gap[];
}

const SEV_STYLES = {
  critical: { line: 'bg-danger', text: 'text-danger', glow: 'rgba(239,68,68,0.06)' },
  moderate: { line: 'bg-warning', text: 'text-warning', glow: 'rgba(234,179,8,0.04)' },
  minor:    { line: 'bg-success', text: 'text-success', glow: 'rgba(34,197,94,0.03)' },
};

export default function GapsPanel({ gaps }: GapsPanelProps) {
  const { t } = useTranslation();
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (gaps.length === 0) return null;

  const criticalCount = gaps.filter((g) => g.severity === 'critical').length;
  const moderateCount = gaps.filter((g) => g.severity === 'moderate').length;
  const minorCount = gaps.filter((g) => g.severity === 'minor').length;

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center text-danger">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">{t('results.gaps.title')}</h2>
          </div>
        </div>
        <FeedbackButton section="gaps" />
      </div>

      {/* Severity summary pills */}
      <div className="flex flex-wrap gap-2 mb-6">
        {criticalCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger/10 text-danger border border-danger/15">
            {criticalCount} {t('results.gaps.severity.critical')}
          </span>
        )}
        {moderateCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/15">
            {moderateCount} {t('results.gaps.severity.moderate')}
          </span>
        )}
        {minorCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/15">
            {minorCount} {t('results.gaps.severity.minor')}
          </span>
        )}
      </div>

      <div className="space-y-3">
        {gaps.map((gap, i) => {
          const sev = SEV_STYLES[gap.severity];
          const isExpanded = expandedIndex === i;
          return (
            <div
              key={i}
              className="relative rounded-2xl border border-black/[0.08] bg-black/[0.03] overflow-hidden transition-all duration-300 cursor-pointer hover:border-black/[0.10]"
              style={{ backgroundColor: isExpanded ? sev.glow : undefined }}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              {/* Severity accent line */}
              <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${sev.line}`} />

              <div className="p-5 pl-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full border capitalize ${getSeverityBg(gap.severity)}`}>
                        {t(`results.gaps.severity.${gap.severity}`)}
                      </span>
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                        {gap.timeToClose}
                      </span>
                    </div>
                    <h3 className="font-semibold text-text-primary text-[15px]">{gap.skill}</h3>
                    <p className={`text-sm mt-1 ${sev.text} opacity-80`}>{gap.impact}</p>
                  </div>
                  <svg
                    width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                    className={`text-text-tertiary flex-shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="mt-5 pt-5 border-t border-black/[0.08] space-y-4 animate-fade-in">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="rounded-xl bg-black/[0.04] border border-black/[0.08] p-3.5">
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.gaps.currentLevel')}</p>
                        <p className="text-sm text-text-primary">{gap.currentLevel}</p>
                      </div>
                      <div className="rounded-xl bg-black/[0.04] border border-black/[0.08] p-3.5">
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.gaps.requiredLevel')}</p>
                        <p className="text-sm text-text-primary">{gap.requiredLevel}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.gaps.closingPlan')}</p>
                      <p className="text-sm text-text-primary leading-relaxed">{gap.closingPlan}</p>
                    </div>
                    {gap.resources.length > 0 && (
                      <div>
                        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">{t('results.gaps.resources')}</p>
                        <div className="space-y-1.5">
                          {gap.resources.map((r, ri) => (
                            <div key={ri} className="flex items-start gap-2 text-sm text-primary/80">
                              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                              </svg>
                              {r}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
