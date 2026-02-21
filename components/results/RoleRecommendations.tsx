'use client';

import type { RoleRecommendation } from '@/lib/types';
import { getFitScoreColor, formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';

interface RoleRecommendationsProps {
  roles: RoleRecommendation[];
}

export default function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  const { t } = useTranslation();
  if (roles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('results.roles.title')}</h2>
        </div>
        <FeedbackButton section="roleRecommendations" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {roles.map((role, i) => {
          const color = getFitScoreColor(role.fitScore);
          const isBest = i === 0;
          return (
            <div
              key={i}
              className={`relative rounded-2xl border bg-black/[0.03] p-6 transition-all duration-300 hover:bg-black/[0.04] ${
                isBest ? 'border-primary/30 hover:border-primary/40' : 'border-black/[0.08] hover:border-black/[0.10]'
              }`}
            >
              {/* Best fit badge */}
              {isBest && (
                <div className="absolute -top-px -right-px bg-gradient-to-r from-primary to-accent-orange text-white text-[11px] font-semibold px-3 py-1 rounded-bl-xl rounded-tr-2xl">
                  {t('results.roles.bestFit')}
                </div>
              )}

              {/* Score */}
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center font-bold font-display text-lg"
                  style={{ backgroundColor: `${color}12`, color, border: `1px solid ${color}20` }}
                >
                  {role.fitScore}
                </div>
                <div>
                  <p className="text-xs text-text-tertiary">{t('results.roles.fitScore')}</p>
                  <p className="text-xs font-medium" style={{ color }}>/10</p>
                </div>
              </div>

              {/* Title + reasoning */}
              <h3 className="font-semibold text-text-primary text-lg leading-snug mb-2.5 font-display">{role.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-5">{role.reasoning}</p>

              {/* Salary */}
              <div className="rounded-xl bg-black/[0.04] border border-black/[0.06] p-4 mb-4">
                <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.roles.salaryRange')}</p>
                <p className="text-lg font-bold text-success font-display">
                  {formatCurrency(role.salaryRange.low, role.salaryRange.currency)} – {formatCurrency(role.salaryRange.high, role.salaryRange.currency)}
                </p>
                <p className="text-xs text-text-tertiary mt-0.5">{t('results.roles.mid')}: {formatCurrency(role.salaryRange.mid, role.salaryRange.currency)}</p>
              </div>

              {/* Time to ready */}
              <div className="flex items-center gap-2 mb-4 text-sm text-text-secondary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary flex-shrink-0"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                {role.timeToReady}
              </div>

              {/* Companies */}
              <div className="flex flex-wrap gap-1.5">
                {role.exampleCompanies.map((company, ci) => (
                  <span key={ci} className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.04] border border-black/[0.08] text-text-secondary">{company}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
