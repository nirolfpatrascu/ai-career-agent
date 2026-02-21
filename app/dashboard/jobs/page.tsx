'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, LayoutGrid, List } from 'lucide-react';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import type {
  JobApplication,
  JobApplicationInput,
  JobTrackerStats,
  JobStatus,
} from '@/lib/types';

import JobStatsBar from '@/components/jobs/JobStatsBar';
import KanbanBoard from '@/components/jobs/KanbanBoard';
import JobListView from '@/components/jobs/JobListView';
import AddJobModal from '@/components/jobs/AddJobModal';
import JobDetailModal from '@/components/jobs/JobDetailModal';
import Toast from '@/components/jobs/Toast';

function computeStats(jobs: JobApplication[]): JobTrackerStats {
  const byStatus: Record<JobStatus, number> = {
    saved: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };
  let matchScoreSum = 0;
  let matchScoreCount = 0;
  let followUpsDue = 0;
  let appliedThisWeek = 0;
  let appliedThisMonth = 0;

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay());
  const monthStart = new Date(today.getFullYear(), today.getMonth(), 1);

  for (const job of jobs) {
    byStatus[job.status] = (byStatus[job.status] || 0) + 1;

    if (job.matchScore !== undefined && job.matchScore !== null) {
      matchScoreSum += job.matchScore;
      matchScoreCount++;
    }

    if (job.followUpAt) {
      const followUp = new Date(job.followUpAt);
      followUp.setHours(0, 0, 0, 0);
      if (followUp.getTime() <= today.getTime()) {
        followUpsDue++;
      }
    }

    if (job.appliedAt) {
      const applied = new Date(job.appliedAt);
      applied.setHours(0, 0, 0, 0);
      if (applied >= weekStart) appliedThisWeek++;
      if (applied >= monthStart) appliedThisMonth++;
    }
  }

  return {
    total: jobs.length,
    byStatus,
    avgMatchScore: matchScoreCount > 0 ? matchScoreSum / matchScoreCount : null,
    followUpsDue,
    appliedThisWeek,
    appliedThisMonth,
  };
}

export default function JobTrackerPage() {
  const { t } = useTranslation();
  const { user, session, loading: authLoading } = useAuth();

  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'kanban' | 'list'>('kanban');
  const [selectedJob, setSelectedJob] = useState<JobApplication | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Default to list view on mobile
  useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setView('list');
    }
  }, []);

  const stats = computeStats(jobs);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/jobs', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobs(data.jobs || []);
      }
    } catch (err) {
      console.error('Failed to fetch jobs:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (user && session) {
      fetchJobs();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, session, authLoading, fetchJobs]);

  // Add job
  const addJob = useCallback(
    async (input: JobApplicationInput) => {
      if (!session?.access_token) return;
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        setToast({ message: t('jobs.toast.addError'), type: 'error' });
        throw new Error('Failed to add job');
      }
      setToast({ message: t('jobs.toast.added'), type: 'success' });
      await fetchJobs();
    },
    [session?.access_token, fetchJobs, t]
  );

  // Update job (optimistic)
  const updateJob = useCallback(
    async (
      id: string,
      updates: Partial<JobApplicationInput & { status?: JobStatus }>
    ) => {
      if (!session?.access_token) return;

      // Optimistic update
      setJobs((prev) =>
        prev.map((j) =>
          j.id === id
            ? {
                ...j,
                ...updates,
                updatedAt: new Date().toISOString(),
                statusUpdatedAt: updates.status
                  ? new Date().toISOString()
                  : j.statusUpdatedAt,
              }
            : j
        )
      );
      // Also update selectedJob if it matches
      setSelectedJob((prev) =>
        prev && prev.id === id
          ? {
              ...prev,
              ...updates,
              updatedAt: new Date().toISOString(),
              statusUpdatedAt: updates.status
                ? new Date().toISOString()
                : prev.statusUpdatedAt,
            }
          : prev
      );

      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(updates),
        });
        if (!res.ok) {
          // Revert on failure
          await fetchJobs();
          setToast({ message: t('jobs.toast.updateError'), type: 'error' });
        }
      } catch {
        await fetchJobs();
        setToast({ message: t('jobs.toast.updateError'), type: 'error' });
      }
    },
    [session?.access_token, fetchJobs, t]
  );

  // Delete job (optimistic)
  const deleteJob = useCallback(
    async (id: string) => {
      if (!session?.access_token) return;

      // Optimistic remove
      const backup = jobs;
      setJobs((prev) => prev.filter((j) => j.id !== id));

      try {
        const res = await fetch(`/api/jobs/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });
        if (!res.ok) {
          setJobs(backup);
          setToast({ message: t('jobs.toast.deleteError'), type: 'error' });
        } else {
          setToast({ message: t('jobs.toast.deleted'), type: 'success' });
        }
      } catch {
        setJobs(backup);
        setToast({ message: t('jobs.toast.deleteError'), type: 'error' });
      }
    },
    [session?.access_token, jobs, t]
  );

  // Status change handler for Kanban
  const handleStatusChange = useCallback(
    async (jobId: string, newStatus: JobStatus) => {
      await updateJob(jobId, { status: newStatus });
    },
    [updateJob]
  );

  // Reorder handler for Kanban
  const handleReorder = useCallback(
    async (
      updates: Array<{ id: string; status: JobStatus; sortOrder: number }>
    ) => {
      if (!session?.access_token) return;

      // Optimistic reorder
      setJobs((prev) => {
        const next = Array.from(prev);
        for (const u of updates) {
          const idx = next.findIndex((j) => j.id === u.id);
          if (idx !== -1) {
            next[idx] = { ...next[idx], status: u.status, sortOrder: u.sortOrder };
          }
        }
        return next;
      });

      try {
        await fetch('/api/jobs/reorder', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ updates }),
        });
      } catch {
        await fetchJobs();
      }
    },
    [session?.access_token, fetchJobs]
  );

  // Not logged in
  if (!authLoading && !user) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6 min-h-screen">
          <div className="max-w-container mx-auto">
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display mb-3">
                {t('jobs.signInRequired')}
              </h1>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                {t('jobs.signInDescription')}
              </p>
              <p className="text-sm text-text-tertiary">
                {t('jobs.useSignIn')}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6 min-h-screen">
        <div className="max-w-container mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">
                {t('jobs.title')}
              </h1>
              <p className="text-text-tertiary mt-1 text-sm">
                {t('jobs.subtitle')}
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="btn-primary text-sm flex items-center gap-2"
            >
              <Plus size={16} />
              {t('jobs.addJob')}
            </button>
          </div>

          {/* Stats bar */}
          {!loading && jobs.length > 0 && (
            <div className="mb-5">
              <JobStatsBar stats={stats} />
            </div>
          )}

          {/* View toggle */}
          {!loading && jobs.length > 0 && (
            <div className="flex items-center gap-1 mb-5 bg-black/[0.03] border border-black/[0.08] rounded-xl p-1 w-fit">
              <button
                onClick={() => setView('kanban')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  view === 'kanban'
                    ? 'bg-white text-primary shadow-sm border border-black/[0.06]'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <LayoutGrid size={13} />
                {t('jobs.viewKanban')}
              </button>
              <button
                onClick={() => setView('list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  view === 'list'
                    ? 'bg-white text-primary shadow-sm border border-black/[0.06]'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                <List size={13} />
                {t('jobs.viewList')}
              </button>
            </div>
          )}

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div
                  key={i}
                  className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5 animate-pulse"
                >
                  <div className="h-4 bg-black/[0.04] rounded w-3/4 mb-3" />
                  <div className="h-3 bg-black/[0.03] rounded w-1/2 mb-2" />
                  <div className="h-3 bg-black/[0.03] rounded w-1/3 mb-2" />
                  <div className="h-8 bg-black/[0.02] rounded w-full mt-4" />
                  <div className="h-8 bg-black/[0.02] rounded w-full mt-2" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-black/[0.04] border border-black/[0.06] flex items-center justify-center mx-auto mb-4">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="text-text-tertiary"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <p className="text-text-secondary mb-1">{t('jobs.empty')}</p>
              <p className="text-text-tertiary text-sm mb-6">
                {t('jobs.emptySubtitle')}
              </p>
              <button
                onClick={() => setShowAddModal(true)}
                className="btn-primary text-sm"
              >
                {t('jobs.addFirstJob')}
              </button>
            </div>
          )}

          {/* Main content */}
          {!loading && jobs.length > 0 && (
            <>
              {view === 'kanban' ? (
                <KanbanBoard
                  jobs={jobs}
                  onJobClick={(job) => setSelectedJob(job)}
                  onStatusChange={handleStatusChange}
                  onReorder={handleReorder}
                />
              ) : (
                <JobListView
                  jobs={jobs}
                  onJobClick={(job) => setSelectedJob(job)}
                  onDelete={deleteJob}
                />
              )}
            </>
          )}
        </div>
      </main>

      {/* Add Job Modal */}
      <AddJobModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={addJob}
      />

      {/* Job Detail Modal */}
      <JobDetailModal
        isOpen={!!selectedJob}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onUpdate={updateJob}
        onDelete={deleteJob}
      />

      {/* Toast */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Footer />
    </>
  );
}
