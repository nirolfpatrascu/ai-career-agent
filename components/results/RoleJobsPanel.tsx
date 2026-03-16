'use client';

import { useState } from 'react';

interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  url: string;
  currency: string;
  salaryMin?: number;
  salaryMax?: number;
}

interface Props {
  roleTitle: string;
  country: string;
  fallbackCompanies: string[];
}

function formatSalary(value: number, currency: string): string {
  return new Intl.NumberFormat('en', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
    notation: value >= 100_000 ? 'compact' : 'standard',
  }).format(value);
}

export default function RoleJobsPanel({ roleTitle, country, fallbackCompanies }: Props) {
  const [state, setState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [jobs, setJobs] = useState<JobListing[]>([]);
  const [currency, setCurrency] = useState('GBP');
  const [errorMsg, setErrorMsg] = useState('');

  async function load() {
    if (state === 'loading' || state === 'loaded') return;
    setState('loading');
    try {
      const res = await fetch(
        `/api/job-listings?role=${encodeURIComponent(roleTitle)}&country=${encodeURIComponent(country)}`
      );
      const data = await res.json();
      if (!res.ok || !Array.isArray(data.jobs)) throw new Error(data.error || `HTTP ${res.status}`);
      setJobs(data.jobs);
      setCurrency(data.currency ?? 'GBP');
      setState('loaded');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Unknown error';
      console.error('[RoleJobsPanel] fetch failed:', msg);
      setErrorMsg(msg);
      setState('error');
    }
  }

  // Idle — static fallback badges + "View open roles" trigger
  if (state === 'idle') {
    return (
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider">
            Companies Hiring
          </p>
          <button
            onClick={load}
            className="flex items-center gap-1 text-[11px] font-medium text-primary hover:text-primary/70 transition-colors"
          >
            View open roles
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {fallbackCompanies.map((c, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.04] border border-black/[0.08] text-text-secondary">
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Loading skeleton
  if (state === 'loading') {
    return (
      <div>
        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Loading open roles…
        </p>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-[58px] rounded-xl bg-black/[0.04] animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  // Error — fall back to static badges, show error for debugging
  if (state === 'error') {
    return (
      <div>
        <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
          Companies Hiring
        </p>
        {errorMsg && (
          <p className="text-[11px] text-danger mb-2 font-mono">{errorMsg}</p>
        )}
        <div className="flex flex-wrap gap-1.5">
          {fallbackCompanies.map((c, i) => (
            <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-black/[0.04] border border-black/[0.08] text-text-secondary">
              {c}
            </span>
          ))}
        </div>
      </div>
    );
  }

  // Loaded — live job listings
  return (
    <div>
      <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">
        Open Roles
      </p>
      {jobs.length === 0 ? (
        <p className="text-xs text-text-tertiary">No listings found right now.</p>
      ) : (
        <div className="space-y-2">
          {jobs.map((job) => (
            <a
              key={job.id}
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-start justify-between gap-2 rounded-xl border border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.05] hover:border-primary/20 p-3 transition-all group"
            >
              <div className="min-w-0">
                <p className="text-xs font-semibold text-text-primary truncate">{job.company}</p>
                <p className="text-xs text-text-secondary truncate mt-0.5">{job.title}</p>
                <p className="text-[11px] text-text-tertiary mt-0.5">{job.location}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                {job.salaryMin != null && job.salaryMax != null && (
                  <p className="text-[11px] font-medium text-success whitespace-nowrap">
                    {formatSalary(job.salaryMin, currency)}–{formatSalary(job.salaryMax, currency)}
                  </p>
                )}
                <svg
                  width="12" height="12" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  className="text-text-tertiary group-hover:text-primary transition-colors mt-0.5"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
