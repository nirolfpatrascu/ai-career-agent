'use client';

import { Bookmark, Send, Users, Trophy, XCircle, MinusCircle, type LucideIcon } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication, JobStatus } from '@/lib/types';
import JobCard from './JobCard';

interface KanbanColumnProps {
  status: JobStatus;
  label: string;
  color: string;
  icon: string;
  jobs: JobApplication[];
  onCardClick: (job: JobApplication) => void;
  onDragStart: (e: React.DragEvent, jobId: string) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  isDragOver: boolean;
  draggingJobId: string | null;
}

const ICON_MAP: Record<string, LucideIcon> = {
  Bookmark,
  Send,
  Users,
  Trophy,
  XCircle,
  MinusCircle,
};

export default function KanbanColumn({
  status,
  label,
  color,
  icon,
  jobs,
  onCardClick,
  onDragStart,
  onDragOver,
  onDrop,
  isDragOver,
  draggingJobId,
}: KanbanColumnProps) {
  const { t } = useTranslation();
  const IconComponent = ICON_MAP[icon];

  return (
    <div className="min-w-[220px] w-full max-w-[300px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        {IconComponent && (
          <IconComponent size={14} className="flex-shrink-0" style={{ color }} />
        )}
        <span
          className="inline-block w-2.5 h-2.5 rounded-full flex-shrink-0"
          style={{ backgroundColor: color }}
        />
        <span className="text-sm font-semibold text-text-primary truncate">
          {label}
        </span>
        <span
          className="text-[11px] font-medium px-2 py-0.5 rounded-full flex-shrink-0"
          style={{
            backgroundColor: `${color}14`,
            color,
          }}
        >
          {jobs.length}
        </span>
      </div>

      {/* Column body */}
      <div
        onDragOver={onDragOver}
        onDrop={onDrop}
        className={`flex flex-col gap-2 p-2 rounded-xl min-h-[200px] transition-all duration-200 ${
          isDragOver
            ? 'border-2 border-dashed border-orange-400 bg-orange-50/50'
            : 'border-2 border-dashed border-transparent bg-black/[0.02]'
        }`}
      >
        {jobs.map((job) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => onCardClick(job)}
            onDragStart={onDragStart}
            isDragging={draggingJobId === job.id}
          />
        ))}

        {jobs.length === 0 && !isDragOver && (
          <div className="flex items-center justify-center h-24 text-xs text-text-tertiary">
            {t('jobs.emptyColumn')}
          </div>
        )}
      </div>
    </div>
  );
}
