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

  // Restore from sessionStorage on mount
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem(storageKey);
      if (stored) {
        const parsed: FeedbackState = JSON.parse(stored);
        if (parsed.rating !== null) {
          setRating(parsed.rating);
          setSubmitted(parsed.submitted);
          if (parsed.submitted) {
            setShowThanks(false); // Already submitted before, don't flash again
          }
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
    setTimeout(() => setShowThanks(false), 2000);
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

  return (
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <div className="flex items-center gap-1">
        {/* Thumbs Up */}
        <button
          onClick={handleThumbsUp}
          disabled={submitted}
          className={`p-1 rounded-md transition-colors duration-150 ${
            rating === true
              ? 'text-green-500'
              : submitted
                ? 'text-gray-300 cursor-default'
                : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Helpful"
          title="Helpful"
        >
          <ThumbsUp size={16} />
        </button>

        {/* Thumbs Down */}
        <button
          onClick={handleThumbsDown}
          disabled={submitted}
          className={`p-1 rounded-md transition-colors duration-150 ${
            rating === false
              ? 'text-red-500'
              : submitted
                ? 'text-gray-300 cursor-default'
                : 'text-gray-400 hover:text-gray-600'
          }`}
          aria-label="Not helpful"
          title="Not helpful"
        >
          <ThumbsDown size={16} />
        </button>

        {/* Thanks message */}
        {showThanks && (
          <span className="text-xs text-green-600 font-medium ml-1 animate-fade-in">
            {t('feedback.thankYou')}
          </span>
        )}
      </div>

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
