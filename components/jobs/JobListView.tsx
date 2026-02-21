'use client';

import { useState, useMemo } from 'react';
import { Pencil, Trash2, ArrowUpDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication, JobStatus } from '@/lib/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';

interface JobListViewProps {
  jobs: JobApplication[];
  onJobClick: (job: JobApplication) => void;
  onDelete: (jobId: string) => void;
}

const STATUS_ORDER: Record<JobStatus, number> = {
  saved: 0,
  applied: 1,
  interviewing: 2,
  offer: 3,
  rejected: 4,
  withdrawn: 5,
};

const STATUS_COLORS: Record<JobStatus, string> = {
  saved: '#6B7280',
  applied: '#3B82F6',
  interviewing: '#8B5CF6',
  offer: '#22C55E',
  rejected: '#EF4444',
  withdrawn: '#9CA3AF',
};

type SortField = 'company' | 'roleTitle' | 'status' | 'matchScore' | 'salary' | 'appliedAt' | 'followUpAt';
type SortDirection = 'asc' | 'desc';

export default function JobListView({ jobs, onJobClick, onDelete }: JobListViewProps) {
  const { t } = useTranslation();
  const [sortField, setSortField] = useState<SortField>('status');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [deleteJobId, setDeleteJobId] = useState<string | null>(null);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const sortedJobs = useMemo(() => {
    const sorted = Array.from(jobs);
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'company':
          cmp = a.company.localeCompare(b.company);
          break;
        case 'roleTitle':
          cmp = a.roleTitle.localeCompare(b.roleTitle);
          break;
        case 'status':
          cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
          if (cmp === 0) {
            cmp = new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
          }
          break;
        case 'matchScore':
          cmp = (a.matchScore ?? -1) - (b.matchScore ?? -1);
          break;
        case 'salary':
          cmp = (a.salaryMin ?? 0) - (b.salaryMin ?? 0);
          break;
        case 'appliedAt': {
          const aDate = a.appliedAt ? new Date(a.appliedAt).getTime() : 0;
          const bDate = b.appliedAt ? new Date(b.appliedAt).getTime() : 0;
          cmp = aDate - bDate;
          break;
        }
        case 'followUpAt': {
          const aDate = a.followUpAt ? new Date(a.followUpAt).getTime() : 0;
          const bDate = b.followUpAt ? new Date(b.followUpAt).getTime() : 0;
          cmp = aDate - bDate;
          break;
        }
      }
      return sortDirection === 'desc' ? -cmp : cmp;
    });
    return sorted;
  }, [jobs, sortField, sortDirection]);

  function getMatchColor(score: number | undefined): string {
    if (score === undefined || score === null) return 'text-text-tertiary bg-black/[0.03]';
    if (score >= 75) return 'text-[#22C55E] bg-[#22C55E]/10';
    if (score >= 50) return 'text-[#F59E0B] bg-[#F59E0B]/10';
    return 'text-[#EF4444] bg-[#EF4444]/10';
  }

  const SortHeader = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <th
      className="text-left text-xs font-semibold text-text-secondary px-3 py-3 cursor-pointer hover:text-text-primary select-none whitespace-nowrap"
      onClick={() => toggleSort(field)}
    >
      <span className="inline-flex items-center gap-1">
        {children}
        <ArrowUpDown
          size={12}
          className={`transition-colors ${
            sortField === field ? 'text-primary' : 'text-text-tertiary'
          }`}
        />
      </span>
    </th>
  );

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-black/[0.06]">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-black/[0.02] border-b border-black/[0.06]">
              <SortHeader field="company">{t('jobs.columns.company')}</SortHeader>
              <SortHeader field="roleTitle">{t('jobs.columns.role')}</SortHeader>
              <SortHeader field="status">{t('jobs.columns.status')}</SortHeader>
              <SortHeader field="matchScore">{t('jobs.columns.match')}</SortHeader>
              <SortHeader field="salary">{t('jobs.columns.salary')}</SortHeader>
              <SortHeader field="appliedAt">{t('jobs.columns.applied')}</SortHeader>
              <SortHeader field="followUpAt">{t('jobs.columns.followUp')}</SortHeader>
              <th className="text-left text-xs font-semibold text-text-secondary px-3 py-3 whitespace-nowrap">
                {t('jobs.columns.actions')}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedJobs.map((job) => {
              const isOverdue =
                job.followUpAt &&
                new Date(job.followUpAt).setHours(0, 0, 0, 0) <=
                  new Date().setHours(0, 0, 0, 0);

              return (
                <tr
                  key={job.id}
                  className="bg-white border-b border-black/[0.04] hover:bg-black/[0.02] transition-colors cursor-pointer"
                  onClick={() => onJobClick(job)}
                >
                  <td className="px-3 py-3 font-medium text-text-primary max-w-[180px] truncate">
                    {job.company}
                  </td>
                  <td className="px-3 py-3 text-text-secondary max-w-[180px] truncate">
                    {job.roleTitle}
                  </td>
                  <td className="px-3 py-3">
                    <span
                      className="text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap"
                      style={{
                        backgroundColor: `${STATUS_COLORS[job.status]}14`,
                        color: STATUS_COLORS[job.status],
                      }}
                    >
                      {t(`jobs.status.${job.status}`)}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    {job.matchScore !== undefined && job.matchScore !== null ? (
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-md ${getMatchColor(
                          job.matchScore
                        )}`}
                      >
                        {job.matchScore}%
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3 text-xs text-text-secondary whitespace-nowrap">
                    {job.salaryMin || job.salaryMax
                      ? `${[
                          job.salaryMin && job.salaryMin.toLocaleString(),
                          job.salaryMax && job.salaryMax.toLocaleString(),
                        ]
                          .filter(Boolean)
                          .join('-')} ${job.currency}`
                      : '-'}
                  </td>
                  <td className="px-3 py-3 text-xs text-text-secondary whitespace-nowrap">
                    {job.appliedAt
                      ? new Date(job.appliedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '-'}
                  </td>
                  <td className="px-3 py-3">
                    {job.followUpAt ? (
                      <span
                        className={`text-xs whitespace-nowrap ${
                          isOverdue
                            ? 'text-[#E8890A] font-medium'
                            : 'text-text-secondary'
                        }`}
                      >
                        {new Date(job.followUpAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    ) : (
                      <span className="text-xs text-text-tertiary">-</span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onJobClick(job);
                        }}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-primary hover:bg-primary/[0.06] transition-all"
                        title={t('jobs.edit')}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDeleteJobId(job.id);
                        }}
                        className="p-1.5 rounded-lg text-text-tertiary hover:text-danger hover:bg-danger/[0.06] transition-all"
                        title={t('jobs.delete')}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {sortedJobs.length === 0 && (
          <div className="text-center py-12 text-sm text-text-tertiary">
            {t('jobs.empty')}
          </div>
        )}
      </div>

      <DeleteConfirmDialog
        isOpen={!!deleteJobId}
        title={t('jobs.deleteConfirm.title')}
        message={t('jobs.deleteConfirm.message')}
        onConfirm={() => {
          if (deleteJobId) {
            onDelete(deleteJobId);
            setDeleteJobId(null);
          }
        }}
        onCancel={() => setDeleteJobId(null)}
      />
    </>
  );
}
