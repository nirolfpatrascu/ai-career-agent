// components/results/CVOptimizerPanel.tsx
'use client';

import { useState, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';
import type { ATSScoreResult, JobMatch, AnalysisResult, CVSuggestion } from '@/lib/types';
import {
  Shield,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  ChevronDown,
  ChevronUp,
  Building2,
  FileSearch,
  Target,
  Lightbulb,
  ArrowRight,
  Download,
  Sparkles,
  FileCheck,
  Plus,
  Trash2,
} from 'lucide-react';
import { FeedbackButton } from './FeedbackButton';

// ============================================================================
// Types
// ============================================================================

interface CVOptimizerPanelProps {
  atsScore?: ATSScoreResult;
  jobMatch?: JobMatch;
  analysis: AnalysisResult;
}

interface ExperienceEntry {
  title: string;
  company: string;
  dateRange: string;
  description: string;
}

interface EducationEntry {
  degree: string;
  institution: string;
  year: string;
}

interface CVSections {
  summary: string;
  skills: string;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  certifications: string;
  languages: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function CVOptimizerPanel({ atsScore, jobMatch, analysis }: CVOptimizerPanelProps) {
  const { t } = useTranslation();

  return (
    <div className="animate-panelEnter space-y-6">
      {/* Section header with feedback */}
      <div className="flex items-center justify-end">
        <FeedbackButton section="atsScore" />
      </div>

      {/* Section A: What is ATS? */}
      <ATSExplainer t={t} />

      {/* Section B: ATS Score Overview */}
      {atsScore && <ATSScoreSection atsScore={atsScore} t={t} />}

      {/* Section C: CV Suggestions */}
      <CVSuggestionsSection
        cvSuggestions={jobMatch?.cvSuggestions}
        recommendations={atsScore?.recommendations}
        t={t}
      />

      {/* Section D: Editable CV + PDF Download */}
      <CVEditorSection
        analysis={analysis}
        cvSuggestions={jobMatch?.cvSuggestions}
        t={t}
      />
    </div>
  );
}

// ============================================================================
// Section A: ATS Explainer
// ============================================================================

function ATSExplainer({ t }: { t: (key: string) => string }) {
  const [expanded, setExpanded] = useState(true);

  return (
    <div className="rounded-2xl border border-amber-200/60 bg-amber-50/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <Shield className="h-5 w-5 text-amber-600 flex-shrink-0" />
          <span className="font-semibold text-[#1A1A1A] text-sm">
            {expanded ? t('cvOptimizer.whatIsAts.title') : t('cvOptimizer.whatIsAts.expand')}
          </span>
        </div>
        {expanded ? (
          <ChevronUp className="h-4 w-4 text-amber-600" />
        ) : (
          <ChevronDown className="h-4 w-4 text-amber-600" />
        )}
      </button>
      <div
        className={`transition-all duration-300 overflow-hidden ${
          expanded ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <p className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
          {t('cvOptimizer.whatIsAts.body')}
        </p>
      </div>
    </div>
  );
}

// ============================================================================
// Section B: ATS Score
// ============================================================================

function ATSScoreSection({ atsScore, t }: { atsScore: ATSScoreResult; t: (key: string, vars?: Record<string, string>) => string }) {
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [showAllMatched, setShowAllMatched] = useState(false);
  const [expandedRec, setExpandedRec] = useState<number | null>(null);

  const scoreColor =
    atsScore.overallScore >= 75 ? 'text-green-600'
      : atsScore.overallScore >= 50 ? 'text-yellow-600'
        : 'text-red-600';

  const scoreBgColor =
    atsScore.overallScore >= 75 ? 'bg-green-50 border-green-200'
      : atsScore.overallScore >= 50 ? 'bg-yellow-50 border-yellow-200'
        : 'bg-red-50 border-red-200';

  const scoreRingColor =
    atsScore.overallScore >= 75 ? '#22C55E'
      : atsScore.overallScore >= 50 ? '#EAB308'
        : '#EF4444';

  const scoreMessage =
    atsScore.overallScore >= 75 ? t('cvOptimizer.score.excellent')
      : atsScore.overallScore >= 60 ? t('cvOptimizer.score.good')
        : atsScore.overallScore >= 40 ? t('cvOptimizer.score.needsWork')
          : t('cvOptimizer.score.poor');

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (atsScore.overallScore / 100) * circumference;

  const matchedToShow = showAllMatched ? atsScore.keywords.matched : atsScore.keywords.matched.slice(0, 6);
  const semanticToShow = atsScore.keywords.semanticMatch;
  const missingToShow = showAllMissing ? atsScore.keywords.missing : atsScore.keywords.missing.slice(0, 6);

  return (
    <div className="space-y-4">
      {/* Score Card */}
      <div className={`rounded-2xl border p-6 ${scoreBgColor}`}>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Circular Score */}
          <div className="relative flex-shrink-0">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="54" fill="none" stroke="#e5e7eb" strokeWidth="8" />
              <circle
                cx="64" cy="64" r="54" fill="none"
                stroke={scoreRingColor} strokeWidth="8" strokeLinecap="round"
                strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 64 64)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>{atsScore.overallScore}%</span>
              <span className="text-xs text-gray-500">{t('cvOptimizer.score.title')}</span>
            </div>
          </div>

          {/* Breakdown */}
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">{scoreMessage}</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/60 border border-black/[0.06] p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Target className="h-4 w-4" />
                  {t('cvOptimizer.score.keyword')}
                </div>
                <div className="text-xl font-bold text-[#1A1A1A]">{atsScore.keywordScore}%</div>
              </div>
              <div className="rounded-xl bg-white/60 border border-black/[0.06] p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FileSearch className="h-4 w-4" />
                  {t('cvOptimizer.score.format')}
                </div>
                <div className="text-xl font-bold text-[#1A1A1A]">{atsScore.formatScore}%</div>
              </div>
            </div>
            <p className="text-sm text-gray-500">
              {t('ats.matchedOf', {
                matched: String(atsScore.keywords.total.matched),
                total: String(atsScore.keywords.total.required),
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Company ATS Info */}
      {atsScore.companyATS && (
        <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
          <div className="flex items-center gap-2 mb-3">
            <Building2 className="h-5 w-5 text-[#E8890A]" />
            <h3 className="font-semibold text-[#1A1A1A]">
              {t('ats.companyAts', { company: atsScore.companyATS.company })}
            </h3>
          </div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700">
            <Shield className="h-3.5 w-3.5" />
            {atsScore.companyATS.atsSystem}
          </div>
          <ul className="space-y-2">
            {atsScore.companyATS.tips.slice(0, 5).map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                <Lightbulb className="h-4 w-4 text-[#E8890A] mt-0.5 flex-shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Keyword Analysis */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
          <Target className="h-5 w-5 text-[#E8890A]" />
          {t('cvOptimizer.keywords.title')}
        </h3>

        {/* Matched */}
        {atsScore.keywords.matched.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('cvOptimizer.keywords.matched')} ({atsScore.keywords.matched.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedToShow.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-sm">
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-green-800">{kw.keyword}</span>
                  {kw.category === 'required' && (
                    <span className="text-[10px] text-green-600 font-medium uppercase">{t('ats.required')}</span>
                  )}
                </span>
              ))}
            </div>
            {atsScore.keywords.matched.length > 6 && (
              <button onClick={() => setShowAllMatched(!showAllMatched)} className="mt-2 flex items-center gap-1 text-sm text-[#E8890A] hover:underline">
                {showAllMatched ? (<>{t('ats.showLess')} <ChevronUp className="h-4 w-4" /></>) : (<>{t('ats.showAll', { count: String(atsScore.keywords.matched.length) })} <ChevronDown className="h-4 w-4" /></>)}
              </button>
            )}
          </div>
        )}

        {/* Semantic */}
        {semanticToShow.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('cvOptimizer.keywords.semantic')} ({semanticToShow.length})
              </h4>
            </div>
            <p className="text-sm text-gray-500 mb-3">{t('ats.semanticMatchesDesc')}</p>
            <div className="flex flex-wrap gap-2">
              {semanticToShow.map((kw, i) => (
                <span key={i} className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-sm">
                  <span className="text-blue-800">{kw.keyword}</span>
                  <ArrowRight className="h-3 w-3 text-blue-400" />
                  <span className="text-blue-600 font-medium">{kw.matchedAs}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing */}
        {atsScore.keywords.missing.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('cvOptimizer.keywords.missing')} ({atsScore.keywords.missing.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingToShow.map((kw, i) => (
                <span key={i} className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm border ${
                  kw.category === 'required' ? 'bg-red-50 border-red-200 text-red-800'
                    : kw.category === 'preferred' ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                      : 'bg-gray-50 border-gray-200 text-gray-700'
                }`}>
                  <XCircle className="h-3 w-3 flex-shrink-0" />
                  {kw.keyword}
                  <span className="text-[10px] font-medium uppercase opacity-70">
                    {kw.category === 'required' ? t('ats.required') : kw.category === 'preferred' ? t('ats.preferred') : t('ats.niceToHave')}
                  </span>
                </span>
              ))}
            </div>
            {atsScore.keywords.missing.length > 6 && (
              <button onClick={() => setShowAllMissing(!showAllMissing)} className="mt-2 flex items-center gap-1 text-sm text-[#E8890A] hover:underline">
                {showAllMissing ? (<>{t('ats.showLess')} <ChevronUp className="h-4 w-4" /></>) : (<>{t('ats.showAll', { count: String(atsScore.keywords.missing.length) })} <ChevronDown className="h-4 w-4" /></>)}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Format Issues */}
      {atsScore.formatIssues.length > 0 && atsScore.formatIssues[0].issue !== 'ats.format.allGood' && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
            <FileSearch className="h-5 w-5 text-[#E8890A]" />
            {t('cvOptimizer.format.title')}
          </h3>
          <div className="space-y-3">
            {atsScore.formatIssues.map((issue, i) => (
              <div key={i} className={`rounded-2xl border bg-white p-4 ${
                issue.severity === 'critical' ? 'border-red-200' : issue.severity === 'warning' ? 'border-yellow-200' : 'border-black/[0.08]'
              }`}>
                <div className="flex items-start gap-3">
                  {issue.severity === 'critical' ? <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    : issue.severity === 'warning' ? <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                      : <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />}
                  <div>
                    <p className="font-medium text-[#1A1A1A]">{t(issue.description)}</p>
                    {issue.fix && (
                      <p className="mt-1 text-sm text-gray-600">
                        <span className="font-medium text-[#E8890A]">{t('ats.fix')}:</span> {t(issue.fix)}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Format All Good */}
      {atsScore.formatIssues.length === 1 && atsScore.formatIssues[0].issue === 'ats.format.allGood' && (
        <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-6 w-6 text-green-500" />
            <h4 className="font-medium text-green-800">{t('ats.format.allGoodDesc')}</h4>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {atsScore.recommendations.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-[#E8890A]" />
            {t('ats.recommendations')}
          </h3>
          <div className="space-y-3">
            {atsScore.recommendations.map((rec, i) => (
              <div key={i} className="rounded-2xl border border-black/[0.08] bg-white p-4 cursor-pointer hover:border-[#E8890A]/30 transition-colors" onClick={() => setExpandedRec(expandedRec === i ? null : i)}>
                <div className="flex items-start gap-3">
                  <span className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0 ${
                    rec.priority === 'critical' ? 'bg-red-500' : rec.priority === 'high' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}>{i + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">{rec.action}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5">{rec.section}</span>
                      <span className={`rounded px-1.5 py-0.5 font-medium ${
                        rec.priority === 'critical' ? 'bg-red-100 text-red-700' : rec.priority === 'high' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
                      }`}>{rec.priority}</span>
                    </div>
                    {expandedRec === i && rec.example && (
                      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase">{t('ats.example')}</span>
                        <p className="mt-1 italic">{rec.example}</p>
                      </div>
                    )}
                    {expandedRec === i && rec.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.keywords.map((kw, j) => (
                          <span key={j} className="inline-flex rounded-full bg-[#E8890A]/10 px-2 py-0.5 text-xs text-[#E8890A] font-medium">{kw}</span>
                        ))}
                      </div>
                    )}
                  </div>
                  {rec.example && (
                    <span className="text-gray-400">{expandedRec === i ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section C: CV Suggestions
// ============================================================================

function CVSuggestionsSection({
  cvSuggestions,
  recommendations,
  t,
}: {
  cvSuggestions?: CVSuggestion[];
  recommendations?: ATSScoreResult['recommendations'];
  t: (key: string) => string;
}) {
  const hasSuggestions = cvSuggestions && cvSuggestions.length > 0;

  if (!hasSuggestions && (!recommendations || recommendations.length === 0)) {
    return (
      <div className="rounded-2xl border border-black/[0.08] bg-white p-8 text-center">
        <FileCheck className="h-10 w-10 text-gray-300 mx-auto mb-3" />
        <p className="text-sm text-text-tertiary">{t('cvOptimizer.suggestions.empty')}</p>
      </div>
    );
  }

  if (!hasSuggestions) return null; // recommendations already shown in ATS section

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-[#E8890A]" />
        {t('cvOptimizer.suggestions.title')}
      </h3>
      <div className="space-y-4">
        {cvSuggestions!.map((suggestion, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden">
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] bg-black/[0.02]">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{suggestion.section}</span>
            </div>
            <div className="p-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-red-50/60 border border-red-100 p-4">
                  <p className="text-[11px] font-semibold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <XCircle className="h-3 w-3" />
                    {t('cvOptimizer.suggestions.current')}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed line-through decoration-red-300">{suggestion.current}</p>
                </div>
                <div className="rounded-xl bg-green-50/60 border border-green-100 p-4">
                  <p className="text-[11px] font-semibold text-green-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3 w-3" />
                    {t('cvOptimizer.suggestions.suggested')}
                  </p>
                  <p className="text-sm text-text-primary leading-relaxed">{suggestion.suggested}</p>
                </div>
              </div>
              <div className="flex items-start gap-2 px-1">
                <Info className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-text-tertiary" />
                <p className="text-xs text-text-tertiary leading-relaxed">{suggestion.reasoning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Section D: CV Editor + PDF Download
// ============================================================================

function CVEditorSection({
  analysis,
  cvSuggestions,
  t,
}: {
  analysis: AnalysisResult;
  cvSuggestions?: CVSuggestion[];
  t: (key: string, vars?: Record<string, string>) => string;
}) {
  // Initialize from analysis data
  const initialSections = useMemo<CVSections>(() => ({
    summary: analysis.fitScore.summary || '',
    skills: analysis.strengths.map(s => s.title).join(', '),
    experience: [],
    education: [],
    certifications: '',
    languages: '',
  }), [analysis]);

  const [sections, setSections] = useState<CVSections>(initialSections);
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<number>>(new Set());
  const [dismissedSuggestions, setDismissedSuggestions] = useState<Set<number>>(new Set());
  const [showAppliedToast, setShowAppliedToast] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  // Map suggestion sections to editor sections
  const sectionMap: Record<string, keyof CVSections> = {
    'Professional Summary': 'summary',
    'Summary': 'summary',
    'Skills': 'skills',
    'Technical Skills': 'skills',
    'Experience': 'experience',
    'Work Experience': 'experience',
    'Education': 'education',
    'Certifications': 'certifications',
    'Languages': 'languages',
  };

  const getSectionKey = (sectionName: string): keyof CVSections | null => {
    for (const [key, value] of Object.entries(sectionMap)) {
      if (sectionName.toLowerCase().includes(key.toLowerCase())) return value;
    }
    return null;
  };

  const hasSuggestionForSection = (sectionKey: string): number | null => {
    if (!cvSuggestions) return null;
    const idx = cvSuggestions.findIndex((s, i) => {
      const key = getSectionKey(s.section);
      return key === sectionKey && !appliedSuggestions.has(i) && !dismissedSuggestions.has(i);
    });
    return idx >= 0 ? idx : null;
  };

  const applySuggestion = useCallback((idx: number) => {
    if (!cvSuggestions) return;
    const suggestion = cvSuggestions[idx];
    const key = getSectionKey(suggestion.section);
    if (!key) return;

    if (key === 'experience' || key === 'education') {
      // For complex fields, can't directly apply — just mark as applied
    } else {
      setSections(prev => ({ ...prev, [key]: suggestion.suggested }));
    }
    setAppliedSuggestions(prev => new Set([...Array.from(prev), idx]));
  }, [cvSuggestions]);

  const applyAllSuggestions = useCallback(() => {
    if (!cvSuggestions) return;
    let count = 0;
    cvSuggestions.forEach((suggestion, idx) => {
      if (appliedSuggestions.has(idx) || dismissedSuggestions.has(idx)) return;
      const key = getSectionKey(suggestion.section);
      if (!key || key === 'experience' || key === 'education') return;
      setSections(prev => ({ ...prev, [key]: suggestion.suggested }));
      setAppliedSuggestions(prev => new Set([...Array.from(prev), idx]));
      count++;
    });
    if (count > 0) {
      setShowAppliedToast(true);
      setTimeout(() => setShowAppliedToast(false), 3000);
    }
  }, [cvSuggestions, appliedSuggestions, dismissedSuggestions]);

  const pendingSuggestionCount = useMemo(() => {
    if (!cvSuggestions) return 0;
    return cvSuggestions.filter((_, i) => !appliedSuggestions.has(i) && !dismissedSuggestions.has(i)).length;
  }, [cvSuggestions, appliedSuggestions, dismissedSuggestions]);

  // Experience handlers
  const addExperience = () => {
    setSections(prev => ({
      ...prev,
      experience: [...prev.experience, { title: '', company: '', dateRange: '', description: '' }],
    }));
  };

  const removeExperience = (idx: number) => {
    setSections(prev => ({ ...prev, experience: prev.experience.filter((_, i) => i !== idx) }));
  };

  const updateExperience = (idx: number, field: keyof ExperienceEntry, value: string) => {
    setSections(prev => ({
      ...prev,
      experience: prev.experience.map((e, i) => (i === idx ? { ...e, [field]: value } : e)),
    }));
  };

  // Education handlers
  const addEducation = () => {
    setSections(prev => ({
      ...prev,
      education: [...prev.education, { degree: '', institution: '', year: '' }],
    }));
  };

  const removeEducation = (idx: number) => {
    setSections(prev => ({ ...prev, education: prev.education.filter((_, i) => i !== idx) }));
  };

  const updateEducation = (idx: number, field: keyof EducationEntry, value: string) => {
    setSections(prev => ({
      ...prev,
      education: prev.education.map((e, i) => (i === idx ? { ...e, [field]: value } : e)),
    }));
  };

  // PDF Download
  const downloadPdf = useCallback(async () => {
    setPdfLoading(true);
    try {
      const res = await fetch('/api/generate-cv-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: analysis.metadata.targetRole ? `${analysis.metadata.cvFileName?.replace('.pdf', '') || 'Candidate'}` : 'Candidate',
          summary: sections.summary,
          skills: sections.skills,
          experience: sections.experience,
          education: sections.education,
          certifications: sections.certifications,
          languages: sections.languages,
          targetRole: analysis.metadata.targetRole,
        }),
      });
      if (!res.ok) throw new Error('PDF generation failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'CV.pdf';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // Fallback: use browser print
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const html = buildPrintHtml(sections, analysis.metadata.targetRole);
        printWindow.document.write(html);
        printWindow.document.close();
        printWindow.onload = () => {
          printWindow.print();
          printWindow.close();
        };
      }
    } finally {
      setPdfLoading(false);
    }
  }, [sections, analysis]);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-[#E8890A]" />
            {t('cvOptimizer.editor.title')}
          </h3>
          <p className="text-sm text-gray-500 mt-0.5">{t('cvOptimizer.editor.description')}</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0 relative">
          {pendingSuggestionCount > 0 && (
            <button
              onClick={applyAllSuggestions}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#E8890A] text-[#E8890A] text-sm font-medium hover:bg-[#E8890A]/5 transition-all active:scale-95"
            >
              <Sparkles className="h-4 w-4" />
              {t('cvOptimizer.editor.applyAll')}
            </button>
          )}
          <button
            onClick={downloadPdf}
            disabled={pdfLoading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#E8890A] text-white text-sm font-medium hover:bg-[#D07A08] transition-all active:scale-95 disabled:opacity-60"
          >
            <Download className="h-4 w-4" />
            {pdfLoading ? t('cvOptimizer.editor.generating') : t('cvOptimizer.editor.downloadPdf')}
          </button>
          {/* Applied toast */}
          {showAppliedToast && (
            <div className="absolute -bottom-10 right-0 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg shadow-lg animate-fade-in">
              <CheckCircle2 className="h-3 w-3 inline mr-1" />
              {t('cvOptimizer.editor.appliedCount', { count: String(cvSuggestions?.length || 0) })}
            </div>
          )}
        </div>
      </div>

      {/* Editor Cards */}
      <div className="space-y-4">
        {/* Summary */}
        <EditorCard
          title={t('cvOptimizer.editor.section.summary')}
          borderColor="border-l-blue-400"
          suggestionIdx={hasSuggestionForSection('summary')}
          suggestion={cvSuggestions}
          appliedSuggestions={appliedSuggestions}
          onApply={applySuggestion}
          onDismiss={(idx) => setDismissedSuggestions(prev => new Set([...Array.from(prev), idx]))}
          t={t}
        >
          <textarea
            value={sections.summary}
            onChange={(e) => setSections(prev => ({ ...prev, summary: e.target.value }))}
            rows={4}
            className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30 focus:border-[#E8890A]/40"
            placeholder="Write a brief professional summary..."
          />
        </EditorCard>

        {/* Skills */}
        <EditorCard
          title={t('cvOptimizer.editor.section.skills')}
          borderColor="border-l-purple-400"
          suggestionIdx={hasSuggestionForSection('skills')}
          suggestion={cvSuggestions}
          appliedSuggestions={appliedSuggestions}
          onApply={applySuggestion}
          onDismiss={(idx) => setDismissedSuggestions(prev => new Set([...Array.from(prev), idx]))}
          t={t}
        >
          <textarea
            value={sections.skills}
            onChange={(e) => setSections(prev => ({ ...prev, skills: e.target.value }))}
            rows={3}
            className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30 focus:border-[#E8890A]/40"
            placeholder="JavaScript, TypeScript, React, Node.js..."
          />
        </EditorCard>

        {/* Experience */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden border-l-4 border-l-green-400">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-black/[0.02]">
            <h4 className="font-semibold text-text-primary text-sm">{t('cvOptimizer.editor.section.experience')}</h4>
            <button onClick={addExperience} className="inline-flex items-center gap-1 text-xs text-[#E8890A] font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="p-5 space-y-4">
            {sections.experience.length === 0 && (
              <button onClick={addExperience} className="w-full py-6 border-2 border-dashed border-black/[0.08] rounded-xl text-sm text-text-tertiary hover:border-[#E8890A]/30 hover:text-[#E8890A] transition-colors flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add experience entry
              </button>
            )}
            {sections.experience.map((exp, i) => (
              <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 relative">
                <button onClick={() => removeExperience(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={exp.title} onChange={(e) => updateExperience(i, 'title', e.target.value)} placeholder="Job Title" className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                  <input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} placeholder="Company" className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                </div>
                <input value={exp.dateRange} onChange={(e) => updateExperience(i, 'dateRange', e.target.value)} placeholder="Jan 2020 - Present" className="w-full rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                <textarea value={exp.description} onChange={(e) => updateExperience(i, 'description', e.target.value)} rows={4} placeholder="Key achievements and responsibilities..." className="w-full rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div className="bg-white rounded-2xl border border-black/[0.08] overflow-hidden border-l-4 border-l-yellow-400">
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-black/[0.02]">
            <h4 className="font-semibold text-text-primary text-sm">{t('cvOptimizer.editor.section.education')}</h4>
            <button onClick={addEducation} className="inline-flex items-center gap-1 text-xs text-[#E8890A] font-medium hover:underline">
              <Plus className="h-3.5 w-3.5" /> Add
            </button>
          </div>
          <div className="p-5 space-y-4">
            {sections.education.length === 0 && (
              <button onClick={addEducation} className="w-full py-6 border-2 border-dashed border-black/[0.08] rounded-xl text-sm text-text-tertiary hover:border-[#E8890A]/30 hover:text-[#E8890A] transition-colors flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" /> Add education entry
              </button>
            )}
            {sections.education.map((edu, i) => (
              <div key={i} className="rounded-xl border border-black/[0.06] p-4 space-y-3 relative">
                <button onClick={() => removeEducation(i)} className="absolute top-3 right-3 text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="h-4 w-4" />
                </button>
                <input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} placeholder="Degree" className="w-full rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input value={edu.institution} onChange={(e) => updateEducation(i, 'institution', e.target.value)} placeholder="Institution" className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                  <input value={edu.year} onChange={(e) => updateEducation(i, 'year', e.target.value)} placeholder="Year" className="rounded-lg border border-black/[0.08] bg-black/[0.02] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Certifications */}
        <EditorCard
          title={t('cvOptimizer.editor.section.certifications')}
          borderColor="border-l-teal-400"
          suggestionIdx={hasSuggestionForSection('certifications')}
          suggestion={cvSuggestions}
          appliedSuggestions={appliedSuggestions}
          onApply={applySuggestion}
          onDismiss={(idx) => setDismissedSuggestions(prev => new Set([...Array.from(prev), idx]))}
          t={t}
        >
          <textarea
            value={sections.certifications}
            onChange={(e) => setSections(prev => ({ ...prev, certifications: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30 focus:border-[#E8890A]/40"
            placeholder="AWS Solutions Architect, PMP, etc."
          />
        </EditorCard>

        {/* Languages */}
        <EditorCard
          title={t('cvOptimizer.editor.section.languages')}
          borderColor="border-l-indigo-400"
          suggestionIdx={hasSuggestionForSection('languages')}
          suggestion={cvSuggestions}
          appliedSuggestions={appliedSuggestions}
          onApply={applySuggestion}
          onDismiss={(idx) => setDismissedSuggestions(prev => new Set([...Array.from(prev), idx]))}
          t={t}
        >
          <textarea
            value={sections.languages}
            onChange={(e) => setSections(prev => ({ ...prev, languages: e.target.value }))}
            rows={2}
            className="w-full rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3 text-sm text-text-primary resize-none focus:outline-none focus:ring-2 focus:ring-[#E8890A]/30 focus:border-[#E8890A]/40"
            placeholder="English (Native), German (Fluent), etc."
          />
        </EditorCard>
      </div>
    </div>
  );
}

// ============================================================================
// Editor Card with suggestion indicator
// ============================================================================

function EditorCard({
  title,
  borderColor,
  children,
  suggestionIdx,
  suggestion,
  appliedSuggestions,
  onApply,
  onDismiss,
  t,
}: {
  title: string;
  borderColor: string;
  children: React.ReactNode;
  suggestionIdx: number | null;
  suggestion?: CVSuggestion[];
  appliedSuggestions: Set<number>;
  onApply: (idx: number) => void;
  onDismiss: (idx: number) => void;
  t: (key: string) => string;
}) {
  const [showSuggestion, setShowSuggestion] = useState(false);
  const hasPending = suggestionIdx !== null;

  return (
    <div className={`bg-white rounded-2xl border border-black/[0.08] overflow-hidden border-l-4 ${borderColor}`}>
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-black/[0.06] bg-black/[0.02]">
        <div className="flex items-center gap-2">
          <h4 className="font-semibold text-text-primary text-sm">{title}</h4>
          {hasPending && (
            <span className="inline-flex items-center gap-1 text-[10px] font-medium text-[#E8890A] bg-[#E8890A]/10 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E8890A]" />
              {t('cvOptimizer.editor.suggestion.available')}
            </span>
          )}
        </div>
        {hasPending && (
          <button
            onClick={() => setShowSuggestion(!showSuggestion)}
            className="text-xs text-[#E8890A] font-medium hover:underline"
          >
            {showSuggestion ? t('cvOptimizer.whatIsAts.collapse') : t('cvOptimizer.editor.suggestion.view')}
          </button>
        )}
      </div>

      {/* Suggestion diff */}
      {showSuggestion && hasPending && suggestion && (
        <div className="px-5 py-3 bg-amber-50/40 border-b border-amber-200/40">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
            <div className="rounded-lg bg-red-50/60 border border-red-100 p-3">
              <p className="text-[10px] font-semibold text-red-500 uppercase mb-1">{t('cvOptimizer.editor.suggestion.original')}</p>
              <p className="text-xs text-gray-600 line-through">{suggestion[suggestionIdx!].current}</p>
            </div>
            <div className="rounded-lg bg-green-50/60 border border-green-100 p-3">
              <p className="text-[10px] font-semibold text-green-500 uppercase mb-1">{t('cvOptimizer.editor.suggestion.suggested')}</p>
              <p className="text-xs text-gray-800">{suggestion[suggestionIdx!].suggested}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { onApply(suggestionIdx!); setShowSuggestion(false); }}
              className="px-3 py-1 rounded-lg bg-[#E8890A] text-white text-xs font-medium hover:bg-[#D07A08] transition-colors"
            >
              {t('cvOptimizer.editor.suggestion.apply')}
            </button>
            <button
              onClick={() => { onDismiss(suggestionIdx!); setShowSuggestion(false); }}
              className="px-3 py-1 rounded-lg bg-gray-100 text-gray-600 text-xs font-medium hover:bg-gray-200 transition-colors"
            >
              {t('cvOptimizer.editor.suggestion.dismiss')}
            </button>
          </div>
        </div>
      )}

      <div className="p-5">{children}</div>
    </div>
  );
}

// ============================================================================
// Print HTML fallback
// ============================================================================

function buildPrintHtml(sections: CVSections, targetRole: string): string {
  const experienceHtml = sections.experience.map(e => `
    <div style="margin-bottom:12px">
      <div style="display:flex;justify-content:space-between"><strong>${e.title}</strong><span style="color:#666">${e.dateRange}</span></div>
      <div style="color:#444">${e.company}</div>
      <div style="margin-top:4px;white-space:pre-line">${e.description}</div>
    </div>
  `).join('');

  const educationHtml = sections.education.map(e => `
    <div style="margin-bottom:8px">
      <div style="display:flex;justify-content:space-between"><strong>${e.degree}</strong><span style="color:#666">${e.year}</span></div>
      <div style="color:#444">${e.institution}</div>
    </div>
  `).join('');

  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>CV - ${targetRole}</title>
    <style>body{font-family:Helvetica,Arial,sans-serif;max-width:700px;margin:40px auto;color:#1a1a1a;font-size:11pt;line-height:1.5}
    h2{font-size:13pt;border-bottom:1px solid #333;padding-bottom:4px;margin-top:18px;text-transform:uppercase;letter-spacing:1px}
    @media print{body{margin:0;padding:20px}}</style>
  </head><body>
    ${sections.summary ? `<h2>Professional Summary</h2><p>${sections.summary}</p>` : ''}
    ${sections.skills ? `<h2>Skills</h2><p>${sections.skills}</p>` : ''}
    ${experienceHtml ? `<h2>Experience</h2>${experienceHtml}` : ''}
    ${educationHtml ? `<h2>Education</h2>${educationHtml}` : ''}
    ${sections.certifications ? `<h2>Certifications</h2><p>${sections.certifications}</p>` : ''}
    ${sections.languages ? `<h2>Languages</h2><p>${sections.languages}</p>` : ''}
  </body></html>`;
}
