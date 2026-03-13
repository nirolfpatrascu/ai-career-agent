'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import type { CareerQuestionnaire, UpworkProfile } from '@/lib/types';
import { COUNTRIES } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import UpworkImport from './UpworkImport';

// ============================================================================
// Types
// ============================================================================

interface WizardFlowProps {
  onSubmit: (data: {
    linkedInFile: File | null;
    cvFile: File | null;
    questionnaire: CareerQuestionnaire;
    upworkProfile?: UpworkProfile;
  }) => void;
  onDemo: () => void;
}

type Step = 'linkedin' | 'cv' | 'jobs' | 'review';
const STEPS: Step[] = ['linkedin', 'cv', 'jobs', 'review'];

// ============================================================================
// Icons
// ============================================================================

const STEP_ICONS: Record<Step, React.ReactNode> = {
  linkedin: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>,
  cv: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>,
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

  // --- Import source toggle ---
  const [importSource, setImportSource] = useState<'linkedin' | 'upwork'>('linkedin');

  // --- File state ---
  const [linkedInFile, setLinkedInFile] = useState<File | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const linkedInInputRef = useRef<HTMLInputElement>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);

  // --- Upwork profile state ---
  const [upworkProfile, setUpworkProfile] = useState<UpworkProfile | null>(null);

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

  // --- Job state (single job) ---
  const [jobDescription, setJobDescription] = useState('');

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

  // --- Validation ---
  const hasLinkedInOrCV = linkedInFile || cvFile || upworkProfile;
  const hasJobDescription = jobDescription.trim().length > 50;
  const hasRequiredCareerFields = !!(questionnaire.currentRole.trim() && questionnaire.targetRole.trim() && questionnaire.yearsExperience > 0 && questionnaire.country);

  const canProceed: Record<Step, boolean> = {
    linkedin: true, // LinkedIn is encouraged, not required
    cv: !!hasLinkedInOrCV, // At least one file/profile needed
    jobs: hasRequiredCareerFields && hasJobDescription, // Career fields + job description required
    review: !!(hasLinkedInOrCV && hasRequiredCareerFields && hasJobDescription),
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

  // --- Submit ---
  const handleSubmit = useCallback(() => {
    const trimmedDesc = jobDescription.trim();
    const mergedQ: CareerQuestionnaire = {
      ...questionnaire,
      jobPostings: trimmedDesc.length > 50 ? [{ text: trimmedDesc, url: '', title: '' }] : undefined,
      jobPosting: trimmedDesc.length > 50 ? trimmedDesc : undefined,
    };
    onSubmit({ linkedInFile, cvFile, questionnaire: mergedQ, upworkProfile: upworkProfile || undefined });
  }, [questionnaire, jobDescription, linkedInFile, cvFile, upworkProfile, onSubmit]);

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
    jobs: t('wizard.steps.jobs') as string || 'Target Job',
    review: t('wizard.steps.review') as string || 'Review & Analyze',
  };

  // ============================================================================
  // Render Steps
  // ============================================================================

  const handleUpworkProfileImported = useCallback((profile: UpworkProfile) => {
    setUpworkProfile(profile);
    // Auto-fill questionnaire fields from Upwork profile
    if (profile.title && !questionnaire.currentRole) {
      setQuestionnaire(prev => ({ ...prev, currentRole: profile.title }));
    }
  }, [questionnaire.currentRole]);

  const renderLinkedInStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-display mb-2">
          {t('wizard.linkedin.title') || 'Upload your LinkedIn Profile'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.linkedin.subtitle') || 'Export your profile as PDF from LinkedIn for the most comprehensive analysis. We auto-detect your current role, experience, and location.'}
        </p>
      </div>

      {/* LinkedIn Drop zone */}
      {(
      <>
      <div
        className={`relative rounded-2xl border-2 border-dashed p-8 sm:p-12 text-center transition-all duration-300 cursor-pointer
          ${linkedInFile
            ? 'border-[#0A66C2]/30 bg-[#0A66C2]/[0.06]'
            : 'border-black/[0.08] bg-black/[0.02] hover:border-primary/30 hover:bg-black/[0.03]'
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
              <p className="font-semibold text-text-primary">{linkedInFile.name}</p>
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
              <p className="font-semibold text-text-primary mb-1">{t('wizard.linkedin.dropHere') || 'Drop LinkedIn PDF here'}</p>
              <p className="text-sm text-text-tertiary">{t('wizard.linkedin.orBrowse') || 'or click to browse'}</p>
            </div>
          </div>
        )}
      </div>

      {/* How to export guide */}
      <details className="group rounded-xl border border-black/[0.08] bg-black/[0.02]">
        <summary className="flex items-center justify-between p-4 cursor-pointer text-sm font-medium text-text-secondary hover:text-text-primary transition-colors">
          <span className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
            {t('wizard.linkedin.howToExport') || 'How to export your LinkedIn profile as PDF'}
          </span>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="transition-transform duration-200 group-open:rotate-180"><polyline points="6 9 12 15 18 9"/></svg>
        </summary>
        <div className="px-4 pb-4 text-sm text-text-secondary space-y-2">
          <p>1. Go to your LinkedIn profile page</p>
          <p>2. Click the <strong className="text-text-primary">More</strong> or <strong className="text-text-primary">Resources</strong> button (⋯) below your profile photo</p>
          <p>3. Select <strong className="text-text-primary">Save to PDF</strong></p>
          <p>4. Upload the downloaded PDF here</p>
        </div>
      </details>

      <p className="text-sm font-bold text-text-primary text-center">
        {t('wizard.linkedin.optional') || 'This step is optional but highly recommended for the best analysis.'}
      </p>
      </>
      )}
    </div>
  );

  const renderCVStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-display mb-2">
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
            : 'border-black/[0.08] bg-black/[0.02] hover:border-primary/30 hover:bg-black/[0.03]'
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
              <p className="font-semibold text-text-primary">{cvFile.name}</p>
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
              <p className="font-semibold text-text-primary mb-1">{t('wizard.cv.dropHere') || 'Drop your CV here'}</p>
              <p className="text-sm text-text-tertiary">{t('wizard.cv.orBrowse') || 'PDF format, max 5MB'}</p>
            </div>
          </div>
        )}
      </div>

      {/* GitHub URL input */}
      <div>
        <label htmlFor="w-githubUrl" className="label text-sm">
          {t('wizard.cv.githubLabel') || 'GitHub Profile URL'}{' '}
          <span className="text-text-tertiary font-normal">({t('common.optional') || 'optional'})</span>
        </label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
          <input
            id="w-githubUrl"
            type="url"
            className={`input-field pl-10 ${questionnaire.githubUrl && !questionnaire.githubUrl.startsWith('https://github.com/') ? 'border-danger/40' : ''}`}
            value={questionnaire.githubUrl || ''}
            onChange={(e) => updateQ('githubUrl', e.target.value || undefined)}
            placeholder="https://github.com/username"
          />
        </div>
        {questionnaire.githubUrl && !questionnaire.githubUrl.startsWith('https://github.com/') && (
          <p className="text-xs text-danger mt-1">{t('wizard.cv.githubInvalid') || 'URL must start with https://github.com/'}</p>
        )}
        <p className="text-xs text-text-tertiary mt-1">{t('wizard.cv.githubHint') || "We'll analyze your repos, languages, and contributions"}</p>
      </div>

      {!hasLinkedInOrCV && (
        <div className="flex items-center gap-2 px-4 py-3 bg-warning/[0.06] border border-warning/15 rounded-xl text-sm text-warning">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
          {t('wizard.cv.needAtLeastOne') || 'Upload at least a CV, LinkedIn PDF, or Upwork profile to proceed.'}
        </div>
      )}
    </div>
  );

  const renderJobsStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-display mb-2">
          {t('wizard.jobs.title') || 'Paste your target job description'}
        </h2>
        <p className="text-text-secondary text-sm sm:text-base leading-relaxed">
          {t('wizard.jobs.subtitle') || 'Paste the full job description below. This allows us to tailor the analysis to the specific role — identifying missing skills, matching requirements, and building your roadmap.'}
        </p>
      </div>

      {/* Career fields */}
      <div className="space-y-4 rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="w-currentRole" className="label text-sm">{t('questionnaire.currentRole') || 'Current Role'} <span className="text-danger text-xs">*</span></label>
            <input id="w-currentRole" type="text" className="input-field" value={questionnaire.currentRole} onChange={(e) => updateQ('currentRole', e.target.value)} placeholder="e.g., Frontend Developer" />
          </div>
          <div>
            <label htmlFor="w-targetRole" className="label text-sm">{t('questionnaire.targetRole') || 'Target Role'} <span className="text-danger text-xs">*</span></label>
            <input id="w-targetRole" type="text" className="input-field" value={questionnaire.targetRole} onChange={(e) => updateQ('targetRole', e.target.value)} placeholder="e.g., AI Solutions Architect" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="w-years" className="label text-sm">{t('questionnaire.yearsExperience') || 'Years of Experience'} <span className="text-danger text-xs">*</span></label>
            <input id="w-years" type="number" min={0} max={50} className="input-field" value={questionnaire.yearsExperience || ''} onChange={(e) => updateQ('yearsExperience', parseInt(e.target.value) || 0)} placeholder="e.g., 5" />
          </div>
          <div>
            <label htmlFor="w-country" className="label text-sm">{t('questionnaire.country') || 'Country / Region'} <span className="text-danger text-xs">*</span></label>
            <select id="w-country" className="input-field" value={questionnaire.country} onChange={(e) => updateQ('country', e.target.value)}>
              <option value="">{t('questionnaire.selectCountry') || 'Select country'}</option>
              {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Job description */}
      <div>
        <label htmlFor="w-jobDesc" className="label text-sm flex items-center justify-between">
          <span>{t('wizard.jobs.descriptionLabel') || 'Job Description'} <span className="text-danger text-xs">*</span></span>
          {hasJobDescription && (
            <span className="text-xs text-success font-normal flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"/></svg>
              {t('common.added') || 'Added'}
            </span>
          )}
        </label>
        <textarea
          id="w-jobDesc"
          className="input-field text-sm min-h-[200px] resize-y"
          placeholder={t('wizard.jobs.pasteHere') || 'Paste the full job description here...'}
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
        />
        <p className="text-sm font-bold text-text-primary mt-1.5">
          {t('wizard.jobs.hint') || 'Include the full posting: responsibilities, requirements, qualifications, etc.'}
        </p>
      </div>

      {/* Work preference */}
      <div>
        <label className="label text-sm">{t('questionnaire.workPreference') || 'Work Preference'}</label>
        <div className="grid grid-cols-3 gap-2">
          {(['remote', 'hybrid', 'onsite'] as const).map(wp => (
            <button
              key={wp}
              type="button"
              onClick={() => updateQ('workPreference', wp)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium transition-all duration-200 border
                ${questionnaire.workPreference === wp
                  ? 'bg-primary/[0.10] border-primary/25 text-primary'
                  : 'bg-black/[0.02] border-black/[0.08] text-text-tertiary hover:border-black/[0.10] hover:text-text-secondary'
                }`}
            >
              {WORK_PREF_ICONS[wp]}
              {t(`questionnaire.workOptions.${wp}`) || wp.charAt(0).toUpperCase() + wp.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-start gap-2 px-4 py-3 bg-primary/[0.05] border border-primary/15 rounded-xl">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary flex-shrink-0 mt-0.5"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
        <p className="text-sm text-text-secondary">
          {t('wizard.jobs.requiredNote') || 'A job description is required. Without it, we cannot determine what role you are targeting or tailor the gap analysis and action plan to your specific opportunity.'}
        </p>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-text-primary font-display mb-2">
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
          status={
            linkedInFile ? linkedInFile.name
            : upworkProfile ? `Upwork: ${upworkProfile.name}`
            : (t('wizard.review.notProvided') || 'Not provided')
          }
          done={!!linkedInFile || !!upworkProfile}
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

        {/* Target job & career details */}
        <ReviewCard
          step="jobs"
          label={STEP_LABELS.jobs}
          icon={STEP_ICONS.jobs}
          status={hasRequiredCareerFields
            ? `${questionnaire.currentRole} → ${questionnaire.targetRole} · ${questionnaire.yearsExperience} yrs · ${questionnaire.country}${hasJobDescription ? ' · Job added' : ''}`
            : (t('wizard.review.incomplete') || 'Incomplete')
          }
          done={hasRequiredCareerFields}
          required={!hasRequiredCareerFields}
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
              : !hasJobDescription
                ? (t('wizard.review.needJob') || 'Paste a job description to continue')
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
                  ${isPast ? 'text-success cursor-pointer hover:bg-black/[0.03]' : ''}
                  ${!isActive && !isPast ? 'text-text-tertiary' : ''}
                  ${isClickable ? 'cursor-pointer' : 'cursor-default opacity-60'}
                `}
              >
                <span className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 transition-all
                  ${isActive ? 'bg-primary/20 text-primary' : ''}
                  ${isPast ? 'bg-success/15 text-success' : ''}
                  ${!isActive && !isPast ? 'bg-black/[0.03] text-text-tertiary' : ''}
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
        <div className="h-1 rounded-full bg-black/[0.04]">
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
      <div className="flex items-center justify-between mt-8 pt-6 border-t border-black/[0.06]">
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
      ${required ? 'border-danger/20 bg-danger/[0.04]' : done ? 'border-success/15 bg-success/[0.04]' : 'border-black/[0.08] bg-black/[0.02]'}
    `}>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
        ${required ? 'bg-danger/10 text-danger' : done ? 'bg-success/10 text-success' : 'bg-black/[0.04] text-text-tertiary'}
      `}>
        {done ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        ) : icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        <p className="text-xs text-text-secondary truncate">{status}</p>
      </div>
      <button onClick={onEdit} className="text-xs text-primary hover:text-primary-light transition-colors flex-shrink-0">
        {t('common.edit') || 'Edit'}
      </button>
    </div>
  );
}
