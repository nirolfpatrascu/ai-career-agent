'use client';

import { useState, useEffect, useCallback } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface FeedbackButtonProps {
  section: string;
  analysisId?: string;
  /** compact=true for inline per-item use inside cards */
  compact?: boolean;
}

interface FeedbackState {
  rating: boolean | null;
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

  const [rating, setRating] = useState<boolean | null>(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [sending, setSending] = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const [expanded, setExpanded] = useState(false);

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
    } catch { /* ignore */ }
  }, [storageKey]);

  const persistState = useCallback((r: boolean | null, s: boolean) => {
    try {
      sessionStorage.setItem(storageKey, JSON.stringify({ rating: r, submitted: s }));
    } catch { /* ignore */ }
  }, [storageKey]);

  const submitFeedback = useCallback((feedbackRating: boolean, feedbackComment?: string) => {
    fetch('/api/feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ analysisId, section, rating: feedbackRating, comment: feedbackComment || undefined }),
    }).catch((err) => console.error('[FeedbackButton] Failed:', err));
  }, [analysisId, section]);

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

  // Submitted state
  if (submitted && !showThanks) {
    return (
      <span className={`inline-flex items-center font-medium rounded-full border flex-shrink-0 ${
        compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      } ${rating === true
        ? 'text-success border-success/20 bg-success/[0.06]'
        : 'text-danger border-danger/20 bg-danger/[0.06]'
      }`}>
        {rating === true ? '👍' : '👎'}
        {!compact && ' Rated'}
      </span>
    );
  }

  // Thanks flash
  if (showThanks) {
    return (
      <span className={`inline-flex items-center font-medium text-success rounded-full border border-success/20 bg-success/[0.06] flex-shrink-0 animate-fade-in ${
        compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2 py-1'
      }`}>
        ✓ {compact ? '' : t('feedback.thankYou')}
      </span>
    );
  }

  return (
    <div className={`flex flex-col items-end gap-1.5 flex-shrink-0 ${compact ? '' : ''}`}>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className={`flex items-center gap-1 font-semibold text-danger rounded-full border border-danger/25 bg-danger/[0.06] hover:bg-danger/[0.10] transition-colors ${
            compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-3 py-1.5'
          }`}
        >
          {StarIcon}
          {compact ? 'Rate' : 'Rate this output'}
        </button>
      ) : (
        <div className="flex items-center gap-1 animate-fade-in flex-wrap">
          {!compact && <span className="text-xs text-text-tertiary">Helpful?</span>}
          <button
            onClick={handleThumbsUp}
            className={`flex items-center gap-1 font-medium rounded-lg border border-success/20 bg-success/[0.06] text-success hover:bg-success/[0.12] transition-colors ${
              compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1.5'
            }`}
          >
            <ThumbsUp size={compact ? 11 : 13} />
            {compact ? '👍' : 'Yes'}
          </button>
          <button
            onClick={handleThumbsDown}
            className={`flex items-center gap-1 font-medium rounded-lg border border-danger/20 bg-danger/[0.06] text-danger hover:bg-danger/[0.12] transition-colors ${
              compact ? 'text-[10px] px-1.5 py-0.5' : 'text-xs px-2.5 py-1.5'
            }`}
          >
            <ThumbsDown size={compact ? 11 : 13} />
            {compact ? '👎' : 'No'}
          </button>
          <button
            onClick={() => setExpanded(false)}
            className="p-0.5 text-text-tertiary hover:text-text-secondary transition-colors"
            aria-label="Close"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      )}

      {/* Comment input — only in full mode after thumbs down */}
      {!compact && showComment && !submitted && (
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
