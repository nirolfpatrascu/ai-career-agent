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

  // Idle — "View open roles" trigger only (no static company badges)
  if (state === 'idle') {
    return (
      <button
        onClick={load}
        className="w-full flex items-center justify-center gap-2 border-2 border-[#E8890A]/60 rounded-xl p-3 text-sm font-semibold text-[#E8890A] hover:border-[#E8890A] hover:bg-[#E8890A]/[0.04] transition-all duration-200 group"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        View open roles
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="transition-transform group-hover:translate-x-0.5">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
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

  // Error — show error message only
  if (state === 'error') {
    return (
      <div>
        {errorMsg && (
          <p className="text-[11px] text-danger font-mono">{errorMsg}</p>
        )}
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
