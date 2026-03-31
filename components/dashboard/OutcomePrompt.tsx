'use client';

import { useState, useEffect } from 'react';

interface OutcomePromptProps {
  analysisId: string;
  createdAt: string;
  accessToken?: string;
}

type OutcomeValue = 'got_interview' | 'got_offer' | 'still_applying' | 'moved_on';

const OPTIONS: { value: OutcomeValue; label: string; emoji: string }[] = [
  { value: 'got_offer',      label: 'Got an offer',       emoji: '🎉' },
  { value: 'got_interview',  label: 'Got an interview',   emoji: '📅' },
  { value: 'still_applying', label: 'Still applying',     emoji: '🔍' },
  { value: 'moved_on',       label: 'Moved on',           emoji: '↩️' },
];

const STORAGE_KEY = (id: string) => `outcome-${id}`;
const DAYS_THRESHOLD = 14;

export default function OutcomePrompt({ analysisId, createdAt, accessToken }: OutcomePromptProps) {
  const [status, setStatus] = useState<'hidden' | 'prompt' | 'submitting' | 'done'>('hidden');
  const [outcome, setOutcome] = useState<OutcomeValue | null>(null);

  useEffect(() => {
    // Don't show if less than DAYS_THRESHOLD days old
    const ageMs = Date.now() - new Date(createdAt).getTime();
    if (ageMs < DAYS_THRESHOLD * 24 * 60 * 60 * 1000) return;

    // Check local cache first (avoids a network call every render)
    const cached = localStorage.getItem(STORAGE_KEY(analysisId));
    if (cached) {
      setOutcome(cached as OutcomeValue);
      setStatus('done');
      return;
    }

    // Check Supabase for existing outcome
    fetch(`/api/feedback?analysisId=${analysisId}&section=outcome`)
      .then(r => r.json())
      .then(data => {
        if (data.exists) {
          setOutcome(data.outcome as OutcomeValue);
          setStatus('done');
          localStorage.setItem(STORAGE_KEY(analysisId), data.outcome);
        } else {
          setStatus('prompt');
        }
      })
      .catch(() => setStatus('prompt'));
  }, [analysisId, createdAt]);

  async function submit(value: OutcomeValue) {
    setStatus('submitting');
    setOutcome(value);

    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    await fetch('/api/feedback', {
      method: 'POST',
      headers,
      body: JSON.stringify({
        analysisId,
        section: 'outcome',
        rating: value === 'got_interview' || value === 'got_offer',
        comment: value,
      }),
    }).catch(() => {});

    localStorage.setItem(STORAGE_KEY(analysisId), value);
    setStatus('done');
  }

  if (status === 'hidden') return null;

  if (status === 'done' && outcome) {
    const opt = OPTIONS.find(o => o.value === outcome);
    return (
      <div className="mt-3 pt-3 border-t border-black/[0.06] flex items-center gap-1.5">
        <span className="text-[11px] text-text-tertiary">Outcome:</span>
        <span className="text-[11px] font-medium text-text-secondary">
          {opt?.emoji} {opt?.label ?? outcome}
        </span>
      </div>
    );
  }

  if (status === 'prompt' || status === 'submitting') {
    return (
      <div
        className="mt-3 pt-3 border-t border-black/[0.06]"
        onClick={e => e.stopPropagation()}
      >
        <p className="text-[11px] font-medium text-text-secondary mb-2">
          Did this analysis help you?
        </p>
        <div className="grid grid-cols-2 gap-1.5">
          {OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => submit(opt.value)}
              disabled={status === 'submitting'}
              className="text-[11px] font-medium px-2 py-1.5 rounded-lg border border-black/[0.08] bg-black/[0.02] hover:border-primary/20 hover:bg-primary/[0.04] hover:text-primary transition-all disabled:opacity-40 text-text-secondary text-left flex items-center gap-1"
            >
              <span>{opt.emoji}</span>
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
