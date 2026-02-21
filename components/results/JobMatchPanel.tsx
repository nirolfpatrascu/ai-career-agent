'use client';

import type { JobMatch } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';

interface JobMatchPanelProps {
  match: JobMatch;
}

export default function JobMatchPanel({ match }: JobMatchPanelProps) {
  const { t } = useTranslation();

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#E8890A';
    if (score >= 40) return '#EAB308';
    return '#EF4444';
  };

  const color = getScoreColor(match.matchScore);

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
        <FeedbackButton section="jobMatch" />
      </div>

      <div className="space-y-4">
        {/* Score */}
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] text-center py-10 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[60px] opacity-15" style={{ backgroundColor: color }} />
          <div className="relative z-10">
            <div className="text-5xl font-extrabold font-display mb-2" style={{ color }}>{match.matchScore}%</div>
            <p className="text-text-tertiary text-sm">{t('results.jobMatch.matchScore')}</p>
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
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, i) => (
                <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-danger/[0.08] text-danger border border-danger/15">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Assessment */}
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.03] p-6">
          <h3 className="font-semibold text-text-primary mb-2.5">Assessment</h3>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">{match.overallAdvice}</p>
        </div>
      </div>
    </section>
  );
}