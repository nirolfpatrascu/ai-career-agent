'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';

interface FeedbackButtonProps {
  section: string;
  analysisId?: string;
  /** compact=true for inline per-item use inside cards */
  compact?: boolean;
}

const ISSUE_OPTIONS = [
  'Inaccurate information',
  'Too generic / not personalized',
  'Missing important details',
  'Incorrect for my industry/role',
  'Looks great — no issues',
] as const;

type IssueOption = typeof ISSUE_OPTIONS[number];

interface FeedbackState {
  submitted: boolean;
}

const StarIcon = (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" stroke="none">
    <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
  </svg>
);

export function FeedbackButton({ section, analysisId, compact = false }: FeedbackButtonProps) {
  const { t } = useTranslation();
  const storageKey = `feedback-${section}`;
  const containerRef = useRef<HTMLDivElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<Set<IssueOption>>(new Set());
  const [comment, setComment] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed: FeedbackState = JSON.parse(stored);
        if (parsed.submitted) {
          setSubmitted(true);
        }
      }
    } catch { /* ignore */ }
  }, [storageKey]);

  const persistState = useCallback((s: boolean) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ submitted: s }));
    } catch { /* ignore */ }
  }, [storageKey]);

  // Close popover on outside click
  useEffect(() => {
    if (!open) return;
    function handleOutsideClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [open]);

  const toggleIssue = useCallback((issue: IssueOption) => {
    setSelectedIssues(prev => {
      const next = new Set(prev);
      if (next.has(issue)) {
        next.delete(issue);
      } else {
        // If selecting "Looks great", deselect all others
        if (issue === 'Looks great — no issues') {
          next.clear();
          next.add(issue);
        } else {
          // If selecting a problem, deselect "Looks great"
          next.delete('Looks great — no issues');
          next.add(issue);
        }
      }
      return next;
    });
  }, []);

  const flashThanks = useCallback(() => {
    setShowThanks(true);
    setOpen(false);
    setTimeout(() => setShowThanks(false), 2500);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (sending || submitted || selectedIssues.size === 0) return;
    setSending(true);

    const issuesArray = Array.from(selectedIssues);
    const rating = issuesArray.length === 1 && issuesArray[0] === 'Looks great — no issues';

    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        analysisId,
        section,
        rating,
        selectedIssues: issuesArray,
        comment: comment.trim() || undefined,
      }),
    }).catch((err) => console.error('[FeedbackButton] Failed:', err));

    setSubmitted(true);
    persistState(true);
    setSending(false);
    flashThanks();
  }, [sending, submitted, selectedIssues, analysisId, section, comment, persistState, flashThanks]);

  // Submitted state
  if (submitted && !showThanks) {
    return (
      <span className={`inline-flex items-center font-medium rounded-full border flex-shrink-0 text-success border-success/20 bg-success/[0.06] ${
        compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}>
        {compact ? '✓' : '✓ Rated'}
      </span>
    );
  }

  // Thanks flash
  if (showThanks) {
    return (
      <span className={`inline-flex items-center font-medium text-success rounded-full border border-success/20 bg-success/[0.06] flex-shrink-0 animate-fade-in ${
        compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}>
        {compact ? '✓' : `✓ ${t('feedback.thankYou')}`}
      </span>
    );
  }

  return (
    <div ref={containerRef} className="relative flex-shrink-0">
      {/* Trigger button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className={`flex items-center gap-1 font-semibold text-danger rounded-full border border-danger/25 bg-danger/[0.06] hover:bg-danger/[0.10] transition-colors ${
          compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-3 py-1.5'
        }`}
        aria-label="Rate this output"
      >
        {StarIcon}
        {compact ? 'Rate' : 'Rate this output'}
      </button>

      {/* Popover */}
      {open && (
        <div className="absolute right-0 top-full mt-2 z-50 w-72 rounded-2xl border border-black/[0.10] bg-white shadow-lg p-4 animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold text-text-primary">What was the issue?</p>
            <button
              onClick={() => setOpen(false)}
              className="p-0.5 text-text-tertiary hover:text-text-secondary transition-colors"
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>

          {/* Issue checkboxes */}
          <div className="space-y-2 mb-3">
            {ISSUE_OPTIONS.map((issue) => {
              const isChecked = selectedIssues.has(issue);
              const isPositive = issue === 'Looks great — no issues';
              return (
                <label
                  key={issue}
                  className={`flex items-center gap-2.5 cursor-pointer rounded-xl px-3 py-2.5 border transition-colors ${
                    isChecked
                      ? isPositive
                        ? 'border-success/25 bg-success/[0.06]'
                        : 'border-primary/25 bg-primary/[0.06]'
                      : 'border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.04]'
                  }`}
                >
                  <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isChecked
                      ? isPositive ? 'bg-success border-success' : 'bg-primary border-primary'
                      : 'border-black/20'
                  }`}>
                    {isChecked && (
                      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </div>
                  <span className={`text-xs leading-snug ${
                    isChecked
                      ? isPositive ? 'text-success font-medium' : 'text-primary font-medium'
                      : 'text-text-secondary'
                  }`}>
                    {issue}
                  </span>
                  <input
                    type="checkbox"
                    className="sr-only"
                    checked={isChecked}
                    onChange={() => toggleIssue(issue)}
                  />
                </label>
              );
            })}
          </div>

          {/* Optional comment */}
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 300))}
            placeholder="Add details (optional)"
            maxLength={300}
            rows={2}
            className="w-full text-xs border border-black/[0.1] rounded-xl px-3 py-2 bg-black/[0.02] focus:outline-none focus:ring-1 focus:ring-primary/30 text-text-primary placeholder:text-text-tertiary resize-none mb-3"
          />

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={sending || selectedIssues.size === 0}
            className="w-full text-xs font-semibold px-3 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {sending ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      )}
    </div>
  );
}
