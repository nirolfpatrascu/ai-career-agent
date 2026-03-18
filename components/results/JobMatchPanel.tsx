'use client';

import { useMemo } from 'react';
import type { JobMatch, MissingSkill } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';

interface JobMatchPanelProps {
  match: JobMatch;
}

const IMPORTANCE_CONFIG = {
  important: { color: 'text-danger', bg: 'bg-danger/[0.08]', border: 'border-danger/15' },
  not_a_deal_breaker: { color: 'text-[#E8890A]', bg: 'bg-[#E8890A]/[0.08]', border: 'border-[#E8890A]/15' },
  unimportant: { color: 'text-text-tertiary', bg: 'bg-black/[0.04]', border: 'border-black/[0.08]' },
} as const;

export default function JobMatchPanel({ match }: JobMatchPanelProps) {
  const { t } = useTranslation();

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#E8890A';
    if (score >= 40) return '#EAB308';
    return '#EF4444';
  };

  const color = getScoreColor(match.matchScore);

  const groupedMissing = useMemo(() => {
    const groups: Record<MissingSkill['importance'], MissingSkill[]> = {
      important: [],
      not_a_deal_breaker: [],
      unimportant: [],
    };
    for (const skill of match.missingSkills) {
      const key = skill.importance in groups ? skill.importance : 'not_a_deal_breaker';
      groups[key].push(skill);
    }
    return groups;
  }, [match.missingSkills]);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('results.jobMatch.title')}</h2>
        </div>
      </div>

      <div className="space-y-4">
        {/* Score — top */}
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] text-center py-10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-15" style={{ backgroundColor: color }} />
          <div className="relative z-10">
            <div className="text-5xl font-extrabold font-display mb-2" style={{ color }}>{match.matchScore}%</div>
            <p className="text-text-tertiary text-sm">{t('results.jobMatch.matchScore')}</p>
          </div>
        </div>

        {/* Assessment */}
        <div className="rounded-2xl border border-primary/15 bg-primary/[0.03] p-6">
          <div className="flex items-center gap-2 mb-3">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <h3 className="font-semibold text-text-primary">{t('results.jobMatch.assessment')}</h3>
          </div>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{match.overallAdvice}</p>
          <div className="flex justify-end mt-3 pt-2.5 border-t border-black/[0.06]">
            <FeedbackButton compact section="jobMatch-assessment" />
          </div>
        </div>

        {/* Skills comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5"><polyline points="20 6 9 17 4 12" /></svg>
              <h3 className="text-sm font-semibold text-success">{t('results.jobMatch.matchingSkills')} ({match.matchingSkills.length})</h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.matchingSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-success/[0.08] text-success border border-success/15">{skill}</span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-5">
            <div className="flex items-center gap-2 mb-3">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              <h3 className="text-sm font-semibold text-danger">{t('results.jobMatch.missingSkills')} ({match.missingSkills.length})</h3>
            </div>
            <div className="space-y-3">
              {(['important', 'not_a_deal_breaker', 'unimportant'] as const).map((level) => {
                const skills = groupedMissing[level];
                if (skills.length === 0) return null;
                const cfg = IMPORTANCE_CONFIG[level];
                return (
                  <div key={level}>
                    <p className={`text-[11px] font-medium uppercase tracking-wider mb-1.5 ${cfg.color}`}>
                      {t(`results.jobMatch.importance.${level}`)} ({skills.length})
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {skills.map((s, i) => (
                        <span key={i} className={`text-xs px-2.5 py-1 rounded-lg border ${cfg.bg} ${cfg.color} ${cfg.border}`}>{s.skill}</span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}