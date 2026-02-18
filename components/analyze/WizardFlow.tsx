'use client';

import { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import type { CareerQuestionnaire, JobPostingInput } from '@/lib/types';
import { COUNTRIES, COUNTRY_CURRENCY } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

// ============================================================================
// Types
// ============================================================================

interface WizardFlowProps {
  onSubmit: (data: {
    linkedInFile: File | null;
    cvFile: File | null;
    questionnaire: CareerQuestionnaire;
  }) => void;
  onDemo: () => void;
}

type Step = 'linkedin' | 'cv' | 'details' | 'jobs' | 'review';
const STEPS: Step[] = ['linkedin', 'cv', 'details', 'jobs', 'review'];

// ============================================================================
// Icons
// ============================================================================

const STEP_ICONS: Record<Step, React.ReactNode> = {
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  cv: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
  details: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
  jobs: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  review: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>,
};

const WORK_PREF_ICONS: Record<string, React.ReactNode> = {
  remote: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  hybrid: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  onsite: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  flexible: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
};

// ============================================================================
// Main Component
// ============================================================================

export default function WizardFlow({ onSubmit, onDemo }: WizardFlowProps) {
  const { t } = useTranslation();
  const [currentStep, setCurrentStep] = useState<Step>('linkedin');
  const [direction, setDirection] = useState<'forward' | 'back'>('forward');
  const contentRef = useRef<HTMLDivElement>(null);

  // --- File state ---
  const [linkedInFile, setLinkedInFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const linkedInInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // --- Auto-detection state ---
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedInfo, setDetectedInfo] = useState('');

  // --- Questionnaire state ---
  const [questionnaire, setQuestionnaire] = useState<CareerQuestionnaire>({
    currentRole: '',
    targetRole: '',
    yearsExperience: 0,
    country: '',
    workPreference: 'remote',
  });

  // --- Job postings state ---
  const [jobPostings, setJobPostings] = useState<JobPostingInput[]>([
    { text: '', url: '', title: '' },
    { text: '', url: '', title: '' },
    { text: '', url: '', title: '' },
  ]);
  const [fetchingJobIdx, setFetchingJobIdx] = useState<number | null>(null);
  const [jobErrors, setJobErrors] = useState<Record<number, string>>({});

  // Auto-detect profile from LinkedIn PDF
  useEffect(() => {
    if (!linkedInFile) {
      setDetectedInfo('');
      return;
    }
    let cancelled = false;
    setIsDetecting(true);
    const formData = new FormData();
    formData.append('cv', linkedInFile);
    fetch('/api/detect-profile', { method: 'POST', body: formData })
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data?.isLinkedIn) { setIsDetecting(false); return; }
        setQuestionnaire(prev => ({
          ...prev,
          ...(data.currentRole && !prev.currentRole ? { currentRole: data.currentRole } : {}),
          ...(data.yearsExperience > 0 && !prev.yearsExperience ? { yearsExperience: data.yearsExperience } : {}),
          ...(data.country && !prev.country ? { country: data.country } : {}),
        }));
        const parts: string[] = [];
        if (data.currentRole) parts.push(data.currentRole);
        if (data.yearsExperience > 0) parts.push(`${data.yearsExperience} yrs`);
        if (data.country) parts.push(data.country);
        setDetectedInfo(data.summary || parts.join(' · '));
        setIsDetecting(false);
      })
      .catch(() => { if (!cancelled) setIsDetecting(false); });
    return () => { cancelled = true; };
  }, [linkedInFile]);

  const stepIndex = STEPS.indexOf(currentStep);
  const currency = useMemo(() => COUNTRY_CURRENCY[questionnaire.country] || { code: 'EUR', symbol: 'EUR' }, [questionnaire.country]);

  // --- Validation ---
  const hasLinkedInOrCV = linkedInFile || cvFile;
  const filledJobPostings = jobPostings.filter(j => j.text.trim().length > 50);

  const canProceed: Record<Step, boolean> = {
    linkedin: true, // LinkedIn is encouraged, not required
    cv: hasLinkedInOrCV as unknown as boolean, // At least one file needed
    details: !!(questionnaire.currentRole.trim() && questionnaire.targetRole.trim() && questionnaire.yearsExperience > 0 && questionnaire.country),
    jobs: true, // Jobs are encouraged but not blocking
    review: !!(hasLinkedInOrCV && questionnaire.currentRole.trim() && questionnaire.targetRole.trim() && questionnaire.yearsExperience > 0 && questionnaire.country),
  };

  // --- Navigation ---
  const goNext = useCallback(() => {
    setDirection('forward');
    const idx = STEPS.indexOf(currentStep);
    if (idx < STEPS.length - 1) {
      setCurrentStep(STEPS[idx + 1]);
      contentRef.current?.scrollTo({ top: 0 });
    }
  }, [currentStep]);

  const goBack = useCallback(() => {
    setDirection('back');
    const idx = STEPS.indexOf(currentStep);
    if (idx > 0) {
      setCurrentStep(STEPS[idx - 1]);
      contentRef.current?.scrollTo({ top: 0 });
    }
  }, [currentStep]);

  const goToStep = useCallback((step: Step) => {
    const targetIdx = STEPS.indexOf(step);
    const curIdx = STEPS.indexOf(currentStep);
    setDirection(targetIdx > curIdx ? 'forward' : 'back');
    setCurrentStep(step);
    contentRef.current?.scrollTo({ top: 0 });
  }, [currentStep]);

  // --- Questionnaire helpers ---
  const updateQ = useCallback((field: keyof CareerQuestionnaire, value: string | number | undefined) => {
    setQuestionnaire(prev => ({ ...prev, [field]: value }));
  }, []);

  // --- Job posting helpers ---
  const updateJob = useCallback((idx: number, field: keyof JobPostingInput, value: string) => {
    setJobPostings(prev => {
      const updated = [...prev];
      updated[idx] = { ...updated[idx], [field]: value };
      return updated;
    });
    if (jobErrors[idx]) {
      setJobErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
    }
  }, [jobErrors]);

  const fetchJobUrl = useCallback(async (idx: number) => {
    const url = jobPostings[idx]?.url?.trim();
    if (!url) return;
    setFetchingJobIdx(idx);
    setJobErrors(prev => { const n = { ...prev }; delete n[idx]; return n; });
    try {
      const response = await fetch('/api/fetch-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await response.json();
      if (!response.ok) {
        setJobErrors(prev => ({ ...prev, [idx]: result.message || 'Could not fetch.' }));
        return;
      }
      const text = result.fullText || [result.title, result.company, result.description, result.requirements].filter(Boolean).join('\n\n');
      if (text) {
        setJobPostings(prev => {
          const updated = [...prev];
          updated[idx] = { text, url, title: result.title || '' };
          return updated;
        });
      } else {
        setJobErrors(prev => ({ ...prev, [idx]: 'No content found. Try pasting instead.' }));
      }
    } catch {
      setJobErrors(prev => ({ ...prev, [idx]: 'Failed to fetch. Try pasting instead.' }));
    } finally {
      setFetchingJobIdx(null);
    }
  }, [jobPostings]);

  const addJobSlot = useCallback(() => {
    if (jobPostings.length < 5) {
      setJobPostings(prev => [...prev, { text: '', url: '', title: '' }]);
    }
  }, [jobPostings.length]);

  // --- Submit ---
  const handleSubmit = useCallback(() => {
    // Merge job postings into questionnaire
    const filled = jobPostings.filter(j => j.text.trim().length > 50);
    const mergedQ: CareerQuestionnaire = {
      ...questionnaire,
      jobPostings: filled.length > 0 ? filled : undefined,
      // Backward compat: set jobPosting to first posting text
      jobPosting: filled.length > 0 ? filled.map(j => j.text).join('\n\n---JOB POSTING SEPARATOR---\n\n') : undefined,
    };
    onSubmit({ linkedInFile, cvFile, questionnaire: mergedQ });
  }, [questionnaire, jobPostings, linkedInFile, cvFile, onSubmit]);

  // --- File drop handler ---
  const handleFileDrop = useCallback((e: React.DragEvent, type: 'linkedin' | 'cv') => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file?.type === 'application/pdf') {
      if (type === 'linkedin') setLinkedInFile(file);
      else setCvFile(file);
    }
  }, []);

  // ============================================================================
  // Step Labels
  // ============================================================================
  const STEP_LABELS: Record<Step, string> = {
    linkedin: t('wizard.steps.linkedin') as string || 'LinkedIn Profile',
    cv: t('wizard.steps.cv') as string || 'CV / Resume',
    details: t('wizard.steps.details') as string || 'Career Details',
    jobs: t('wizard.steps.jobs') as string || 'Target Jobs',
    review: t('wizard.steps.review') as string || 'Review & Analyze',
  };

  // ============================================================================
  // Render Steps
  // ============================================================================

  const renderLinkedInStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {t('wizard.linkedin.title') || 'Upload your LinkedIn Profile'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.linkedin.subtitle') || 'Export your profile as PDF from LinkedIn for the most comprehensive analysis. We auto-detect your current role, experience, and location.'}
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${linkedInFile
            ? 'border-[#0A66C2]/30 bg-[#0A66C2]/[0.06]'
            : 'border-white/[0.12] bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05]'
          }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileDrop(e, 'linkedin')}
        onClick={() => linkedInInputRef.current?.click()}
      >
        <input
          ref={linkedInInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0] || null;
            setLinkedInFile(f);
          }}
        />

        {linkedInFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-[#0A66C2]/[0.12] border border-[#0A66C2]/20 flex items-center justify-center text-[#0A66C2]">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p className="font-semibold text-white">{linkedInFile.name}</p>
              <p className="text-sm text-text-tertiary mt-0.5">{(linkedInFile.size / 1024).toFixed(0)} KB</p>
            </div>
            {isDetecting && (
              <div className="flex items-center gap-2 text-sm text-primary animate-pulse">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
                {t('wizard.linkedin.detecting') || 'Detecting profile info...'}
              </div>
            )}
            {detectedInfo && (
              <div className="px-4 py-2.5 bg-success/[0.06] border border-success/15 rounded-xl text-sm text-success">
                ✓ {detectedInfo}
              </div>
            )}
            <button
              onClick={(e) => { e.stopPropagation(); setLinkedInFile(null); }}
              className="text-xs text-text-tertiary hover:text-danger transition-colors"
            >
              {t('common.remove') || 'Remove'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#0A66C2]/[0.08] border border-[#0A66C2]/15 flex items-center justify-center text-[#0A66C2]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">{t('wizard.linkedin.dropHere') || 'Drop LinkedIn PDF here'}</p>
              <p className="text-sm text-text-tertiary">{t('wizard.linkedin.orBrowse') || 'or click to browse'}</p>
            </div>
          </div>
        )}
      </div>

      {/* How to export guide */}
      <details className="group rounded-xl border border-white/[0.10] bg-white/[0.03]">
        <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-text-secondary hover:text-white transition-colors">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            {t('wizard.linkedin.howToExport') || 'How to export your LinkedIn profile as PDF'}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-open:rotate-180"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div className="px-4 pb-4 text-sm text-text-secondary space-y-2">
          <p>1. Go to your LinkedIn profile page</p>
          <p>2. Click the <strong className="text-white">More</strong> button (⋯) below your profile photo</p>
          <p>3. Select <strong className="text-white">Save to PDF</strong></p>
          <p>4. Upload the downloaded PDF here</p>
        </div>
      </details>

      <p className="text-xs text-text-tertiary text-center">
        {t('wizard.linkedin.optional') || 'This step is optional but recommended for the best analysis.'}
      </p>
    </div>
  );

  const renderCVStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {t('wizard.cv.title') || 'Upload your CV / Resume'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.cv.subtitle') || 'Your CV is the primary document we analyze. PDF format, max 5MB.'}
        </p>
      </div>

      {/* Drop zone */}
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${cvFile
            ? 'border-primary/30 bg-primary/[0.06]'
            : 'border-white/[0.12] bg-white/[0.03] hover:border-primary/30 hover:bg-white/[0.05]'
          }`}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleFileDrop(e, 'cv')}
        onClick={() => cvInputRef.current?.click()}
      >
        <input
          ref={cvInputRef}
          type="file"
          accept=".pdf"
          className="hidden"
          onChange={(e) => setCvFile(e.target.files?.[0] || null)}
        />

        {cvFile ? (
          <div className="flex flex-col items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-primary/[0.12] border border-primary/20 flex items-center justify-center text-primary">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
            <div>
              <p className="font-semibold text-white">{cvFile.name}</p>
              <p className="text-sm text-text-tertiary mt-0.5">{(cvFile.size / 1024).toFixed(0)} KB</p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); setCvFile(null); }}
              className="text-xs text-text-tertiary hover:text-danger transition-colors"
            >
              {t('common.remove') || 'Remove'}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center text-primary">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
            </div>
            <div>
              <p className="font-semibold text-white mb-1">{t('wizard.cv.dropHere') || 'Drop your CV here'}</p>
              <p className="text-sm text-text-tertiary">{t('wizard.cv.orBrowse') || 'PDF format, max 5MB'}</p>
            </div>
          </div>
        )}
      </div>

      {!hasLinkedInOrCV && (
        <div className="flex items-center gap-2 px-4 py-3 bg-warning/[0.06] border border-warning/15 rounded-xl text-sm text-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {t('wizard.cv.needAtLeastOne') || 'Upload at least a CV or LinkedIn PDF to proceed.'}
        </div>
      )}
    </div>
  );

  const renderDetailsStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {t('wizard.details.title') || 'Tell us about your career goals'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {detectedInfo
            ? (t('wizard.details.prefilled') || 'We pre-filled some fields from your profile. Verify and complete the rest.')
            : (t('wizard.details.subtitle') || 'This helps us tailor the analysis to your specific situation.')}
        </p>
      </div>

      <div className="space-y-5">
        {/* Current role */}
        <div>
          <label htmlFor="w-currentRole" className="label">{t('questionnaire.currentRole') || 'Current Role'} <span className="text-danger text-xs">*</span></label>
          <input id="w-currentRole" type="text" className="input-field" value={questionnaire.currentRole} onChange={(e) => updateQ('currentRole', e.target.value)} placeholder="e.g., Technical Enablement Engineer" />
        </div>

        {/* Target role */}
        <div>
          <label htmlFor="w-targetRole" className="label">{t('questionnaire.targetRole') || 'Target Role'} <span className="text-danger text-xs">*</span></label>
          <input id="w-targetRole" type="text" className="input-field" value={questionnaire.targetRole} onChange={(e) => updateQ('targetRole', e.target.value)} placeholder="e.g., AI Solutions Architect" />
        </div>

        {/* Alt roles */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-4 border-l-2 border-primary/20">
          <div>
            <label htmlFor="w-targetRole2" className="label text-xs">{t('questionnaire.targetRole2Label') || 'Alternative Role 2'} <span className="text-text-tertiary font-normal">({t('common.optional') || 'optional'})</span></label>
            <input id="w-targetRole2" type="text" className="input-field text-sm" value={questionnaire.targetRole2 || ''} onChange={(e) => updateQ('targetRole2', e.target.value || undefined)} placeholder="e.g., Technical Enablement Manager" />
          </div>
          <div>
            <label htmlFor="w-targetRole3" className="label text-xs">{t('questionnaire.targetRole3Label') || 'Alternative Role 3'} <span className="text-text-tertiary font-normal">({t('common.optional') || 'optional'})</span></label>
            <input id="w-targetRole3" type="text" className="input-field text-sm" value={questionnaire.targetRole3 || ''} onChange={(e) => updateQ('targetRole3', e.target.value || undefined)} placeholder="e.g., AI Consultant" />
          </div>
        </div>

        {/* Experience + Country row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="w-years" className="label">{t('questionnaire.yearsExperience') || 'Years of Experience'} <span className="text-danger text-xs">*</span></label>
            <input id="w-years" type="number" min={0} max={50} className="input-field" value={questionnaire.yearsExperience || ''} onChange={(e) => updateQ('yearsExperience', parseInt(e.target.value) || 0)} placeholder="e.g., 14" />
          </div>
          <div>
            <label htmlFor="w-country" className="label">{t('questionnaire.country') || 'Country / Region'} <span className="text-danger text-xs">*</span></label>
            <select id="w-country" className="input-field" value={questionnaire.country} onChange={(e) => updateQ('country', e.target.value)}>
              <option value="">{t('questionnaire.selectCountry') || 'Select country'}</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>

        {/* Work preference */}
        <div>
          <label className="label">{t('questionnaire.workPreference') || 'Work Preference'}</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {(['remote', 'hybrid', 'onsite', 'flexible'] as const).map(wp => (
              <button
                key={wp}
                type="button"
                onClick={() => updateQ('workPreference', wp)}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border
                  ${questionnaire.workPreference === wp
                    ? 'bg-primary/[0.10] border-primary/25 text-primary'
                    : 'bg-white/[0.03] border-white/[0.10] text-text-tertiary hover:border-white/[0.16] hover:text-text-secondary'
                  }`}
              >
                {WORK_PREF_ICONS[wp]}
                {t(`questionnaire.${wp}`) || wp.charAt(0).toUpperCase() + wp.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Salary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="w-curSalary" className="label text-xs">
              {t('questionnaire.currentSalary') || 'Current Annual Salary'}
              <span className="text-text-tertiary font-normal ml-1">({t('common.optional') || 'optional'})</span>
            </label>
            <div className="relative">
              <input id="w-curSalary" type="number" className="input-field pr-14" value={questionnaire.currentSalary || ''} onChange={(e) => updateQ('currentSalary', parseInt(e.target.value) || undefined)} placeholder="e.g., 55000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary bg-white/[0.07] px-2 py-0.5 rounded-md">{currency.code}</span>
            </div>
          </div>
          <div>
            <label htmlFor="w-tarSalary" className="label text-xs">
              {t('questionnaire.targetSalary') || 'Target Annual Salary'}
              <span className="text-text-tertiary font-normal ml-1">({t('common.optional') || 'optional'})</span>
            </label>
            <div className="relative">
              <input id="w-tarSalary" type="number" className="input-field pr-14" value={questionnaire.targetSalary || ''} onChange={(e) => updateQ('targetSalary', parseInt(e.target.value) || undefined)} placeholder="e.g., 85000" />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-text-tertiary bg-white/[0.07] px-2 py-0.5 rounded-md">{currency.code}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderJobsStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {t('wizard.jobs.title') || 'Add target job postings'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.jobs.subtitle') || 'Add 3 or more jobs you\'re interested in. This dramatically improves the analysis — we identify common requirements, missing skills, and tailor your roadmap.'}
        </p>
      </div>

      {/* Job counter */}
      <div className="flex items-center gap-3">
        <div className={`px-3 py-1.5 rounded-full text-sm font-medium border ${filledJobPostings.length >= 3 ? 'bg-success/[0.08] border-success/15 text-success' : filledJobPostings.length > 0 ? 'bg-primary/[0.08] border-primary/15 text-primary' : 'bg-white/[0.05] border-white/[0.10] text-text-tertiary'}`}>
          {filledJobPostings.length} / 3 {t('wizard.jobs.minimum') || 'minimum'}
        </div>
        {filledJobPostings.length < 3 && (
          <p className="text-xs text-text-tertiary">{t('wizard.jobs.moreIsBetter') || 'More jobs = better analysis'}</p>
        )}
      </div>

      {/* Job posting cards */}
      <div className="space-y-4">
        {jobPostings.map((job, idx) => (
          <div key={idx} className="rounded-2xl border border-white/[0.10] bg-white/[0.03] p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-primary/[0.10] border border-primary/15 text-primary text-xs font-bold flex items-center justify-center">{idx + 1}</span>
                {job.title || `${t('wizard.jobs.posting') || 'Job Posting'} ${idx + 1}`}
              </h3>
              {job.text.trim().length > 50 && (
                <span className="text-xs text-success flex items-center gap-1">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('common.added') || 'Added'}
                </span>
              )}
            </div>

            {/* URL fetch */}
            <div className="flex gap-2 mb-3">
              <input
                type="url"
                className="input-field text-sm flex-1"
                placeholder={t('wizard.jobs.urlPlaceholder') || 'Paste LinkedIn/Indeed job URL...'}
                value={job.url || ''}
                onChange={(e) => updateJob(idx, 'url', e.target.value)}
              />
              <button
                type="button"
                onClick={() => fetchJobUrl(idx)}
                disabled={!job.url?.trim() || fetchingJobIdx === idx}
                className="btn-secondary text-xs px-4 whitespace-nowrap disabled:opacity-40"
              >
                {fetchingJobIdx === idx ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><circle cx="12" cy="12" r="10" strokeDasharray="60" strokeDashoffset="20"/></svg>
                ) : (t('common.fetch') || 'Fetch')}
              </button>
            </div>

            {jobErrors[idx] && (
              <p className="text-xs text-danger mb-2">{jobErrors[idx]}</p>
            )}

            {/* Text area */}
            <textarea
              className="input-field text-sm min-h-[100px] resize-y"
              placeholder={t('wizard.jobs.pasteHere') || 'Or paste the full job description here...'}
              value={job.text}
              onChange={(e) => updateJob(idx, 'text', e.target.value)}
            />
          </div>
        ))}
      </div>

      {/* Add more */}
      {jobPostings.length < 5 && (
        <button
          type="button"
          onClick={addJobSlot}
          className="flex items-center gap-2 text-sm text-text-tertiary hover:text-primary transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          {t('wizard.jobs.addAnother') || 'Add another job posting'} ({jobPostings.length}/5)
        </button>
      )}

      <p className="text-xs text-text-tertiary">
        {t('wizard.jobs.skipNote') || 'You can skip this step, but providing job postings significantly improves the analysis quality.'}
      </p>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
          {t('wizard.review.title') || 'Review & Launch Analysis'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.review.subtitle') || 'Verify everything looks good, then launch your AI career analysis.'}
        </p>
      </div>

      {/* Summary cards */}
      <div className="space-y-3">
        {/* Documents */}
        <ReviewCard
          step="linkedin"
          label={STEP_LABELS.linkedin}
          icon={STEP_ICONS.linkedin}
          status={linkedInFile ? linkedInFile.name : (t('wizard.review.notProvided') || 'Not provided')}
          done={!!linkedInFile}
          onEdit={() => goToStep('linkedin')}
          t={t}
        />
        <ReviewCard
          step="cv"
          label={STEP_LABELS.cv}
          icon={STEP_ICONS.cv}
          status={cvFile ? cvFile.name : (t('wizard.review.notProvided') || 'Not provided')}
          done={!!cvFile}
          required={!hasLinkedInOrCV}
          onEdit={() => goToStep('cv')}
          t={t}
        />

        {/* Career details */}
        <ReviewCard
          step="details"
          label={STEP_LABELS.details}
          icon={STEP_ICONS.details}
          status={questionnaire.currentRole && questionnaire.targetRole
            ? `${questionnaire.currentRole} → ${questionnaire.targetRole} · ${questionnaire.yearsExperience} yrs · ${questionnaire.country}`
            : (t('wizard.review.incomplete') || 'Incomplete')
          }
          done={canProceed.details}
          required={!canProceed.details}
          onEdit={() => goToStep('details')}
          t={t}
        />

        {/* Jobs */}
        <ReviewCard
          step="jobs"
          label={STEP_LABELS.jobs}
          icon={STEP_ICONS.jobs}
          status={filledJobPostings.length > 0
            ? `${filledJobPostings.length} job${filledJobPostings.length > 1 ? 's' : ''} added`
            : (t('wizard.review.noJobs') || 'No job postings — analysis will be more general')
          }
          done={filledJobPostings.length >= 3}
          onEdit={() => goToStep('jobs')}
          t={t}
        />
      </div>

      {/* Launch button */}
      <div className="pt-4">
        <button
          onClick={handleSubmit}
          disabled={!canProceed.review}
          className="group btn-primary text-base sm:text-lg px-8 sm:px-12 py-4 flex items-center gap-3 disabled:shadow-none w-full justify-center rounded-2xl"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
          </svg>
          {t('common.analyzeMyCareer') || 'Analyze My Career'}
          <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </button>
        {!canProceed.review && (
          <p className="text-sm text-danger text-center mt-3">
            {!hasLinkedInOrCV
              ? (t('wizard.review.needFile') || 'Upload at least a CV or LinkedIn PDF')
              : (t('wizard.review.needDetails') || 'Complete all required career details')}
          </p>
        )}
      </div>
    </div>
  );

  // ============================================================================
  // Step renderer map
  // ============================================================================
  const stepRenderers: Record<Step, () => React.ReactNode> = {
    linkedin: renderLinkedInStep,
    cv: renderCVStep,
    details: renderDetailsStep,
    jobs: renderJobsStep,
    review: renderReviewStep,
  };

  // ============================================================================
  // Main Render
  // ============================================================================
  return (
    <div className="max-w-3xl mx-auto">
      {/* Step progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          {STEPS.map((step, i) => {
            const isActive = step === currentStep;
            const isPast = i < stepIndex;
            const isClickable = i <= stepIndex || (i === stepIndex + 1 && canProceed[currentStep]);
            return (
              <button
                key={step}
                onClick={() => isClickable ? goToStep(step) : undefined}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200
                  ${isActive ? 'bg-primary/[0.10] border border-primary/25 text-primary' : ''}
                  ${isPast ? 'text-success cursor-pointer hover:bg-white/[0.05]' : ''}
                  ${!isActive && !isPast ? 'text-text-tertiary' : ''}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default opacity-60'}
                `}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive ? 'bg-primary/20 text-primary' : ''}
                  ${isPast ? 'bg-success/15 text-success' : ''}
                  ${!isActive && !isPast ? 'bg-white/[0.05] text-text-tertiary' : ''}
                `}>
                  {isPast ? (
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
                  ) : (
                    STEP_ICONS[step]
                  )}
                </span>
                <span className="hidden sm:inline">{STEP_LABELS[step]}</span>
              </button>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="h-1 rounded-full bg-white/[0.06]">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-accent-orange transition-all duration-500 ease-out"
            style={{ width: `${((stepIndex + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step content */}
      <div ref={contentRef} className="min-h-[400px]">
        <div
          key={currentStep}
          className={`animate-slideIn ${direction === 'forward' ? 'animate-slideInRight' : 'animate-slideInLeft'}`}
          style={{ animation: `slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards` }}
        >
          {stepRenderers[currentStep]()}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/[0.08]">
        <div>
          {stepIndex > 0 ? (
            <button onClick={goBack} className="btn-secondary text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
              {t('common.back') || 'Back'}
            </button>
          ) : (
            <button onClick={onDemo} className="btn-secondary text-sm flex items-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
              {t('common.tryDemo') || 'Try Demo'}
            </button>
          )}
        </div>

        <div className="text-xs text-text-tertiary">
          {stepIndex + 1} / {STEPS.length}
        </div>

        {currentStep !== 'review' ? (
          <button
            onClick={goNext}
            disabled={!canProceed[currentStep]}
            className="btn-primary text-sm flex items-center gap-2 disabled:opacity-40"
          >
            {currentStep === 'linkedin' && !linkedInFile
              ? (t('common.skip') || 'Skip')
              : currentStep === 'jobs' && filledJobPostings.length === 0
                ? (t('common.skip') || 'Skip')
                : (t('common.next') || 'Next')
            }
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        ) : (
          <div /> // Empty div for spacing, submit button is in step content
        )}
      </div>
    </div>
  );
}

// ============================================================================
// Review Card Sub-component
// ============================================================================
function ReviewCard({ label, icon, status, done, required, onEdit, t }: {
  step: Step;
  label: string;
  icon: React.ReactNode;
  status: string;
  done: boolean;
  required?: boolean;
  onEdit: () => void;
  t: (key: string) => string;
}) {
  return (
    <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all
      ${required ? 'border-danger/20 bg-danger/[0.04]' : done ? 'border-success/15 bg-success/[0.04]' : 'border-white/[0.10] bg-white/[0.03]'}
    `}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${required ? 'bg-danger/10 text-danger' : done ? 'bg-success/10 text-success' : 'bg-white/[0.06] text-text-tertiary'}
      `}>
        {done ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        ) : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-white">{label}</p>
        <p className="text-xs text-text-secondary truncate">{status}</p>
      </div>
      <button onClick={onEdit} className="text-xs text-primary hover:text-primary-light transition-colors flex-shrink-0">
        {t('common.edit') || 'Edit'}
      </button>
    </div>
  );
}