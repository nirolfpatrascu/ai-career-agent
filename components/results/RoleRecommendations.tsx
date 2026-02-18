'use client';

import type { RoleRecommendation } from '@/lib/types';
import { getFitScoreColor, formatCurrency } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface RoleRecommendationsProps {
  roles: RoleRecommendation[];
}

export default function RoleRecommendations({ roles }: RoleRecommendationsProps) {
  const { t } = useTranslation();
  if (roles.length === 0) return null;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">{t('results.roles.title')}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {roles.map((role, i) => {
          const color = getFitScoreColor(role.fitScore);
          return (
            <div key={i} className={`card relative overflow-hidden ${i === 0 ? 'ring-1 ring-primary/30' : ''}`}>
              {i === 0 && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-medium px-3 py-1 rounded-bl-lg">
                  Best Fit
                </div>
              )}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold" style={{ backgroundColor: `${color}15`, color }}>
                  {role.fitScore}
                </div>
                <div>
                  <p className="text-xs text-text-secondary">{t('results.roles.fitScore')}</p>
                  <p className="text-xs" style={{ color }}>/10</p>
                </div>
              </div>
              <h3 className="font-semibold text-text-primary text-lg mb-2">{role.title}</h3>
              <p className="text-sm text-text-secondary leading-relaxed mb-4">{role.reasoning}</p>
              <div className="bg-background rounded-lg p-3 mb-4">
                <p className="text-xs text-text-secondary mb-1">{t('results.roles.salaryRange')}</p>
                <p className="text-lg font-semibold text-success">
                  {formatCurrency(role.salaryRange.low, role.salaryRange.currency)} – {formatCurrency(role.salaryRange.high, role.salaryRange.currency)}
                </p>
                <p className="text-xs text-text-secondary mt-0.5">Mid: {formatCurrency(role.salaryRange.mid, role.salaryRange.currency)}</p>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-secondary"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                <span className="text-sm text-text-secondary">{role.timeToReady}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {role.exampleCompanies.map((company, ci) => (
                  <span key={ci} className="text-xs px-2.5 py-1 rounded-md bg-card-border/50 text-text-secondary">{company}</span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
