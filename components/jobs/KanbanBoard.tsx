'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication, JobStatus } from '@/lib/types';
import KanbanColumn from './KanbanColumn';

interface KanbanBoardProps {
  jobs: JobApplication[];
  onJobClick: (job: JobApplication) => void;
  onStatusChange: (jobId: string, newStatus: JobStatus) => Promise<void>;
  onReorder: (
    updates: Array<{ id: string; status: JobStatus; sortOrder: number }>
  ) => Promise<void>;
}

export default function KanbanBoard({
  jobs,
  onJobClick,
  onStatusChange,
  onReorder,
}: KanbanBoardProps) {
  const { t } = useTranslation();
  const [draggingJobId, setDraggingJobId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<JobStatus | null>(null);

  const COLUMNS: Array<{
    id: JobStatus;
    label: string;
    color: string;
    icon: string;
  }> = [
    { id: 'saved', label: t('jobs.status.saved'), color: '#6B7280', icon: 'Bookmark' },
    { id: 'applied', label: t('jobs.status.applied'), color: '#3B82F6', icon: 'Send' },
    { id: 'interviewing', label: t('jobs.status.interviewing'), color: '#8B5CF6', icon: 'Users' },
    { id: 'offer', label: t('jobs.status.offer'), color: '#22C55E', icon: 'Trophy' },
    { id: 'rejected', label: t('jobs.status.rejected'), color: '#EF4444', icon: 'XCircle' },
    { id: 'withdrawn', label: t('jobs.status.withdrawn'), color: '#9CA3AF', icon: 'MinusCircle' },
  ];

  // Group jobs by status
  const jobsByStatus: Record<JobStatus, JobApplication[]> = {
    saved: [],
    applied: [],
    interviewing: [],
    offer: [],
    rejected: [],
    withdrawn: [],
  };
  for (const job of jobs) {
    if (jobsByStatus[job.status]) {
      jobsByStatus[job.status].push(job);
    }
  }
  // Sort each column by sortOrder
  for (const status of Object.keys(jobsByStatus) as JobStatus[]) {
    jobsByStatus[status].sort((a, b) => a.sortOrder - b.sortOrder);
  }

  const handleDragStart = useCallback((e: React.DragEvent, jobId: string) => {
    setDraggingJobId(jobId);
    e.dataTransfer.setData('text/plain', jobId);
    e.dataTransfer.effectAllowed = 'move';
  }, []);

  const handleDragOver = useCallback(
    (e: React.DragEvent, status: JobStatus) => {
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setDragOverColumn(status);
    },
    []
  );

  const handleDrop = useCallback(
    async (e: React.DragEvent, targetStatus: JobStatus) => {
      e.preventDefault();
      const jobId = e.dataTransfer.getData('text/plain');
      if (!jobId) return;

      const job = jobs.find((j) => j.id === jobId);
      if (!job) return;

      const statusChanged = job.status !== targetStatus;

      if (statusChanged) {
        await onStatusChange(jobId, targetStatus);
      }

      // Build new sort orders for the target column
      const targetJobs = jobsByStatus[targetStatus].filter((j) => j.id !== jobId);
      // Place the dragged job at end
      const reorderUpdates = Array.from(targetJobs).map((j, index) => ({
        id: j.id,
        status: targetStatus,
        sortOrder: index,
      }));
      reorderUpdates.push({
        id: jobId,
        status: targetStatus,
        sortOrder: targetJobs.length,
      });

      await onReorder(reorderUpdates);

      setDraggingJobId(null);
      setDragOverColumn(null);
    },
    [jobs, jobsByStatus, onStatusChange, onReorder]
  );

  const handleDragEnd = useCallback(() => {
    setDraggingJobId(null);
    setDragOverColumn(null);
  }, []);

  return (
    <div
      className="flex gap-4 overflow-x-auto pb-4"
      onDragEnd={handleDragEnd}
    >
      {COLUMNS.map((col) => (
        <KanbanColumn
          key={col.id}
          status={col.id}
          label={col.label}
          color={col.color}
          icon={col.icon}
          jobs={jobsByStatus[col.id]}
          onCardClick={onJobClick}
          onDragStart={handleDragStart}
          onDragOver={(e) => handleDragOver(e, col.id)}
          onDrop={(e) => handleDrop(e, col.id)}
          isDragOver={dragOverColumn === col.id}
          draggingJobId={draggingJobId}
        />
      ))}
    </div>
  );
}
