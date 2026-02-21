'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { JobApplication, JobApplicationInput, UpworkJobPosting } from '@/lib/types';

type ImportMode = 'standard' | 'upwork';

interface AddJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (input: JobApplicationInput) => Promise<void>;
  initialData?: Partial<JobApplication>;
  title?: string;
}

const CURRENCY_OPTIONS = [
  'EUR', 'USD', 'GBP', 'CHF', 'RON', 'PLN', 'CZK', 'SEK', 'DKK', 'CAD', 'INR', 'BRL',
];

const WORK_TYPE_OPTIONS = ['remote', 'hybrid', 'onsite', 'flexible'] as const;

export default function AddJobModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  title: modalTitle,
}: AddJobModalProps) {
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [mode, setMode] = useState<ImportMode>('standard');

  // Upwork import state
  const [upworkJobText, setUpworkJobText] = useState('');
  const [upworkJobUrl, setUpworkJobUrl] = useState('');
  const [parsingUpwork, setParsingUpwork] = useState(false);
  const [upworkError, setUpworkError] = useState('');
  const [parsedUpworkJob, setParsedUpworkJob] = useState<UpworkJobPosting | null>(null);

  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [jobPostingText, setJobPostingText] = useState('');
  const [location, setLocation] = useState('');
  const [workType, setWorkType] = useState<'remote' | 'hybrid' | 'onsite' | 'flexible'>('remote');
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [currency, setCurrency] = useState('EUR');
  const [appliedAt, setAppliedAt] = useState('');
  const [followUpAt, setFollowUpAt] = useState('');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [notes, setNotes] = useState('');

  // Populate from initialData when editing
  useEffect(() => {
    if (initialData) {
      setCompany(initialData.company || '');
      setRoleTitle(initialData.roleTitle || '');
      setJobUrl(initialData.jobUrl || '');
      setJobPostingText(initialData.jobPostingText || '');
      setLocation(initialData.location || '');
      setWorkType(initialData.workType || 'remote');
      setSalaryMin(initialData.salaryMin ? String(initialData.salaryMin) : '');
      setSalaryMax(initialData.salaryMax ? String(initialData.salaryMax) : '');
      setCurrency(initialData.currency || 'EUR');
      setAppliedAt(initialData.appliedAt ? initialData.appliedAt.slice(0, 10) : '');
      setFollowUpAt(initialData.followUpAt ? initialData.followUpAt.slice(0, 10) : '');
      setContactName(initialData.contactName || '');
      setContactEmail(initialData.contactEmail || '');
      setNotes(initialData.notes || '');
    } else {
      // Reset form for "Add" mode
      setCompany('');
      setRoleTitle('');
      setJobUrl('');
      setJobPostingText('');
      setLocation('');
      setWorkType('remote');
      setSalaryMin('');
      setSalaryMax('');
      setCurrency('EUR');
      setAppliedAt('');
      setFollowUpAt('');
      setContactName('');
      setContactEmail('');
      setNotes('');
    }
    // Reset Upwork state on modal open/close
    setMode('standard');
    setUpworkJobText('');
    setUpworkJobUrl('');
    setParsingUpwork(false);
    setUpworkError('');
    setParsedUpworkJob(null);
  }, [initialData, isOpen]);

  const isValid = company.trim().length > 0 && roleTitle.trim().length > 0;

  const handleSave = useCallback(async () => {
    if (!isValid || saving) return;
    setSaving(true);
    try {
      const input: JobApplicationInput = {
        company: company.trim(),
        roleTitle: roleTitle.trim(),
        jobUrl: jobUrl.trim() || undefined,
        jobPostingText: jobPostingText.trim() || undefined,
        location: location.trim() || undefined,
        workType: workType || undefined,
        salaryMin: salaryMin ? Number(salaryMin) : undefined,
        salaryMax: salaryMax ? Number(salaryMax) : undefined,
        currency: currency || undefined,
        appliedAt: appliedAt || undefined,
        followUpAt: followUpAt || undefined,
        contactName: contactName.trim() || undefined,
        contactEmail: contactEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      };
      await onSave(input);
      onClose();
    } catch {
      // Error handling is done by the parent
    } finally {
      setSaving(false);
    }
  }, [
    isValid, saving, company, roleTitle, jobUrl, jobPostingText, location,
    workType, salaryMin, salaryMax, currency, appliedAt, followUpAt,
    contactName, contactEmail, notes, onSave, onClose,
  ]);

  const handleUpworkParse = useCallback(async () => {
    const text = upworkJobText.trim();
    if (text.length < 50) {
      setUpworkError(t('upwork.jobs.minChars') || 'Please paste at least 50 characters of job posting text.');
      return;
    }
    setParsingUpwork(true);
    setUpworkError('');
    try {
      const res = await fetch('/api/parse-upwork-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobText: text }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to parse job posting');
      }
      const data = await res.json();
      setParsedUpworkJob(data.posting);
    } catch (err) {
      setUpworkError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setParsingUpwork(false);
    }
  }, [upworkJobText, t]);

  const handleUpworkSave = useCallback(async () => {
    if (!parsedUpworkJob || saving) return;
    setSaving(true);
    try {
      const input: JobApplicationInput = {
        company: parsedUpworkJob.title || 'Upwork Client',
        roleTitle: parsedUpworkJob.title,
        jobUrl: upworkJobUrl.trim() || undefined,
        jobPostingText: parsedUpworkJob.description,
        location: parsedUpworkJob.clientInfo?.country || undefined,
        workType: 'remote',
        source: 'upwork',
        metadata: {
          upworkJob: parsedUpworkJob,
          screeningQuestions: parsedUpworkJob.screeningQuestions || [],
        },
      };
      if (parsedUpworkJob.budget) {
        if (parsedUpworkJob.budget.min) input.salaryMin = parsedUpworkJob.budget.min;
        if (parsedUpworkJob.budget.max) input.salaryMax = parsedUpworkJob.budget.max;
      }
      await onSave(input);
      onClose();
    } catch {
      // Error handled by parent
    } finally {
      setSaving(false);
    }
  }, [parsedUpworkJob, saving, upworkJobUrl, onSave, onClose]);

  if (!isOpen) return null;

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-primary/20 focus:border-primary/40 outline-none transition-all';
  const labelClass = 'block text-sm font-medium text-text-primary mb-1.5';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-lg sm:rounded-2xl rounded-t-2xl border border-black/[0.08] shadow-xl max-h-[90vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/[0.06] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-text-primary font-display">
            {modalTitle || t('jobs.addJob')}
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-black/[0.04]"
          >
            <X size={18} />
          </button>
        </div>

        {/* Mode Toggle — only show when adding, not editing */}
        {!initialData && (
          <div className="px-6 pt-4 pb-0 flex gap-2">
            <button
              onClick={() => { setMode('standard'); setParsedUpworkJob(null); setUpworkError(''); }}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                mode === 'standard'
                  ? 'bg-primary/[0.08] border-primary/20 text-primary'
                  : 'bg-black/[0.02] border-black/[0.08] text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {t('jobs.modeStandard') || 'Standard Job'}
            </button>
            <button
              onClick={() => setMode('upwork')}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium transition-all border ${
                mode === 'upwork'
                  ? 'bg-[#14A800]/[0.08] border-[#14A800]/20 text-[#14A800]'
                  : 'bg-black/[0.02] border-black/[0.08] text-text-tertiary hover:text-text-secondary'
              }`}
            >
              {t('jobs.modeUpwork') || 'Upwork Job'}
            </button>
          </div>
        )}

        {/* Upwork Import Mode */}
        {mode === 'upwork' && !initialData && (
          <div className="px-6 py-5 space-y-4">
            {parsedUpworkJob ? (
              /* Parsed preview */
              <div className="space-y-4">
                <div className="rounded-2xl border border-[#14A800]/20 bg-[#14A800]/[0.04] p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle size={18} className="text-[#14A800]" />
                    <span className="text-sm font-semibold text-[#14A800]">
                      {t('upwork.jobs.parsed') || 'Job Parsed Successfully'}
                    </span>
                  </div>
                  <p className="text-lg font-bold text-text-primary">{parsedUpworkJob.title}</p>
                  {parsedUpworkJob.clientInfo?.country && (
                    <p className="text-sm text-text-secondary mt-0.5">{parsedUpworkJob.clientInfo.country}</p>
                  )}
                  <div className="flex flex-wrap items-center gap-3 text-xs text-text-tertiary mt-2">
                    {parsedUpworkJob.budget && (
                      <span>
                        {parsedUpworkJob.budget.type === 'fixed' ? 'Fixed' : 'Hourly'}
                        {parsedUpworkJob.budget.min != null && ` $${parsedUpworkJob.budget.min}`}
                        {parsedUpworkJob.budget.max != null && `-$${parsedUpworkJob.budget.max}`}
                      </span>
                    )}
                    {parsedUpworkJob.projectLength && <span>{parsedUpworkJob.projectLength}</span>}
                    {parsedUpworkJob.experienceLevel && <span>{parsedUpworkJob.experienceLevel}</span>}
                  </div>
                  {parsedUpworkJob.skills && parsedUpworkJob.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {parsedUpworkJob.skills.slice(0, 8).map((s) => (
                        <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-[#14A800]/[0.08] text-[#14A800] font-medium">
                          {s}
                        </span>
                      ))}
                      {parsedUpworkJob.skills.length > 8 && (
                        <span className="px-2 py-0.5 text-xs rounded-md bg-black/[0.04] text-text-tertiary">
                          +{parsedUpworkJob.skills.length - 8}
                        </span>
                      )}
                    </div>
                  )}
                  {parsedUpworkJob.screeningQuestions && parsedUpworkJob.screeningQuestions.length > 0 && (
                    <p className="text-xs text-text-tertiary mt-2">
                      {parsedUpworkJob.screeningQuestions.length} {t('upwork.jobs.screeningQs') || 'screening questions'}
                    </p>
                  )}
                </div>

                <button
                  onClick={() => { setParsedUpworkJob(null); setUpworkError(''); }}
                  className="text-sm text-text-tertiary hover:text-text-secondary transition-colors"
                >
                  {t('upwork.jobs.repaste') || 'Paste different job'}
                </button>
              </div>
            ) : (
              /* Paste form */
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>
                    {t('upwork.jobs.pasteLabel') || 'Paste Upwork job posting'}
                  </label>
                  <textarea
                    className={`${inputClass} min-h-[160px] resize-y`}
                    value={upworkJobText}
                    onChange={(e) => { setUpworkJobText(e.target.value); setUpworkError(''); }}
                    placeholder={t('upwork.jobs.pastePlaceholder') || 'Copy the full Upwork job posting text and paste it here...'}
                    maxLength={50000}
                  />
                  {upworkJobText.length > 0 && (
                    <p className="text-xs text-text-tertiary mt-1">{upworkJobText.length.toLocaleString()} characters</p>
                  )}
                </div>

                <div>
                  <label className={labelClass}>
                    {t('upwork.jobs.urlLabel') || 'Job URL (optional)'}
                  </label>
                  <input
                    type="url"
                    className={inputClass}
                    value={upworkJobUrl}
                    onChange={(e) => setUpworkJobUrl(e.target.value)}
                    placeholder="https://www.upwork.com/jobs/..."
                  />
                </div>

                {upworkError && (
                  <div className="flex items-center gap-2 text-sm text-danger">
                    <AlertCircle size={15} />
                    <span>{upworkError}</span>
                  </div>
                )}

                <button
                  onClick={handleUpworkParse}
                  disabled={parsingUpwork || upworkJobText.trim().length < 50}
                  className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  style={{
                    backgroundColor: upworkJobText.trim().length >= 50 && !parsingUpwork ? '#14A800' : undefined,
                    borderColor: upworkJobText.trim().length >= 50 && !parsingUpwork ? '#14A800' : undefined,
                  }}
                >
                  {parsingUpwork ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      {t('upwork.jobs.parsing') || 'Parsing...'}
                    </>
                  ) : (
                    t('upwork.jobs.parseButton') || 'Parse Job Posting'
                  )}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Standard Form — show when standard mode OR editing */}
        {(mode === 'standard' || initialData) && (
        <div className="px-6 py-5 space-y-4">
          {/* Company */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.company')} <span className="text-danger text-xs">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={200}
              placeholder={t('jobs.fields.companyPlaceholder')}
            />
          </div>

          {/* Role Title */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.roleTitle')} <span className="text-danger text-xs">*</span>
            </label>
            <input
              type="text"
              className={inputClass}
              value={roleTitle}
              onChange={(e) => setRoleTitle(e.target.value)}
              maxLength={200}
              placeholder={t('jobs.fields.roleTitlePlaceholder')}
            />
          </div>

          {/* Job URL */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.jobUrl')}
            </label>
            <input
              type="url"
              className={inputClass}
              value={jobUrl}
              onChange={(e) => setJobUrl(e.target.value)}
              placeholder="https://..."
            />
          </div>

          {/* Job Posting Text */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.jobPosting')}
            </label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={jobPostingText}
              onChange={(e) => setJobPostingText(e.target.value)}
              maxLength={10000}
              placeholder={t('jobs.fields.jobPostingPlaceholder')}
            />
          </div>

          {/* Location */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.location')}
            </label>
            <input
              type="text"
              className={inputClass}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              maxLength={200}
              placeholder={t('jobs.fields.locationPlaceholder')}
            />
          </div>

          {/* Work Type */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.workType')}
            </label>
            <select
              className={inputClass}
              value={workType}
              onChange={(e) =>
                setWorkType(e.target.value as 'remote' | 'hybrid' | 'onsite' | 'flexible')
              }
            >
              {WORK_TYPE_OPTIONS.map((wt) => (
                <option key={wt} value={wt}>
                  {t(`jobs.workType.${wt}`)}
                </option>
              ))}
            </select>
          </div>

          {/* Salary Range */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.salaryRange')}
            </label>
            <div className="grid grid-cols-[1fr_auto_1fr_auto] gap-2 items-center">
              <input
                type="number"
                className={inputClass}
                value={salaryMin}
                onChange={(e) => setSalaryMin(e.target.value)}
                placeholder={t('jobs.fields.min')}
                min={0}
              />
              <span className="text-text-tertiary text-sm">-</span>
              <input
                type="number"
                className={inputClass}
                value={salaryMax}
                onChange={(e) => setSalaryMax(e.target.value)}
                placeholder={t('jobs.fields.max')}
                min={0}
              />
              <select
                className={`${inputClass} !w-auto`}
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
              >
                {CURRENCY_OPTIONS.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('jobs.fields.appliedDate')}
              </label>
              <input
                type="date"
                className={inputClass}
                value={appliedAt}
                onChange={(e) => setAppliedAt(e.target.value)}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t('jobs.fields.followUpDate')}
              </label>
              <input
                type="date"
                className={inputClass}
                value={followUpAt}
                onChange={(e) => setFollowUpAt(e.target.value)}
              />
            </div>
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                {t('jobs.fields.contactName')}
              </label>
              <input
                type="text"
                className={inputClass}
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                placeholder={t('jobs.fields.contactNamePlaceholder')}
              />
            </div>
            <div>
              <label className={labelClass}>
                {t('jobs.fields.contactEmail')}
              </label>
              <input
                type="email"
                className={inputClass}
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder={t('jobs.fields.contactEmailPlaceholder')}
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className={labelClass}>
              {t('jobs.fields.notes')}
            </label>
            <textarea
              className={`${inputClass} min-h-[80px] resize-y`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={5000}
              placeholder={t('jobs.fields.notesPlaceholder')}
            />
          </div>
        </div>
        )}

        {/* Footer */}
        <div className="sticky bottom-0 bg-white border-t border-black/[0.06] px-6 py-4 flex items-center justify-end gap-3 rounded-b-2xl">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all duration-200"
          >
            {t('jobs.cancel')}
          </button>
          {mode === 'upwork' && parsedUpworkJob ? (
            <button
              onClick={handleUpworkSave}
              disabled={saving}
              className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#14A800', borderColor: '#14A800' }}
            >
              {saving ? t('jobs.saving') : (t('upwork.jobs.saveToTracker') || 'Save to Tracker')}
            </button>
          ) : mode === 'standard' || initialData ? (
            <button
              onClick={handleSave}
              disabled={!isValid || saving}
              className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? t('jobs.saving') : t('jobs.save')}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
