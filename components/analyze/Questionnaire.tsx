'use client';

import { useMemo, useState, useCallback } from 'react';
import type { CareerQuestionnaire } from '@/lib/types';
import { COUNTRIES, COUNTRY_CURRENCY } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';

interface QuestionnaireProps {
  data: CareerQuestionnaire;
  onChange: (data: CareerQuestionnaire) => void;
}

const WORK_PREF_KEYS = ['remote', 'hybrid', 'onsite', 'flexible'] as const;

const WORK_PREF_ICONS: Record<string, React.ReactNode> = {
  remote: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  hybrid: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
  onsite: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><line x1="12" y1="18" x2="12.01" y2="18"/></svg>,
  flexible: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>,
};

export default function Questionnaire({ data, onChange }: QuestionnaireProps) {
  const { t } = useTranslation();
  const [showExtraRoles, setShowExtraRoles] = useState(
    !!(data.targetRole2 || data.targetRole3)
  );
  const [jobUrlInput, setJobUrlInput] = useState('');
  const [fetchingJob, setFetchingJob] = useState(false);
  const [jobFetchError, setJobFetchError] = useState('');
  const [jobFetched, setJobFetched] = useState(false);
  const [jobMode, setJobMode] = useState<'url' | 'paste'>(
    data.jobPosting ? 'paste' : 'url'
  );

  const update = (field: keyof CareerQuestionnaire, value: string | number | undefined) => {
    onChange({ ...data, [field]: value });
  };

  const currency = useMemo(() => {
    return COUNTRY_CURRENCY[data.country] || { code: 'EUR', symbol: 'EUR' };
  }, [data.country]);

  const handleFetchJob = useCallback(async () => {
    if (!jobUrlInput.trim()) return;

    setFetchingJob(true);
    setJobFetchError('');
    setJobFetched(false);

    try {
      const response = await fetch('/api/fetch-job', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: jobUrlInput.trim() }),
      });

      const result = await response.json();

      if (!response.ok) {
        setJobFetchError(result.message || 'Could not fetch job posting.');
        return;
      }

      const text = result.fullText || [result.title, result.company, result.description, result.requirements].filter(Boolean).join('\n\n');
      if (text) {
        onChange({ ...data, jobPosting: text, jobPostingUrl: jobUrlInput.trim() });
        setJobFetched(true);
      } else {
        setJobFetchError('No job content found. Try pasting the text instead.');
      }
    } catch {
      setJobFetchError('Something went wrong. Try pasting the text instead.');
    } finally {
      setFetchingJob(false);
    }
  }, [jobUrlInput, data, onChange]);

  return (
    <div className="space-y-5">
      {/* Current Role */}
      <div>
        <label htmlFor="currentRole" className="label">
          {t('questionnaire.currentRole')} <span className="text-danger text-xs">*</span>
        </label>
        <input
          id="currentRole"
          type="text"
          className="input-field"
          value={data.currentRole}
          onChange={(e) => update('currentRole', e.target.value)}
          placeholder="e.g., Technical Enablement Engineer"
        />
      </div>

      {/* Target Roles */}
      <div>
        <label htmlFor="targetRole" className="label">
          {t('questionnaire.targetRole')} <span className="text-danger text-xs">*</span>
        </label>
        <input
          id="targetRole"
          type="text"
          className="input-field"
          value={data.targetRole}
          onChange={(e) => update('targetRole', e.target.value)}
          placeholder="e.g., AI Solutions Architect"
        />
      </div>

      {/* Extra target roles */}
      {!showExtraRoles ? (
        <button
          type="button"
          onClick={() => setShowExtraRoles(true)}
          className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-primary transition-colors -mt-2 group"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:text-primary transition-colors">
            <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          {t('questionnaire.addAlternativeRoles')}
        </button>
      ) : (
        <div className="space-y-3 pl-4 border-l-2 border-primary/20">
          <p className="text-xs text-text-tertiary">
            {t('questionnaire.alternativeRolesHint')}
          </p>
          <div>
            <label htmlFor="targetRole2" className="label">
              {t('questionnaire.targetRole2Label')}
              <span className="text-text-tertiary font-normal ml-1">({t('common.optional')})</span>
            </label>
            <input
              id="targetRole2"
              type="text"
              className="input-field"
              value={data.targetRole2 || ''}
              onChange={(e) => update('targetRole2', e.target.value || undefined)}
              placeholder="e.g., Technical Enablement Manager"
            />
          </div>
          <div>
            <label htmlFor="targetRole3" className="label">
              {t('questionnaire.targetRole3Label')}
              <span className="text-text-tertiary font-normal ml-1">({t('common.optional')})</span>
            </label>
            <input
              id="targetRole3"
              type="text"
              className="input-field"
              value={data.targetRole3 || ''}
              onChange={(e) => update('targetRole3', e.target.value || undefined)}
              placeholder="e.g., AI Automation Consultant"
            />
          </div>
        </div>
      )}

      {/* Two-column row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="yearsExperience" className="label">
            {t('questionnaire.yearsExperience')} <span className="text-danger text-xs">*</span>
          </label>
          <input
            id="yearsExperience"
            type="number"
            min="0"
            max="50"
            className="input-field"
            value={data.yearsExperience || ''}
            onChange={(e) => update('yearsExperience', parseInt(e.target.value) || 0)}
            placeholder="14"
          />
        </div>
        <div>
          <label htmlFor="country" className="label">
            {t('questionnaire.country')} <span className="text-danger text-xs">*</span>
          </label>
          <select
            id="country"
            className="input-field"
            value={data.country}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">{t('questionnaire.selectCountry')}</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Preference */}
      <div>
        <label htmlFor="workPreference" className="label">
          {t('questionnaire.workPreference')} <span className="text-danger text-xs">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WORK_PREF_KEYS.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => update('workPreference', key)}
              className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-medium border transition-all duration-200 ${
                data.workPreference === key
                  ? 'border-primary/40 bg-primary/[0.08] text-primary'
                  : 'border-white/[0.06] bg-white/[0.02] text-text-tertiary hover:border-white/[0.12] hover:text-text-secondary'
              }`}
            >
              <span className={`transition-colors ${data.workPreference === key ? 'text-primary' : 'text-text-tertiary'}`}>
                {WORK_PREF_ICONS[key]}
              </span>
              {t(`questionnaire.workOptions.${key}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Salary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="currentSalary" className="label">
            {t('questionnaire.currentSalary')}
            <span className="text-text-tertiary font-normal ml-1">({t('common.optional')})</span>
          </label>
          <div className="relative">
            <input
              id="currentSalary"
              type="number"
              className="input-field pr-16"
              value={data.currentSalary || ''}
              onChange={(e) => update('currentSalary', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 55000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs font-semibold bg-white/[0.04] px-2 py-0.5 rounded-md">{currency.code}</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1.5">{t('questionnaire.grossAnnual')}</p>
        </div>
        <div>
          <label htmlFor="targetSalary" className="label">
            {t('questionnaire.targetSalary')}
            <span className="text-text-tertiary font-normal ml-1">({t('common.optional')})</span>
          </label>
          <div className="relative">
            <input
              id="targetSalary"
              type="number"
              className="input-field pr-16"
              value={data.targetSalary || ''}
              onChange={(e) => update('targetSalary', e.target.value ? parseInt(e.target.value) : undefined)}
              placeholder="e.g. 85000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary text-xs font-semibold bg-white/[0.04] px-2 py-0.5 rounded-md">{currency.code}</span>
          </div>
          <p className="text-[11px] text-text-tertiary mt-1.5">{t('questionnaire.grossAnnual')}</p>
        </div>
      </div>

      {data.workPreference === 'remote' && (
        <div className="bg-primary/[0.04] border border-primary/10 rounded-xl px-4 py-3">
          <p className="text-xs text-primary/80">
            {t('questionnaire.remoteSalaryNote', { country: data.country || 'market' })}
          </p>
        </div>
      )}

      {/* Job Posting — URL or Paste */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="label mb-0">
            {t('questionnaire.jobPostingLabel')}
            <span className="text-text-tertiary font-normal ml-1">({t('questionnaire.jobPostingOptional')})</span>
          </label>
        </div>

        {/* Toggle between URL and Paste */}
        <div className="flex items-center gap-1 mb-3 bg-white/[0.02] border border-white/[0.06] rounded-xl p-1 w-fit">
          <button
            type="button"
            onClick={() => setJobMode('url')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              jobMode === 'url'
                ? 'bg-white/[0.08] text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              {t('questionnaire.jobUrl.tabUrl')}
            </span>
          </button>
          <button
            type="button"
            onClick={() => setJobMode('paste')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 ${
              jobMode === 'paste'
                ? 'bg-white/[0.08] text-primary shadow-sm'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            <span className="flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
              </svg>
              {t('questionnaire.jobUrl.tabPaste')}
            </span>
          </button>
        </div>

        {jobMode === 'url' ? (
          <div>
            <div className="flex gap-2">
              <input
                type="url"
                className="input-field flex-1"
                value={jobUrlInput}
                onChange={(e) => {
                  setJobUrlInput(e.target.value);
                  setJobFetchError('');
                  setJobFetched(false);
                }}
                placeholder={t('questionnaire.jobUrl.placeholder')}
              />
              <button
                type="button"
                onClick={handleFetchJob}
                disabled={fetchingJob || !jobUrlInput.trim()}
                className="btn-primary text-sm px-4 flex items-center gap-1.5 whitespace-nowrap"
              >
                {fetchingJob ? (
                  <>
                    <svg className="animate-spin w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    {t('questionnaire.jobUrl.fetching')}
                  </>
                ) : (
                  <>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    {t('questionnaire.jobUrl.fetch')}
                  </>
                )}
              </button>
            </div>

            {jobFetchError && (
              <p className="text-xs text-danger mt-2 flex items-center gap-1.5">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" /></svg>
                {jobFetchError}
              </p>
            )}

            {jobFetched && data.jobPosting && (
              <div className="mt-2.5 bg-success/[0.04] border border-success/15 rounded-xl px-3.5 py-2.5 flex items-start gap-2">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <div className="min-w-0">
                  <p className="text-xs text-success font-medium">{t('questionnaire.jobUrl.fetchSuccess')}</p>
                  <p className="text-xs text-text-tertiary mt-0.5 line-clamp-2">{data.jobPosting.slice(0, 150)}...</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onChange({ ...data, jobPosting: undefined, jobPostingUrl: undefined });
                    setJobFetched(false);
                    setJobUrlInput('');
                  }}
                  className="text-text-tertiary hover:text-danger text-xs flex-shrink-0"
                >
                  {t('questionnaire.jobUrl.clear')}
                </button>
              </div>
            )}

            <p className="text-[11px] text-text-tertiary mt-1.5">{t('questionnaire.jobUrl.urlHint')}</p>
          </div>
        ) : (
          <div>
            <textarea
              id="jobPosting"
              className="input-field min-h-[120px] resize-y"
              value={data.jobPosting || ''}
              onChange={(e) => update('jobPosting', e.target.value)}
              placeholder={t('questionnaire.jobUrl.pastePlaceholder')}
            />
            <p className="text-[11px] text-text-tertiary mt-1.5">{t('questionnaire.jobUrl.pasteHint')}</p>
          </div>
        )}
      </div>
    </div>
  );
}