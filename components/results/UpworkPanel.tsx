'use client';

import { useState, useCallback } from 'react';
import {
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  TrendingDown,
  Zap,
  Target,
  DollarSign,
  Lightbulb,
  Users,
  Star,
  Loader2,
} from 'lucide-react';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';
import type { UpworkProfile, UpworkProfileAnalysis } from '@/lib/types';

interface UpworkPanelProps {
  profile: UpworkProfile;
  analysis: UpworkProfileAnalysis | null;
  onAnalyze: (targetNiche?: string) => Promise<void>;
  analyzing?: boolean;
}

function CopyBlock({ text, label }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);
  return (
    <div className="relative group">
      <div className="bg-black/[0.02] border border-black/[0.06] rounded-xl p-4 text-sm text-text-secondary leading-relaxed whitespace-pre-line">
        {label && <p className="text-xs text-text-tertiary mb-1.5 font-medium">{label}</p>}
        {text}
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 flex items-center gap-1 text-xs font-medium text-text-tertiary hover:text-primary transition-colors bg-white/80 px-2 py-1 rounded-md border border-black/[0.06]"
      >
        {copied ? <Check size={12} className="text-success" /> : <Copy size={12} />}
        {copied ? 'Copied!' : 'Copy'}
      </button>
    </div>
  );
}

const PRIORITY_COLORS = {
  critical: 'bg-danger/[0.08] text-danger border-danger/15',
  high: 'bg-warning/[0.08] text-warning border-warning/15',
  medium: 'bg-primary/[0.08] text-primary border-primary/15',
};

export default function UpworkPanel({
  profile,
  analysis,
  onAnalyze,
  analyzing = false,
}: UpworkPanelProps) {
  const { t } = useTranslation();
  const [targetNiche, setTargetNiche] = useState('');
  const [showFullOverview, setShowFullOverview] = useState(false);

  if (!analysis) {
    return (
      <section className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-xl bg-[#14A800]/10 border border-[#14A800]/20 flex items-center justify-center">
            <Zap size={16} className="text-[#14A800]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">
              {t('upwork.analysis.title')}
            </h2>
            <p className="text-xs text-text-tertiary">
              {profile.name} · {profile.title}
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-black/[0.08] bg-white p-6 text-center space-y-4">
          <p className="text-sm text-text-secondary">
            Analyze your Upwork profile to get optimization recommendations.
          </p>
          <input
            type="text"
            className="w-full max-w-md mx-auto px-4 py-3 rounded-xl border border-black/[0.08] bg-white text-sm text-text-primary focus:ring-2 focus:ring-[#14A800]/20 focus:border-[#14A800]/40 outline-none transition-all"
            value={targetNiche}
            onChange={(e) => setTargetNiche(e.target.value)}
            placeholder="Target niche (optional, e.g. 'AI Automation')"
          />
          <button
            onClick={() => onAnalyze(targetNiche || undefined)}
            disabled={analyzing}
            className="btn-primary text-sm !py-2.5 !px-6 !rounded-xl flex items-center gap-2 mx-auto"
            style={{ backgroundColor: '#14A800', borderColor: '#14A800' }}
          >
            {analyzing ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap size={16} />
                Analyze Profile
              </>
            )}
          </button>
        </div>
      </section>
    );
  }

  const scoreColor =
    analysis.overallScore >= 8 ? '#22C55E' :
    analysis.overallScore >= 6 ? '#F59E0B' :
    analysis.overallScore >= 4 ? '#E8890A' : '#EF4444';

  return (
    <section className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#14A800]/10 border border-[#14A800]/20 flex items-center justify-center">
            <Zap size={16} className="text-[#14A800]" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">
              {t('upwork.analysis.title')}
            </h2>
            <p className="text-xs text-text-tertiary">{profile.name}</p>
          </div>
        </div>
        <FeedbackButton section="upwork" />
      </div>

      {/* Profile Score */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6 flex items-center gap-6">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center border-4"
          style={{ borderColor: scoreColor }}
        >
          <span className="text-2xl font-bold" style={{ color: scoreColor }}>
            {analysis.overallScore}
          </span>
        </div>
        <div>
          <h3 className="font-bold text-text-primary text-lg">
            {t('upwork.analysis.score')}
          </h3>
          <p className="text-sm text-text-secondary">
            {analysis.overallScore >= 8 ? 'Strong, competitive profile' :
             analysis.overallScore >= 6 ? 'Decent but room for improvement' :
             analysis.overallScore >= 4 ? 'Below average, needs work' :
             'Major issues to address'}
          </p>
        </div>
      </div>

      {/* Title Optimization */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
          <Target size={16} className="text-primary" />
          {t('upwork.analysis.titleOpt')}
        </h3>
        <div className="space-y-3">
          <div className="rounded-xl border border-danger/15 bg-danger/[0.04] p-3">
            <p className="text-xs text-text-tertiary mb-1">{t('upwork.analysis.titleCurrent')}</p>
            <p className="text-sm text-text-primary">{analysis.titleOptimization.current}</p>
          </div>
          <div className="rounded-xl border border-success/15 bg-success/[0.04] p-3">
            <p className="text-xs text-text-tertiary mb-1">{t('upwork.analysis.titleSuggested')}</p>
            <p className="text-sm text-text-primary font-medium">{analysis.titleOptimization.suggested}</p>
          </div>
          <p className="text-xs text-text-secondary">{analysis.titleOptimization.reasoning}</p>
        </div>
      </div>

      {/* Overview Rewrite */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
          <Star size={16} className="text-primary" />
          {t('upwork.analysis.overviewOpt')}
        </h3>
        <div className="space-y-3">
          <div>
            <button
              onClick={() => setShowFullOverview(!showFullOverview)}
              className="flex items-center gap-1 text-xs text-text-tertiary hover:text-primary mb-1"
            >
              {t('upwork.analysis.overviewCurrent')}
              {showFullOverview ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            </button>
            {showFullOverview && (
              <div className="rounded-xl border border-black/[0.06] bg-black/[0.02] p-3 text-xs text-text-secondary whitespace-pre-line">
                {analysis.overviewRewrite.current}
              </div>
            )}
          </div>
          <CopyBlock
            text={analysis.overviewRewrite.suggested}
            label={t('upwork.analysis.overviewSuggested')}
          />
          <p className="text-xs text-text-secondary">{analysis.overviewRewrite.reasoning}</p>
        </div>
      </div>

      {/* Rate Advice */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
          <DollarSign size={16} className="text-[#14A800]" />
          {t('upwork.analysis.rateAdvice')}
        </h3>
        <div className="flex items-center gap-4 mb-3">
          <div className="rounded-xl bg-[#14A800]/[0.06] border border-[#14A800]/15 px-4 py-3 text-center">
            <p className="text-xs text-text-tertiary mb-0.5">{t('upwork.analysis.suggestedRange')}</p>
            <p className="text-lg font-bold text-[#14A800]">
              ${analysis.rateAdvice.suggestedRange.min} - ${analysis.rateAdvice.suggestedRange.max}/hr
            </p>
          </div>
          {analysis.rateAdvice.currentRate != null && (
            <div className="rounded-xl bg-black/[0.03] border border-black/[0.06] px-4 py-3 text-center">
              <p className="text-xs text-text-tertiary mb-0.5">Current</p>
              <p className="text-lg font-bold text-text-primary">${analysis.rateAdvice.currentRate}/hr</p>
            </div>
          )}
        </div>
        <p className="text-sm text-text-secondary">{analysis.rateAdvice.reasoning}</p>
        <p className="text-xs text-text-tertiary mt-2">{analysis.rateAdvice.positioningStrategy}</p>
      </div>

      {/* Skills Optimization */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-4">
          {t('upwork.analysis.skills')}
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {analysis.skillsAdvice.keep.length > 0 && (
            <div>
              <p className="text-xs font-medium text-success mb-2">{t('upwork.analysis.skillsKeep')}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillsAdvice.keep.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-success/[0.08] text-success border border-success/15">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.skillsAdvice.add.length > 0 && (
            <div>
              <p className="text-xs font-medium text-blue-600 mb-2">{t('upwork.analysis.skillsAdd')}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillsAdvice.add.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-blue-50 text-blue-600 border border-blue-200">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.skillsAdvice.remove.length > 0 && (
            <div>
              <p className="text-xs font-medium text-danger mb-2">{t('upwork.analysis.skillsRemove')}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillsAdvice.remove.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-danger/[0.08] text-danger border border-danger/15 line-through">{s}</span>
                ))}
              </div>
            </div>
          )}
          {analysis.skillsAdvice.reorder.length > 0 && (
            <div>
              <p className="text-xs font-medium text-primary mb-2">{t('upwork.analysis.skillsReorder')}</p>
              <div className="flex flex-wrap gap-1.5">
                {analysis.skillsAdvice.reorder.map((s) => (
                  <span key={s} className="px-2 py-0.5 text-xs rounded-md bg-primary/[0.08] text-primary border border-primary/15">{s}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Strengths */}
      {analysis.profileStrengths.length > 0 && (
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingUp size={16} className="text-success" />
            {t('upwork.analysis.strengths')}
          </h3>
          <div className="space-y-3">
            {analysis.profileStrengths.map((s, i) => (
              <div key={i} className="rounded-xl border border-success/15 bg-success/[0.03] p-4">
                <p className="text-sm font-semibold text-text-primary">{s.area}</p>
                <p className="text-xs text-text-secondary mt-1">{s.description}</p>
                <p className="text-xs text-success mt-1 font-medium">{s.impact}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weaknesses */}
      {analysis.profileWeaknesses.length > 0 && (
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
          <h3 className="font-bold text-text-primary mb-4 flex items-center gap-2">
            <TrendingDown size={16} className="text-danger" />
            {t('upwork.analysis.weaknesses')}
          </h3>
          <div className="space-y-3">
            {analysis.profileWeaknesses.map((w, i) => (
              <div key={i} className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-semibold text-text-primary">{w.area}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${PRIORITY_COLORS[w.priority]}`}>
                    {w.priority}
                  </span>
                </div>
                <p className="text-xs text-text-secondary">{w.description}</p>
                <p className="text-xs text-primary mt-2 font-medium">→ {w.fix}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Niching Strategy */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <Lightbulb size={16} className="text-primary" />
          {t('upwork.analysis.niching')}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {analysis.nichingStrategy}
        </p>
      </div>

      {/* Proposal Tips */}
      {analysis.proposalTips.length > 0 && (
        <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
          <h3 className="font-bold text-text-primary mb-4">
            {t('upwork.analysis.proposalTips')}
          </h3>
          <ol className="space-y-2">
            {analysis.proposalTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-text-secondary">
                <span className="w-6 h-6 rounded-full bg-[#14A800]/[0.08] text-[#14A800] flex items-center justify-center flex-shrink-0 text-xs font-bold">
                  {i + 1}
                </span>
                {tip}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Competitive Position */}
      <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
        <h3 className="font-bold text-text-primary mb-3 flex items-center gap-2">
          <Users size={16} className="text-text-secondary" />
          {t('upwork.analysis.competitive')}
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          {analysis.competitivePosition}
        </p>
      </div>
    </section>
  );
}
