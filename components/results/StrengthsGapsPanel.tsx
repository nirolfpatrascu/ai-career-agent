'use client';

import { useState } from 'react';
import type { Strength, Gap, OutputTag } from '@/lib/types';
import { getTierBg, getSeverityBg } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';
import TaggableToken from '@/components/shared/TaggableToken';

interface StrengthsGapsPanelProps {
  strengths: Strength[];
  gaps: Gap[];
  analysisId?: string;
  tags?: OutputTag[];
  onTagCreated?: (tag: OutputTag) => void;
  onTagDeleted?: (tagId: string) => void;
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

const SEV_STYLES = {
  critical: { line: 'bg-danger', text: 'text-danger', glow: 'rgba(239,68,68,0.06)' },
  moderate: { line: 'bg-warning', text: 'text-warning', glow: 'rgba(234,179,8,0.04)' },
  minor:    { line: 'bg-success', text: 'text-success', glow: 'rgba(34,197,94,0.03)' },
};

type ViewMode = 'strengths' | 'gaps';

export default function StrengthsGapsPanel({ strengths, gaps, analysisId, tags = [], onTagCreated, onTagDeleted }: StrengthsGapsPanelProps) {
  const { t } = useTranslation();
  const [view, setView] = useState<ViewMode>('strengths');
  const [expandedGap, setExpandedGap] = useState<number | null>(0);

  const criticalCount = gaps.filter((g) => g.severity === 'critical').length;
  const moderateCount = gaps.filter((g) => g.severity === 'moderate').length;
  const minorCount = gaps.filter((g) => g.severity === 'minor').length;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('results.strengthsGaps.title')}</h2>
        </div>
        <FeedbackButton section="strengthsGaps" />
      </div>

      {/* Toggle pill tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-black/[0.03] border border-black/[0.08] rounded-xl w-fit">
        <button
          onClick={() => setView('strengths')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            view === 'strengths'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={view === 'strengths' ? 'text-success' : ''}>
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {t('results.strengths.title')}
          <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${view === 'strengths' ? 'bg-success/10 text-success' : 'bg-black/[0.04]'}`}>
            {strengths.length}
          </span>
        </button>
        <button
          onClick={() => setView('gaps')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            view === 'gaps'
              ? 'bg-white text-text-primary shadow-sm'
              : 'text-text-tertiary hover:text-text-secondary'
          }`}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={view === 'gaps' ? 'text-danger' : ''}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
          </svg>
          {t('results.gaps.title')}
          <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${view === 'gaps' ? 'bg-danger/10 text-danger' : 'bg-black/[0.04]'}`}>
            {gaps.length}
          </span>
        </button>
      </div>

      {/* Strengths view */}
      {view === 'strengths' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {strengths.map((s, i) => (
            <div
              key={i}
              className="group relative rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6 transition-all duration-300 hover:bg-black/[0.04] hover:border-black/[0.10]"
            >
              <div className={`absolute left-0 top-4 bottom-4 w-[3px] rounded-full ${
                s.tier === 'differentiator' ? 'bg-primary' :
                s.tier === 'strong' ? 'bg-success' : 'bg-text-tertiary/30'
              }`} />
              <div className="pl-3">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <TaggableToken analysisId={analysisId} section="strengths" elementKey={s.title} elementIndex={i} existingTags={tags} onTagCreated={onTagCreated} onTagDeleted={onTagDeleted} inline>
                    <h3 className="font-semibold text-text-primary text-[15px] leading-snug inline">{s.title}</h3>
                  </TaggableToken>
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
      )}

      {/* Gaps view */}
      {view === 'gaps' && (
        <>
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
              const isExpanded = expandedGap === i;
              return (
                <div
                  key={i}
                  className="relative rounded-2xl border border-black/[0.08] bg-black/[0.03] overflow-hidden transition-all duration-300 hover:border-black/[0.10]"
                  style={{ backgroundColor: isExpanded ? sev.glow : undefined }}
                >
                  <div className={`absolute left-0 top-0 bottom-0 w-[3px] ${sev.line}`} />
                  <div className="p-5 pl-6">
                    <div
                      className="flex items-start justify-between gap-3 cursor-pointer select-none"
                      onClick={() => setExpandedGap(isExpanded ? null : i)}
                    >
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
                        <TaggableToken analysisId={analysisId} section="gaps" elementKey={gap.skill} elementIndex={i} existingTags={tags} onTagCreated={onTagCreated} onTagDeleted={onTagDeleted} inline>
                          <h3 className="font-semibold text-text-primary text-[15px] inline">{gap.skill}</h3>
                        </TaggableToken>
                        <p className={`text-sm mt-1 ${sev.text} opacity-80`}>{gap.impact}</p>
                      </div>
                      <svg
                        width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                        className={`text-text-tertiary flex-shrink-0 mt-1 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>

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
                              {gap.resources.map((r, ri) => {
                                const isUrl = /^https?:\/\//i.test(r) || /^www\./i.test(r);
                                const href = isUrl
                                  ? (r.startsWith('www.') ? `https://${r}` : r)
                                  : `https://www.google.com/search?q=${encodeURIComponent(r)}`;
                                return (
                                  <a
                                    key={ri}
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-start gap-2 text-sm text-primary hover:text-primary-light hover:underline transition-colors group"
                                  >
                                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5 group-hover:translate-x-0.5 transition-transform">
                                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" />
                                    </svg>
                                    {r}
                                  </a>
                                );
                              })}
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
        </>
      )}
    </section>
  );
}
