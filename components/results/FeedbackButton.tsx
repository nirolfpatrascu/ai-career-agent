'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface FeedbackButtonProps {
  section: string;
  analysisId?: string;
}

interface FeedbackState {
  rating: boolean | null;
  submitted: boolean;
}

export function FeedbackButton({ section, analysisId }: FeedbackButtonProps) {
  const { t } = useTranslation();
  const storageKey = `feedback-${section}`;

  const [rating, setRating] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [sending, setSending] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed: FeedbackState = JSON.parse(stored);
        if (parsed.rating !== null) {
          setRating(parsed.rating);
          setSubmitted(parsed.submitted);
        }
      }
    } catch {
      // Ignore sessionStorage errors (private browsing, etc.)
    }
  }, [storageKey]);

  // Persist to sessionStorage
  const persistState = useCallback(
    (r: boolean | null, s: boolean) => {
      try {
        sessionStorage.setItem(
          storageKey,
          JSON.stringify({ rating: r, submitted: s })
        );
      } catch {
        // Ignore
      }
    },
    [storageKey]
  );

  // Fire-and-forget API call
  const submitFeedback = useCallback(
    (feedbackRating: boolean, feedbackComment?: string) => {
      fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          analysisId,
          section,
          rating: feedbackRating,
          comment: feedbackComment || undefined,
        }),
      }).catch((err) => {
        console.error('[FeedbackButton] Failed to submit feedback:', err);
      });
    },
    [analysisId, section]
  );

  const flashThanks = useCallback(() => {
    setShowThanks(true);
    setExpanded(false);
    setTimeout(() => setShowThanks(false), 2500);
  }, []);

  const handleThumbsUp = () => {
    if (submitted) return;
    setRating(true);
    setShowComment(false);
    setSubmitted(true);
    persistState(true, true);
    submitFeedback(true);
    flashThanks();
  };

  const handleThumbsDown = () => {
    if (submitted) return;
    setRating(false);
    setShowComment(true);
  };

  const handleSendComment = () => {
    if (sending || submitted) return;
    setSending(true);
    setSubmitted(true);
    persistState(false, true);
    submitFeedback(false, comment);
    setShowComment(false);
    setSending(false);
    flashThanks();
  };

  // Already submitted — show compact state
  if (submitted && !showThanks) {
    return (
      <div className="flex items-center gap-1.5 flex-shrink-0">
        <span className={`text-xs font-medium px-2 py-1 rounded-full border ${
          rating === true
            ? 'text-success border-success/20 bg-success/[0.06]'
            : 'text-danger border-danger/20 bg-danger/[0.06]'
        }`}>
          {rating === true ? '👍 Rated' : '👎 Rated'}
        </span>
      </div>
    );
  }

  // Thank you flash
  if (showThanks) {
    return (
      <div className="flex items-center flex-shrink-0">
        <span className="text-xs font-medium text-success px-2 py-1 rounded-full border border-success/20 bg-success/[0.06] animate-fade-in">
          ✓ {t('feedback.thankYou')}
        </span>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
      {!expanded ? (
        // Always-visible CTA button
        <button
          onClick={() => setExpanded(true)}
          className="flex items-center gap-1.5 text-xs font-semibold text-danger px-3 py-1.5 rounded-full border border-danger/25 bg-danger/[0.06] hover:bg-danger/[0.10] transition-colors"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"/>
          </svg>
          Rate this output
        </button>
      ) : (
        // Expanded rating options
        <div className="flex items-center gap-1.5 animate-fade-in">
          <span className="text-xs text-text-tertiary mr-0.5">Helpful?</span>
          <button
            onClick={handleThumbsUp}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-success/20 bg-success/[0.06] text-success hover:bg-success/[0.12] transition-colors"
          >
            <ThumbsUp size={13} />
            Yes
          </button>
          <button
            onClick={handleThumbsDown}
            className="flex items-center gap-1 text-xs font-medium px-2.5 py-1.5 rounded-lg border border-danger/20 bg-danger/[0.06] text-danger hover:bg-danger/[0.12] transition-colors"
          >
            <ThumbsDown size={13} />
            No
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="p-1 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Close"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Comment input (after thumbs down) */}
      {showComment && !submitted && (
        <div className="flex items-center gap-2 mt-1 animate-fade-in">
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value.slice(0, 200))}
            placeholder={t('feedback.placeholder')}
            maxLength={200}
            className="text-xs border border-black/[0.1] rounded-lg px-2.5 py-1.5 w-48 sm:w-56 bg-black/[0.02] focus:outline-none focus:ring-1 focus:ring-primary/30 text-text-primary placeholder:text-text-tertiary"
          />
          <button
            onClick={handleSendComment}
            disabled={sending}
            className="text-xs font-medium px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {t('feedback.send')}
          </button>
        </div>
      )}
    </div>
  );
}
