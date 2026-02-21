'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  X,
  Pencil,
  Trash2,
  MapPin,
  DollarSign,
  ExternalLink,
  Calendar,
  Clock,
  User,
  Mail,
  ChevronDown,
  ChevronUp,
  Save,
  BarChart3,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication, JobApplicationInput, JobStatus, UpworkJobPosting } from '@/lib/types';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import CoverLetterGenerator from './CoverLetterGenerator';

interface JobDetailModalProps {
  isOpen: boolean;
  job: JobApplication | null;
  onClose: () => void;
  onUpdate: (
    id: string,
    updates: Partial<JobApplicationInput & { status?: JobStatus }>
  ) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

const STATUS_OPTIONS: JobStatus[] = [
  'saved',
  'applied',
  'interviewing',
  'offer',
  'rejected',
  'withdrawn',
];

const STATUS_COLORS: Record<JobStatus, string> = {
  saved: '#6B7280',
  applied: '#3B82F6',
  interviewing: '#8B5CF6',
  offer: '#22C55E',
  rejected: '#EF4444',
  withdrawn: '#9CA3AF',
};

function getFollowUpLabel(
  followUpAt: string | undefined,
  t: (key: string) => string
): { text: string; isUrgent: boolean } | null {
  if (!followUpAt) return null;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const followUp = new Date(followUpAt);
  followUp.setHours(0, 0, 0, 0);
  const diffMs = followUp.getTime() - today.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) return { text: t('jobs.followUp.overdue'), isUrgent: true };
  if (diffDays === 0) return { text: t('jobs.followUp.dueToday'), isUrgent: true };
  return {
    text: new Date(followUpAt).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }),
    isUrgent: false,
  };
}

export default function JobDetailModal({
  isOpen,
  job,
  onClose,
  onUpdate,
  onDelete,
}: JobDetailModalProps) {
  const { t } = useTranslation();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showCoverLetter, setShowCoverLetter] = useState(false);
  const [editingNotes, setEditingNotes] = useState(false);
  const [notesValue, setNotesValue] = useState('');
  const [notesSaved, setNotesSaved] = useState(false);
  const [showFullPosting, setShowFullPosting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Edit mode fields
  const [editCompany, setEditCompany] = useState('');
  const [editRoleTitle, setEditRoleTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editJobUrl, setEditJobUrl] = useState('');
  const [editContactName, setEditContactName] = useState('');
  const [editContactEmail, setEditContactEmail] = useState('');

  const notesTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (job) {
      setNotesValue(job.notes || '');
      setEditCompany(job.company);
      setEditRoleTitle(job.roleTitle);
      setEditLocation(job.location || '');
      setEditJobUrl(job.jobUrl || '');
      setEditContactName(job.contactName || '');
      setEditContactEmail(job.contactEmail || '');
    }
    setIsEditing(false);
    setShowFullPosting(false);
    setEditingNotes(false);
    setNotesSaved(false);
  }, [job]);

  const handleNotesBlur = useCallback(() => {
    if (!job) return;
    if (notesTimeoutRef.current) clearTimeout(notesTimeoutRef.current);
    notesTimeoutRef.current = setTimeout(async () => {
      if (notesValue !== (job.notes || '')) {
        await onUpdate(job.id, { notes: notesValue || undefined });
        setNotesSaved(true);
        setTimeout(() => setNotesSaved(false), 2000);
      }
      setEditingNotes(false);
    }, 500);
  }, [job, notesValue, onUpdate]);

  const handleStatusChange = useCallback(
    async (newStatus: JobStatus) => {
      if (!job) return;
      await onUpdate(job.id, { status: newStatus });
    },
    [job, onUpdate]
  );

  const handleDelete = useCallback(async () => {
    if (!job) return;
    setDeleting(true);
    try {
      await onDelete(job.id);
      setShowDeleteConfirm(false);
      onClose();
    } finally {
      setDeleting(false);
    }
  }, [job, onDelete, onClose]);

  const handleEditSave = useCallback(async () => {
    if (!job) return;
    await onUpdate(job.id, {
      company: editCompany.trim(),
      roleTitle: editRoleTitle.trim(),
      location: editLocation.trim() || undefined,
      jobUrl: editJobUrl.trim() || undefined,
      contactName: editContactName.trim() || undefined,
      contactEmail: editContactEmail.trim() || undefined,
    });
    setIsEditing(false);
  }, [job, onUpdate, editCompany, editRoleTitle, editLocation, editJobUrl, editContactName, editContactEmail]);

  if (!isOpen || !job) return null;

  const salaryRange =
    job.salaryMin || job.salaryMax
      ? [job.salaryMin && `${job.salaryMin.toLocaleString()}`, job.salaryMax && `${job.salaryMax.toLocaleString()}`]
          .filter(Boolean)
          .join(' - ') + ` ${job.currency}`
      : null;

  const followUp = getFollowUpLabel(job.followUpAt, t);

  const matchScoreColor =
    job.matchScore !== undefined && job.matchScore !== null
      ? job.matchScore >= 75
        ? '#22C55E'
        : job.matchScore >= 50
        ? '#F59E0B'
        : '#EF4444'
      : '#9CA3AF';

  const postingPreview = job.jobPostingText
    ? job.jobPostingText.length > 150
      ? job.jobPostingText.slice(0, 150) + '...'
      : job.jobPostingText
    : null;

  // Timeline events
  const timeline: Array<{ label: string; date: string }> = [];
  timeline.push({ label: t('jobs.timeline.saved'), date: job.createdAt });
  if (job.appliedAt) {
    timeline.push({ label: t('jobs.timeline.applied'), date: job.appliedAt });
  }
  if (job.status !== 'saved' && job.status !== 'applied') {
    timeline.push({
      label: t(`jobs.status.${job.status}`),
      date: job.statusUpdatedAt,
    });
  }

  const inputClass =
    'w-full px-3 py-2 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all';

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
        onClick={onClose}
      >
        <div
          className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl border border-black/[0.08] shadow-xl max-h-[92vh] overflow-y-auto animate-slide-up"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-black/[0.06] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
            <div className="flex-1 min-w-0" />
            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-text-tertiary hover:text-primary transition-colors p-1.5 rounded-lg hover:bg-primary/[0.06]"
                  title={t('jobs.edit')}
                >
                  <Pencil size={16} />
                </button>
              )}
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-text-tertiary hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/[0.06]"
                title={t('jobs.delete')}
              >
                <Trash2 size={16} />
              </button>
              <button
                onClick={onClose}
                className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-black/[0.04]"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="px-6 py-5 space-y-5">
            {/* Company & Role */}
            {isEditing ? (
              <div className="space-y-3">
                <input
                  className={inputClass}
                  value={editCompany}
                  onChange={(e) => setEditCompany(e.target.value)}
                  placeholder={t('jobs.fields.company')}
                />
                <input
                  className={inputClass}
                  value={editRoleTitle}
                  onChange={(e) => setEditRoleTitle(e.target.value)}
                  placeholder={t('jobs.fields.roleTitle')}
                />
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-text-primary font-display">
                  {job.company}
                </h2>
                <p className="text-lg text-text-secondary mt-0.5">
                  {job.roleTitle}
                </p>
              </div>
            )}

            <hr className="border-black/[0.06]" />

            {/* Status dropdown */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-medium text-text-secondary">
                {t('jobs.fields.status')}:
              </span>
              <select
                value={job.status}
                onChange={(e) => handleStatusChange(e.target.value as JobStatus)}
                className="text-sm font-medium px-3 py-1.5 rounded-full border-0 outline-none cursor-pointer"
                style={{
                  backgroundColor: `${STATUS_COLORS[job.status]}14`,
                  color: STATUS_COLORS[job.status],
                }}
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s} value={s}>
                    {t(`jobs.status.${s}`)}
                  </option>
                ))}
              </select>
            </div>

            {/* Info rows */}
            <div className="space-y-3">
              {/* Location */}
              {(isEditing || job.location) && (
                <div className="flex items-center gap-3 text-sm">
                  <MapPin size={15} className="text-text-tertiary flex-shrink-0" />
                  {isEditing ? (
                    <input
                      className={inputClass}
                      value={editLocation}
                      onChange={(e) => setEditLocation(e.target.value)}
                      placeholder={t('jobs.fields.location')}
                    />
                  ) : (
                    <span className="text-text-secondary">{job.location}</span>
                  )}
                </div>
              )}

              {/* Salary */}
              {salaryRange && (
                <div className="flex items-center gap-3 text-sm">
                  <DollarSign size={15} className="text-text-tertiary flex-shrink-0" />
                  <span className="text-text-secondary">{salaryRange}</span>
                </div>
              )}

              {/* Job URL */}
              {(isEditing || job.jobUrl) && (
                <div className="flex items-center gap-3 text-sm">
                  <ExternalLink size={15} className="text-text-tertiary flex-shrink-0" />
                  {isEditing ? (
                    <input
                      className={inputClass}
                      value={editJobUrl}
                      onChange={(e) => setEditJobUrl(e.target.value)}
                      placeholder={t('jobs.fields.jobUrl')}
                    />
                  ) : (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline truncate"
                    >
                      {job.jobUrl}
                    </a>
                  )}
                </div>
              )}

              {/* Applied date */}
              {job.appliedAt && (
                <div className="flex items-center gap-3 text-sm">
                  <Calendar size={15} className="text-text-tertiary flex-shrink-0" />
                  <span className="text-text-secondary">
                    {t('jobs.applied')}:{' '}
                    {new Date(job.appliedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              )}

              {/* Follow-up date */}
              {followUp && (
                <div className="flex items-center gap-3 text-sm">
                  <Clock
                    size={15}
                    className={`flex-shrink-0 ${
                      followUp.isUrgent ? 'text-[#E8890A]' : 'text-text-tertiary'
                    }`}
                  />
                  <span
                    className={
                      followUp.isUrgent
                        ? 'text-[#E8890A] font-medium'
                        : 'text-text-secondary'
                    }
                  >
                    {t('jobs.followUp.label')}: {followUp.text}
                  </span>
                </div>
              )}

              {/* Contact */}
              {(isEditing || job.contactName || job.contactEmail) && (
                <>
                  {(isEditing || job.contactName) && (
                    <div className="flex items-center gap-3 text-sm">
                      <User size={15} className="text-text-tertiary flex-shrink-0" />
                      {isEditing ? (
                        <input
                          className={inputClass}
                          value={editContactName}
                          onChange={(e) => setEditContactName(e.target.value)}
                          placeholder={t('jobs.fields.contactName')}
                        />
                      ) : (
                        <span className="text-text-secondary">{job.contactName}</span>
                      )}
                    </div>
                  )}
                  {(isEditing || job.contactEmail) && (
                    <div className="flex items-center gap-3 text-sm">
                      <Mail size={15} className="text-text-tertiary flex-shrink-0" />
                      {isEditing ? (
                        <input
                          className={inputClass}
                          value={editContactEmail}
                          onChange={(e) => setEditContactEmail(e.target.value)}
                          placeholder={t('jobs.fields.contactEmail')}
                        />
                      ) : (
                        <a
                          href={`mailto:${job.contactEmail}`}
                          className="text-primary hover:underline"
                        >
                          {job.contactEmail}
                        </a>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Edit Save/Cancel */}
            {isEditing && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleEditSave}
                  className="btn-primary text-sm !py-2 !px-4 !rounded-xl flex items-center gap-1.5"
                >
                  <Save size={14} />
                  {t('jobs.save')}
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    if (job) {
                      setEditCompany(job.company);
                      setEditRoleTitle(job.roleTitle);
                      setEditLocation(job.location || '');
                      setEditJobUrl(job.jobUrl || '');
                      setEditContactName(job.contactName || '');
                      setEditContactEmail(job.contactEmail || '');
                    }
                  }}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all"
                >
                  {t('jobs.cancel')}
                </button>
              </div>
            )}

            {/* Match Score Card */}
            {job.matchScore !== undefined && job.matchScore !== null && (
              <div
                className="rounded-xl border p-4 flex items-center justify-between"
                style={{
                  borderColor: `${matchScoreColor}30`,
                  backgroundColor: `${matchScoreColor}08`,
                }}
              >
                <div className="flex items-center gap-3">
                  <BarChart3 size={20} style={{ color: matchScoreColor }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: matchScoreColor }}>
                      {t('jobs.matchScore')}: {job.matchScore}%
                    </p>
                  </div>
                </div>
                {job.jobPostingText && (
                  <a
                    href={`/analyze?jobPosting=${encodeURIComponent(
                      job.jobPostingText
                    )}&company=${encodeURIComponent(
                      job.company
                    )}&role=${encodeURIComponent(job.roleTitle)}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    {t('jobs.runAnalysis')}
                  </a>
                )}
              </div>
            )}

            {/* Upwork Cover Letter Button */}
            {job.source === 'upwork' && !!job.metadata?.upworkJob && (
              <button
                onClick={() => setShowCoverLetter(true)}
                className="w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all border"
                style={{
                  backgroundColor: '#14A800' + '0A',
                  borderColor: '#14A800' + '30',
                  color: '#14A800',
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                {t('upwork.coverLetter.generate') || 'Generate Cover Letter'}
                {Array.isArray(job.metadata?.screeningQuestions) && (job.metadata!.screeningQuestions as unknown[]).length > 0 ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#14A800]/15">
                    {(job.metadata!.screeningQuestions as unknown[]).length} Qs
                  </span>
                ) : null}
              </button>
            )}

            {/* Notes */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-sm font-medium text-text-primary">
                  {t('jobs.fields.notes')}
                </label>
                {notesSaved && (
                  <span className="text-xs text-success font-medium animate-fade-in">
                    {t('jobs.notesSaved')}
                  </span>
                )}
              </div>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all min-h-[80px] resize-y"
                value={notesValue}
                onChange={(e) => setNotesValue(e.target.value)}
                onFocus={() => setEditingNotes(true)}
                onBlur={handleNotesBlur}
                placeholder={t('jobs.fields.notesPlaceholder')}
                maxLength={5000}
              />
            </div>

            {/* Job Posting */}
            {postingPreview && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-1.5 block">
                  {t('jobs.fields.jobPosting')}
                </label>
                <div className="bg-black/[0.02] border border-black/[0.06] rounded-xl p-3.5 text-xs text-text-secondary leading-relaxed">
                  {showFullPosting ? job.jobPostingText : postingPreview}
                  {job.jobPostingText && job.jobPostingText.length > 150 && (
                    <button
                      onClick={() => setShowFullPosting(!showFullPosting)}
                      className="flex items-center gap-1 text-primary text-xs font-medium mt-2 hover:underline"
                    >
                      {showFullPosting ? (
                        <>
                          <ChevronUp size={12} />
                          {t('jobs.showLess')}
                        </>
                      ) : (
                        <>
                          <ChevronDown size={12} />
                          {t('jobs.showMore')}
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Timeline */}
            {timeline.length > 0 && (
              <div>
                <label className="text-sm font-medium text-text-primary mb-3 block">
                  {t('jobs.timeline.title')}
                </label>
                <div className="relative pl-5 space-y-3">
                  {/* Vertical line */}
                  <div className="absolute left-[7px] top-1 bottom-1 w-px bg-black/[0.08]" />
                  {timeline.map((event, i) => (
                    <div key={i} className="flex items-start gap-3 relative">
                      <div
                        className="w-3.5 h-3.5 rounded-full border-2 border-white flex-shrink-0 -ml-5 mt-0.5"
                        style={{
                          backgroundColor:
                            i === timeline.length - 1
                              ? STATUS_COLORS[job.status]
                              : '#D1D5DB',
                        }}
                      />
                      <div>
                        <p className="text-sm font-medium text-text-primary">
                          {event.label}
                        </p>
                        <p className="text-xs text-text-tertiary">
                          {new Date(event.date).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Delete confirmation */}
      <DeleteConfirmDialog
        isOpen={showDeleteConfirm}
        title={t('jobs.deleteConfirm.title')}
        message={t('jobs.deleteConfirm.message')}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteConfirm(false)}
        loading={deleting}
      />

      {/* Cover Letter Generator */}
      {showCoverLetter && job.source === 'upwork' && !!job.metadata?.upworkJob && (
        <CoverLetterGenerator
          isOpen={showCoverLetter}
          onClose={() => setShowCoverLetter(false)}
          jobPosting={job.metadata.upworkJob as UpworkJobPosting}
        />
      )}
    </>
  );
}
