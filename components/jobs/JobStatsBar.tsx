'use client';

import { useTranslation } from '@/lib/i18n';
import type { JobTrackerStats, JobStatus } from '@/lib/types';

interface JobStatsBarProps {
  stats: JobTrackerStats;
}

const STATUS_COLORS: Record<JobStatus, string> = {
  saved: '#6B7280',
  applied: '#3B82F6',
  interviewing: '#8B5CF6',
  offer: '#22C55E',
  rejected: '#EF4444',
  withdrawn: '#9CA3AF',
};

export default function JobStatsBar({ stats }: JobStatsBarProps) {
  const { t } = useTranslation();

  const statusEntries = (Object.keys(STATUS_COLORS) as JobStatus[]).filter(
    (status) => stats.byStatus[status] > 0
  );

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Total */}
      <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-black/[0.05] text-text-primary flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 rounded-full bg-text-primary" />
        {t('jobs.total')}: {stats.total}
      </span>

      {/* Per-status pills */}
      {statusEntries.map((status) => (
        <span
          key={status}
          className="px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-1.5"
          style={{
            backgroundColor: `${STATUS_COLORS[status]}14`,
            color: STATUS_COLORS[status],
          }}
        >
          <span
            className="inline-block w-2 h-2 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[status] }}
          />
          {t(`jobs.status.${status}`)}: {stats.byStatus[status]}
        </span>
      ))}

      {/* Avg match score */}
      {stats.avgMatchScore !== null && (
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#3B82F6]/10 text-[#3B82F6] flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#3B82F6]" />
          {t('jobs.avgMatch')}: {Math.round(stats.avgMatchScore)}%
        </span>
      )}

      {/* Follow-ups due */}
      {stats.followUpsDue > 0 && (
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#EF4444]/10 text-[#EF4444] flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#EF4444]" />
          {stats.followUpsDue} {t('jobs.followUpsDue')}
        </span>
      )}

      {/* Applied this week */}
      {stats.appliedThisWeek > 0 && (
        <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-[#22C55E]/10 text-[#22C55E] flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-full bg-[#22C55E]" />
          {stats.appliedThisWeek} {t('jobs.appliedThisWeek')}
        </span>
      )}
    </div>
  );
}
