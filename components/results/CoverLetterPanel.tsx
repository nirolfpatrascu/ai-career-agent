'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';
import type { AnalysisResult } from '@/lib/types';
import type { CoverLetter } from '@/lib/prompts/cover-letter';

interface CoverLetterPanelProps {
  analysis: AnalysisResult;
}

export default function CoverLetterPanel({ analysis }: CoverLetterPanelProps) {
  const { t, locale } = useTranslation();
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [editedContent, setEditedContent] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const hasUserEdited = useRef(false);

  const jobPosting = analysis.metadata.jobPosting;

  const assembleLetter = useCallback((cl: CoverLetter): string => {
    return [
      cl.greeting,
      cl.openingParagraph,
      ...cl.bodyParagraphs,
      cl.closingParagraph,
      cl.signature,
    ].filter(Boolean).join('\n\n');
  }, []);

  // Auto-populate from pipeline-generated cover letter (and re-populate on translation)
  useEffect(() => {
    if (analysis.coverLetter && !hasUserEdited.current) {
      setCoverLetter(analysis.coverLetter);
      setEditedContent(assembleLetter(analysis.coverLetter));
    }
  }, [analysis.coverLetter, assembleLetter]);

  const handleGenerate = useCallback(async () => {
    if (!jobPosting) return;
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ analysis, jobPosting, tone: 'professional', language: locale }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to generate cover letter');
      }
      const data = await res.json();
      setCoverLetter(data.coverLetter);
      setEditedContent(assembleLetter(data.coverLetter));
      hasUserEdited.current = false;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }, [analysis, jobPosting, locale, assembleLetter]);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  }, [editedContent]);

  // No job posting — empty state
  if (!jobPosting) {
    return (
      <div className="text-center py-16 px-6">
        <div className="w-16 h-16 rounded-2xl bg-black/[0.04] border border-black/[0.08] flex items-center justify-center mx-auto mb-4">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-2">{t('coverLetter.title') || 'Cover Letter'}</h3>
        <p className="text-sm text-text-tertiary max-w-md mx-auto">
          {t('coverLetter.noJobPosting') || 'Add a job posting in the wizard to generate a tailored cover letter.'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/[0.08] border border-primary/15 flex items-center justify-center text-primary">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>
            </svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">{t('coverLetter.title') || 'Cover Letter'}</h2>
            <p className="text-sm text-text-tertiary">{t('coverLetter.subtitle') || 'AI-generated, tailored to the job posting'}</p>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-danger/[0.06] border border-danger/15 rounded-xl text-sm text-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      {/* Generate button or loading */}
      {!coverLetter && !generating && (
        <button
          onClick={handleGenerate}
          className="btn-primary w-full py-4 text-base font-semibold flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          {t('coverLetter.generate') || 'Generate Cover Letter'}
        </button>
      )}

      {generating && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-tertiary">{t('coverLetter.generating') || 'Generating your cover letter...'}</p>
        </div>
      )}

      {/* Generated letter */}
      {coverLetter && !generating && (
        <>
          {/* Editable textarea */}
          <div>
            <p className="text-xs text-text-tertiary mb-2">{t('coverLetter.editHint') || 'Edit the letter below to personalize it further'}</p>
            <textarea
              value={editedContent}
              onChange={(e) => { setEditedContent(e.target.value); hasUserEdited.current = true; }}
              className="w-full min-h-[400px] p-5 rounded-2xl border border-black/[0.08] bg-white text-sm text-text-primary leading-relaxed resize-y focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/30"
            />
            <div className="flex justify-end mt-2">
              <FeedbackButton compact section="coverLetter-content" />
            </div>
          </div>

          {/* Action bar */}
          <div className="flex items-center gap-3">
            <button onClick={handleCopy} className="btn-primary flex items-center gap-2">
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                  {t('coverLetter.copied') || 'Copied!'}
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
                  {t('coverLetter.copy') || 'Copy to Clipboard'}
                </>
              )}
            </button>
            <button onClick={handleGenerate} className="btn-secondary flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/>
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              {t('coverLetter.regenerate') || 'Regenerate'}
            </button>
          </div>

          {/* Insights: strengths highlighted + gaps addressed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {coverLetter.strengthHighlights?.length > 0 && (
              <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-3">{t('coverLetter.strengthsHighlighted') || 'Strengths Highlighted'}</h4>
                <div className="flex flex-wrap gap-2">
                  {coverLetter.strengthHighlights.map((s, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-success/[0.08] border border-success/15 text-success font-medium">
                      {s}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end mt-3 pt-2.5 border-t border-black/[0.06]">
                  <FeedbackButton compact section="coverLetter-strengths" />
                </div>
              </div>
            )}
            {coverLetter.weaknessAcknowledgments?.length > 0 && (
              <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
                <h4 className="text-sm font-semibold text-text-primary mb-3">{t('coverLetter.gapsAddressed') || 'Gaps Addressed'}</h4>
                <div className="flex flex-wrap gap-2">
                  {coverLetter.weaknessAcknowledgments.map((g, i) => (
                    <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-warning/[0.08] border border-warning/15 text-warning font-medium">
                      {g}
                    </span>
                  ))}
                </div>
                <div className="flex justify-end mt-3 pt-2.5 border-t border-black/[0.06]">
                  <FeedbackButton compact section="coverLetter-gaps" />
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
