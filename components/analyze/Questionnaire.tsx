'use client';

import { useMemo } from 'react';
import type { CareerQuestionnaire } from '@/lib/types';
import { COUNTRIES, COUNTRY_CURRENCY, WORK_PREFERENCES } from '@/lib/utils';

interface QuestionnaireProps {
  data: CareerQuestionnaire;
  onChange: (data: CareerQuestionnaire) => void;
}

export default function Questionnaire({ data, onChange }: QuestionnaireProps) {
  const update = (field: keyof CareerQuestionnaire, value: string | number | undefined) => {
    onChange({ ...data, [field]: value });
  };

  const currency = useMemo(() => {
    return COUNTRY_CURRENCY[data.country] || { code: 'EUR', symbol: 'EUR' };
  }, [data.country]);

  return (
    <div className="space-y-5">
      {/* Current Role */}
      <div>
        <label htmlFor="currentRole" className="label">
          Current Role Title <span className="text-danger">*</span>
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

      {/* Target Role */}
      <div>
        <label htmlFor="targetRole" className="label">
          Target Role / Career Goal <span className="text-danger">*</span>
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

      {/* Two-column row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Years of Experience */}
        <div>
          <label htmlFor="yearsExperience" className="label">
            Years of Experience <span className="text-danger">*</span>
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

        {/* Country */}
        <div>
          <label htmlFor="country" className="label">
            Country / Region <span className="text-danger">*</span>
          </label>
          <select
            id="country"
            className="input-field"
            value={data.country}
            onChange={(e) => update('country', e.target.value)}
          >
            <option value="">Select country...</option>
            {COUNTRIES.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Work Preference */}
      <div>
        <label htmlFor="workPreference" className="label">
          Work Preference <span className="text-danger">*</span>
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {WORK_PREFERENCES.map((pref) => (
            <button
              key={pref.value}
              type="button"
              onClick={() => update('workPreference', pref.value)}
              className={`px-4 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${
                data.workPreference === pref.value
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-card-border bg-background text-text-secondary hover:border-primary/50 hover:text-text-primary'
              }`}
            >
              {pref.label}
            </button>
          ))}
        </div>
      </div>

      {/* Salary row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="currentSalary" className="label">
            Current Gross Annual Salary
            <span className="text-text-secondary font-normal ml-1">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="currentSalary"
              type="number"
              className="input-field pr-16"
              value={data.currentSalary || ''}
              onChange={(e) =>
                update('currentSalary', e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="e.g. 55000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
              {currency.code}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Gross annual (before tax)</p>
        </div>

        <div>
          <label htmlFor="targetSalary" className="label">
            Target Gross Annual Salary
            <span className="text-text-secondary font-normal ml-1">(optional)</span>
          </label>
          <div className="relative">
            <input
              id="targetSalary"
              type="number"
              className="input-field pr-16"
              value={data.targetSalary || ''}
              onChange={(e) =>
                update('targetSalary', e.target.value ? parseInt(e.target.value) : undefined)
              }
              placeholder="e.g. 85000"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary text-sm font-medium">
              {currency.code}
            </span>
          </div>
          <p className="text-xs text-text-secondary mt-1">Gross annual (before tax)</p>
        </div>
      </div>

      {data.workPreference === 'remote' && (
        <div className="bg-primary/5 border border-primary/10 rounded-lg px-4 py-3">
          <p className="text-xs text-primary">
            Since you selected Remote, salary benchmarks will reflect EMEA/EU remote market
            rates for your target role — not just local {data.country || 'market'} rates.
          </p>
        </div>
      )}

      {/* Job Posting */}
      <div>
        <label htmlFor="jobPosting" className="label">
          Job Posting
          <span className="text-text-secondary font-normal ml-1">
            (optional — paste a specific posting for targeted advice)
          </span>
        </label>
        <textarea
          id="jobPosting"
          className="input-field min-h-[120px] resize-y"
          value={data.jobPosting || ''}
          onChange={(e) => update('jobPosting', e.target.value)}
          placeholder="Paste the full job posting text here to get ATS match score, missing keywords, and CV rewrite suggestions..."
        />
      </div>
    </div>
  );
}
