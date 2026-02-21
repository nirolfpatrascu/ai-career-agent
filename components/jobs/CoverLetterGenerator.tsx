'use client';

import { useState, useCallback } from 'react';
import {
  X,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Save,
  Lightbulb,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Sparkles,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import type { UpworkJobPosting, UpworkProfile, UpworkCoverLetter } from '@/lib/types';

interface CoverLetterGeneratorProps {
  isOpen: boolean;
  onClose: () => void;
  jobPosting: UpworkJobPosting;
  profile?: UpworkProfile | null;
  cvText?: string;
  jobId?: string;
  onSaveDraft?: (coverLetter: UpworkCoverLetter) => Promise<void>;
  existingDraft?: UpworkCoverLetter | null;
}

type Tone = 'professional' | 'conversational' | 'bold';

function CopyButton({ text }: { text: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-primary transition-colors"
    >
      {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
      {copied ? t('upwork.coverLetter.copied') : t('upwork.coverLetter.copySection')}
    </button>
  );
}

export default function CoverLetterGenerator({
  isOpen,
  onClose,
  jobPosting,
  profile,
  cvText,
  onSaveDraft,
  existingDraft,
}: CoverLetterGeneratorProps) {
  const { t } = useTranslation();
  const [tone, setTone] = useState<Tone>('professional');
  const [generating, setGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<UpworkCoverLetter | null>(existingDraft || null);
  const [error, setError] = useState('');
  const [copiedFull, setCopiedFull] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [expandedStrategies, setExpandedStrategies] = useState<Record<number, boolean>>({});

  // Editable sections
  const [editingHook, setEditingHook] = useState('');
  const [editingBody, setEditingBody] = useState('');
  const [editingClosing, setEditingClosing] = useState('');
  const [editingAnswers, setEditingAnswers] = useState<Record<number, string>>({});

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobPosting,
          profile: profile || undefined,
          cvText: cvText || undefined,
          tone,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate cover letter');
      }
      const data = await res.json();
      setCoverLetter(data.coverLetter);
      setEditingHook(data.coverLetter.openingHook);
      setEditingBody(data.coverLetter.body);
      setEditingClosing(data.coverLetter.closingCta);
      const answers: Record<number, string> = {};
      data.coverLetter.screeningAnswers.forEach((a: { order: number; answer: string }) => {
        answers[a.order] = a.answer;
      });
      setEditingAnswers(answers);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setGenerating(false);
    }
  }, [jobPosting, profile, cvText, tone]);

  const assembleFullProposal = useCallback(() => {
    if (!coverLetter) return '';
    const parts: string[] = [editingHook || coverLetter.openingHook];
    const sortedAnswers = [...coverLetter.screeningAnswers].sort((a, b) => a.order - b.order);
    for (const sa of sortedAnswers) {
      const answer = editingAnswers[sa.order] || sa.answer;
      parts.push(`${sa.question}\n${answer}`);
    }
    parts.push(editingBody || coverLetter.body);
    parts.push(editingClosing || coverLetter.closingCta);
    return parts.join('\n\n');
  }, [coverLetter, editingHook, editingBody, editingClosing, editingAnswers]);

  const handleCopyFull = useCallback(() => {
    navigator.clipboard.writeText(assembleFullProposal());
    setCopiedFull(true);
    setTimeout(() => setCopiedFull(false), 2500);
  }, [assembleFullProposal]);

  const handleSaveDraft = useCallback(async () => {
    if (!coverLetter || !onSaveDraft) return;
    setSaving(true);
    try {
      await onSaveDraft(coverLetter);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      // handled by parent
    } finally {
      setSaving(false);
    }
  }, [coverLetter, onSaveDraft]);

  if (!isOpen) return null;

  const budgetDisplay = jobPosting.budget.type === 'fixed'
    ? `$${jobPosting.budget.min || '?'}${jobPosting.budget.max ? `-$${jobPosting.budget.max}` : ''} (${t('upwork.job.fixed')})`
    : `$${jobPosting.budget.min || '?'}-$${jobPosting.budget.max || '?'}/hr (${t('upwork.job.hourly')})`;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center"
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-2xl rounded-t-2xl border border-black/[0.08] shadow-xl max-h-[92vh] overflow-y-auto animate-slide-up"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-black/[0.06] px-6 py-4 flex items-center justify-between rounded-t-2xl z-10">
          <h2 className="text-lg font-bold text-text-primary font-display">
            {t('upwork.coverLetter.title')}
          </h2>
          <button
            onClick={onClose}
            className="text-text-tertiary hover:text-text-primary transition-colors p-1.5 rounded-lg hover:bg-black/[0.04]"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-5 space-y-5">
          {/* Job info card */}
          <div className="bg-black/[0.02] border border-black/[0.06] rounded-xl p-4">
            <p className="text-sm font-semibold text-text-primary">{jobPosting.title}</p>
            <div className="flex flex-wrap gap-3 text-xs text-text-tertiary mt-1.5">
              {jobPosting.clientInfo.country && (
                <span>{jobPosting.clientInfo.country}</span>
              )}
              {jobPosting.clientInfo.totalSpent && (
                <span>{jobPosting.clientInfo.totalSpent} spent</span>
              )}
              {jobPosting.clientInfo.rating != null && (
                <span>{jobPosting.clientInfo.rating}★</span>
              )}
              <span>{budgetDisplay}</span>
              {jobPosting.experienceLevel && (
                <span className="capitalize">{jobPosting.experienceLevel}</span>
              )}
            </div>
          </div>

          {/* Tone selector */}
          <div className="flex items-center gap-3">
            <label className="text-sm font-medium text-text-secondary">
              {t('upwork.coverLetter.tone')}:
            </label>
            <div className="flex gap-1.5">
              {(['professional', 'conversational', 'bold'] as Tone[]).map((t_) => (
                <button
                  key={t_}
                  onClick={() => setTone(t_)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    tone === t_
                      ? 'bg-[#14A800]/[0.08] text-[#14A800] border-[#14A800]/20'
                      : 'bg-white text-text-secondary border-black/[0.08] hover:bg-black/[0.02]'
                  }`}
                >
                  {t(`upwork.coverLetter.tone${t_.charAt(0).toUpperCase() + t_.slice(1)}`)}
                </button>
              ))}
            </div>
          </div>

          {/* Generate button */}
          {!coverLetter && !generating && (
            <button
              onClick={handleGenerate}
              disabled={generating}
              className="btn-primary text-sm !py-2.5 !px-5 !rounded-xl flex items-center gap-2 w-full justify-center"
              style={{ backgroundColor: '#14A800', borderColor: '#14A800' }}
            >
              <Sparkles size={16} />
              {t('upwork.coverLetter.generate')}
            </button>
          )}

          {/* Generating state */}
          {generating && (
            <div className="flex items-center justify-center gap-3 py-8 text-[#14A800]">
              <Loader2 size={20} className="animate-spin" />
              <span className="text-sm font-medium">{t('upwork.coverLetter.generating')}</span>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-danger/[0.06] border border-danger/20 rounded-xl p-3 text-sm text-danger">
              {error}
            </div>
          )}

          {/* Generated cover letter */}
          {coverLetter && !generating && (
            <div className="space-y-5">
              {/* Opening Hook */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    📋 {t('upwork.coverLetter.opening')}
                  </span>
                  <CopyButton text={editingHook || coverLetter.openingHook} />
                </div>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-[#14A800]/20 bg-[#14A800]/[0.03] text-sm text-text-primary outline-none focus:ring-2 focus:ring-[#14A800]/20 resize-y min-h-[70px]"
                  value={editingHook || coverLetter.openingHook}
                  onChange={(e) => setEditingHook(e.target.value)}
                />
              </div>

              {/* Screening Answers */}
              {coverLetter.screeningAnswers.length > 0 && (
                <div>
                  <span className="text-sm font-semibold text-text-primary mb-3 block">
                    ❓ {t('upwork.coverLetter.screeningAnswers')}
                  </span>
                  <div className="space-y-3">
                    {[...coverLetter.screeningAnswers]
                      .sort((a, b) => a.order - b.order)
                      .map((sa) => (
                        <div
                          key={sa.order}
                          className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4"
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-xs font-semibold text-text-secondary">
                              {t('upwork.coverLetter.question', { number: String(sa.order) }) || `Q${sa.order}`}: {sa.question}
                            </p>
                            <CopyButton text={editingAnswers[sa.order] || sa.answer} />
                          </div>
                          <textarea
                            className="w-full px-3 py-2 rounded-lg border border-black/[0.06] bg-white text-sm text-text-primary outline-none focus:ring-2 focus:ring-[#14A800]/20 resize-y min-h-[60px]"
                            value={editingAnswers[sa.order] || sa.answer}
                            onChange={(e) =>
                              setEditingAnswers((prev) => ({
                                ...prev,
                                [sa.order]: e.target.value,
                              }))
                            }
                          />
                          {/* Strategy note (collapsible) */}
                          <button
                            onClick={() =>
                              setExpandedStrategies((prev) => ({
                                ...prev,
                                [sa.order]: !prev[sa.order],
                              }))
                            }
                            className="flex items-center gap-1 text-xs text-text-tertiary hover:text-primary mt-2 transition-colors"
                          >
                            <Lightbulb size={12} />
                            {t('upwork.coverLetter.strategy')}
                            {expandedStrategies[sa.order] ? (
                              <ChevronUp size={12} />
                            ) : (
                              <ChevronDown size={12} />
                            )}
                          </button>
                          {expandedStrategies[sa.order] && (
                            <p className="text-xs text-text-tertiary mt-1.5 pl-4 border-l-2 border-[#14A800]/20 italic">
                              {sa.strategy}
                            </p>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}

              {/* Main Body */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    📝 {t('upwork.coverLetter.body')}
                  </span>
                  <CopyButton text={editingBody || coverLetter.body} />
                </div>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary outline-none focus:ring-2 focus:ring-[#14A800]/20 resize-y min-h-[140px]"
                  value={editingBody || coverLetter.body}
                  onChange={(e) => setEditingBody(e.target.value)}
                />
              </div>

              {/* Closing CTA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-text-primary">
                    🎯 {t('upwork.coverLetter.closing')}
                  </span>
                  <CopyButton text={editingClosing || coverLetter.closingCta} />
                </div>
                <textarea
                  className="w-full px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary outline-none focus:ring-2 focus:ring-[#14A800]/20 resize-y min-h-[60px]"
                  value={editingClosing || coverLetter.closingCta}
                  onChange={(e) => setEditingClosing(e.target.value)}
                />
              </div>

              {/* Rate Suggestion */}
              <div className="rounded-xl border border-[#14A800]/20 bg-[#14A800]/[0.04] p-4">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign size={16} className="text-[#14A800]" />
                  <span className="text-sm font-semibold text-[#14A800]">
                    {t('upwork.coverLetter.rateSuggestion')}
                  </span>
                </div>
                <p className="text-sm text-text-primary">
                  <span className="font-semibold">
                    ${coverLetter.suggestedRate.amount}{' '}
                    ({coverLetter.suggestedRate.type === 'fixed' ? t('upwork.job.fixed') : t('upwork.job.hourly')})
                  </span>
                </p>
                <p className="text-xs text-text-secondary mt-1">
                  {coverLetter.suggestedRate.reasoning}
                </p>
              </div>

              {/* Profile Tips */}
              {coverLetter.profileOptimization.length > 0 && (
                <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4">
                  <span className="text-sm font-semibold text-text-primary mb-2 block">
                    💡 {t('upwork.coverLetter.profileTips')}
                  </span>
                  <ul className="space-y-1.5">
                    {coverLetter.profileOptimization.map((tip, i) => (
                      <li key={i} className="text-xs text-text-secondary flex items-start gap-2">
                        <span className="text-[#14A800] mt-0.5">•</span>
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={handleCopyFull}
                  className="flex-1 btn-primary text-sm !py-2.5 !rounded-xl flex items-center justify-center gap-2"
                  style={{ backgroundColor: '#14A800', borderColor: '#14A800' }}
                >
                  {copiedFull ? (
                    <>
                      <Check size={16} />
                      {t('upwork.coverLetter.copied')}
                    </>
                  ) : (
                    <>
                      <Copy size={16} />
                      {t('upwork.coverLetter.copyFull')}
                    </>
                  )}
                </button>
                <button
                  onClick={handleGenerate}
                  className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all flex items-center gap-1.5"
                >
                  <RefreshCw size={14} />
                  {t('upwork.coverLetter.regenerate')}
                </button>
                {onSaveDraft && (
                  <button
                    onClick={handleSaveDraft}
                    disabled={saving}
                    className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all flex items-center gap-1.5"
                  >
                    <Save size={14} />
                    {saved ? t('upwork.coverLetter.saved') : saving ? '...' : t('upwork.coverLetter.saveDraft')}
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
