'use client';

import { Clock } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication } from '@/lib/types';

interface JobCardProps {
  job: JobApplication;
  onClick: () => void;
  onDragStart: (e: React.DragEvent, jobId: string) => void;
  isDragging: boolean;
}

function getMatchScoreColor(score: number | undefined): string {
  if (score === undefined || score === null) return 'bg-black/[0.05] text-text-tertiary';
  if (score >= 75) return 'bg-[#22C55E]/10 text-[#22C55E]';
  if (score >= 50) return 'bg-[#F59E0B]/10 text-[#F59E0B]';
  return 'bg-[#EF4444]/10 text-[#EF4444]';
}

function getFollowUpStatus(followUpAt: string | undefined): { label: string; isUrgent: boolean } | null {
  if (!followUpAt) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(followUpAt);
  followUp.setHours(0, 0, 0, 0);
  const diffMs = followUp.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { label: 'overdue', isUrgent: true };
  if (diffDays === 0) return { label: 'dueToday', isUrgent: true };
  return { label: 'future', isUrgent: false };
}

export default function JobCard({ job, onClick, onDragStart, isDragging }: JobCardProps) {
  const { t } = useTranslation();

  const followUpStatus = getFollowUpStatus(job.followUpAt);

  const displayDate = job.appliedAt
    ? new Date(job.appliedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
    : new Date(job.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

  const salaryRange =
    job.salaryMin || job.salaryMax
      ? [job.salaryMin && `${job.salaryMin.toLocaleString()}`, job.salaryMax && `${job.salaryMax.toLocaleString()}`]
          .filter(Boolean)
          .join(' - ') + ` ${job.currency}`
      : null;

  const workTypeLabel = job.workType
    ? t(`jobs.workType.${job.workType}`)
    : null;

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, job.id)}
      onClick={onClick}
      className={`bg-white rounded-xl border border-black/[0.06] p-3.5 cursor-pointer hover:shadow-md transition-shadow duration-200 ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {/* Top row: company + match score */}
      <div className="flex items-center justify-between gap-2 mb-1">
        <span className="text-sm font-semibold text-text-primary truncate">
          {job.company}
        </span>
        {job.matchScore !== undefined && job.matchScore !== null && (
          <span
            className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md flex-shrink-0 ${getMatchScoreColor(
              job.matchScore
            )}`}
          >
            {job.matchScore}%
          </span>
        )}
      </div>

      {/* Role title */}
      <p className="text-xs text-text-secondary truncate mb-1.5">
        {job.roleTitle}
      </p>

      {/* Work type + salary */}
      {(workTypeLabel || salaryRange) && (
        <p className="text-[11px] text-text-tertiary truncate mb-1">
          {[workTypeLabel, salaryRange].filter(Boolean).join(' / ')}
        </p>
      )}

      {/* Upwork badges */}
      {job.source === 'upwork' && (
        <div className="flex items-center gap-1.5 mb-1">
          <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md bg-[#14A800]/10 text-[#14A800]">
            Upwork
          </span>
          {Array.isArray(job.metadata?.screeningQuestions) && (job.metadata!.screeningQuestions as unknown[]).length > 0 && (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#14A800]/[0.06] text-[#14A800]/80">
              {(job.metadata!.screeningQuestions as unknown[]).length} Qs
            </span>
          )}
          {job.metadata?.coverLetterGenerated ? (
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-[#14A800]/[0.06] text-[#14A800]/80">
              CL
            </span>
          ) : null}
        </div>
      )}

      {/* Date */}
      <p className="text-[11px] text-text-tertiary">
        {job.appliedAt ? t('jobs.applied') : t('jobs.added')}: {displayDate}
      </p>

      {/* Follow-up indicator */}
      {followUpStatus && job.followUpAt && (
        <div
          className={`flex items-center gap-1 mt-1.5 text-[11px] ${
            followUpStatus.isUrgent
              ? 'text-[#E8890A] font-medium'
              : 'text-text-tertiary'
          }`}
        >
          <Clock size={11} />
          <span>
            {followUpStatus.label === 'overdue' && t('jobs.followUp.overdue')}
            {followUpStatus.label === 'dueToday' && t('jobs.followUp.dueToday')}
            {followUpStatus.label === 'future' &&
              new Date(job.followUpAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
          </span>
        </div>
      )}
    </div>
  );
}
