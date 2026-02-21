// components/results/ATSScorePanel.tsx
'use client';

import { useState } from 'react';
import { useTranslation } from '@/lib/i18n';
import SectionIntro from './SectionIntro';
import type { ATSScoreResult } from '@/lib/types';
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
} from 'lucide-react';

interface ATSScorePanelProps {
  atsScore: ATSScoreResult;
}

export function ATSScorePanel({ atsScore }: ATSScorePanelProps) {
  const { t } = useTranslation();
  const [showAllMissing, setShowAllMissing] = useState(false);
  const [showAllMatched, setShowAllMatched] = useState(false);
  const [expandedRec, setExpandedRec] = useState<number | null>(null);

  const scoreColor =
    atsScore.overallScore >= 75
      ? 'text-green-600'
      : atsScore.overallScore >= 50
        ? 'text-yellow-600'
        : 'text-red-600';

  const scoreBgColor =
    atsScore.overallScore >= 75
      ? 'bg-green-50 border-green-200'
      : atsScore.overallScore >= 50
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-red-50 border-red-200';

  const scoreRingColor =
    atsScore.overallScore >= 75
      ? '#22C55E'
      : atsScore.overallScore >= 50
        ? '#EAB308'
        : '#EF4444';

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (atsScore.overallScore / 100) * circumference;

  const matchedToShow = showAllMatched
    ? atsScore.keywords.matched
    : atsScore.keywords.matched.slice(0, 6);
  const semanticToShow = atsScore.keywords.semanticMatch;
  const missingToShow = showAllMissing
    ? atsScore.keywords.missing
    : atsScore.keywords.missing.slice(0, 6);

  return (
    <div className="animate-panelEnter space-y-6">
      <SectionIntro messageKey="ats.sectionIntro" />

      {/* Score Overview */}
      <div className={`rounded-2xl border p-6 ${scoreBgColor}`}>
        <div className="flex flex-col items-center gap-6 sm:flex-row">
          {/* Circular Score */}
          <div className="relative flex-shrink-0">
            <svg width="128" height="128" viewBox="0 0 128 128">
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke="#e5e7eb"
                strokeWidth="8"
              />
              <circle
                cx="64"
                cy="64"
                r="54"
                fill="none"
                stroke={scoreRingColor}
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                transform="rotate(-90 64 64)"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-bold ${scoreColor}`}>
                {atsScore.overallScore}%
              </span>
              <span className="text-xs text-gray-500">{t('ats.atsScore')}</span>
            </div>
          </div>

          {/* Score Breakdown */}
          <div className="flex-1 space-y-3">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">
              {atsScore.overallScore >= 75
                ? t('ats.scoreGreat')
                : atsScore.overallScore >= 50
                  ? t('ats.scoreModerate')
                  : t('ats.scoreNeedsWork')}
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/60 border border-black/[0.06] p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <Target className="h-4 w-4" />
                  {t('ats.keywordMatch')}
                </div>
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {atsScore.keywordScore}%
                </div>
              </div>
              <div className="rounded-xl bg-white/60 border border-black/[0.06] p-3">
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-1">
                  <FileSearch className="h-4 w-4" />
                  {t('ats.formatScore')}
                </div>
                <div className="text-xl font-bold text-[#1A1A1A]">
                  {atsScore.formatScore}%
                </div>
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
          {t('ats.keywordAnalysis')}
        </h3>

        {/* Matched Keywords */}
        {atsScore.keywords.matched.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('ats.matchedKeywords')} ({atsScore.keywords.matched.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {matchedToShow.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-green-50 border border-green-200 px-3 py-1 text-sm"
                >
                  <CheckCircle2 className="h-3 w-3 text-green-500" />
                  <span className="text-green-800">{kw.keyword}</span>
                  {kw.category === 'required' && (
                    <span className="text-[10px] text-green-600 font-medium uppercase">
                      {t('ats.required')}
                    </span>
                  )}
                </span>
              ))}
            </div>
            {atsScore.keywords.matched.length > 6 && (
              <button
                onClick={() => setShowAllMatched(!showAllMatched)}
                className="mt-2 flex items-center gap-1 text-sm text-[#E8890A] hover:underline"
              >
                {showAllMatched ? (
                  <>
                    {t('ats.showLess')} <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t('ats.showAll', { count: String(atsScore.keywords.matched.length) })}{' '}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}

        {/* Semantic Matches */}
        {semanticToShow.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Info className="h-5 w-5 text-blue-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('ats.semanticMatches')} ({semanticToShow.length})
              </h4>
            </div>
            <p className="text-sm text-gray-500 mb-3">{t('ats.semanticMatchesDesc')}</p>
            <div className="flex flex-wrap gap-2">
              {semanticToShow.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 rounded-full bg-blue-50 border border-blue-200 px-3 py-1 text-sm"
                >
                  <span className="text-blue-800">{kw.keyword}</span>
                  <ArrowRight className="h-3 w-3 text-blue-400" />
                  <span className="text-blue-600 font-medium">{kw.matchedAs}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Missing Keywords */}
        {atsScore.keywords.missing.length > 0 && (
          <div className="rounded-2xl border border-black/[0.08] bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <XCircle className="h-5 w-5 text-red-500" />
              <h4 className="font-medium text-[#1A1A1A]">
                {t('ats.missingKeywords')} ({atsScore.keywords.missing.length})
              </h4>
            </div>
            <div className="flex flex-wrap gap-2">
              {missingToShow.map((kw, i) => (
                <span
                  key={i}
                  className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm border ${
                    kw.category === 'required'
                      ? 'bg-red-50 border-red-200 text-red-800'
                      : kw.category === 'preferred'
                        ? 'bg-yellow-50 border-yellow-200 text-yellow-800'
                        : 'bg-gray-50 border-gray-200 text-gray-700'
                  }`}
                >
                  <XCircle className="h-3 w-3 flex-shrink-0" />
                  {kw.keyword}
                  <span className="text-[10px] font-medium uppercase opacity-70">
                    {kw.category === 'required'
                      ? t('ats.required')
                      : kw.category === 'preferred'
                        ? t('ats.preferred')
                        : t('ats.niceToHave')}
                  </span>
                </span>
              ))}
            </div>
            {atsScore.keywords.missing.length > 6 && (
              <button
                onClick={() => setShowAllMissing(!showAllMissing)}
                className="mt-2 flex items-center gap-1 text-sm text-[#E8890A] hover:underline"
              >
                {showAllMissing ? (
                  <>
                    {t('ats.showLess')} <ChevronUp className="h-4 w-4" />
                  </>
                ) : (
                  <>
                    {t('ats.showAll', { count: String(atsScore.keywords.missing.length) })}{' '}
                    <ChevronDown className="h-4 w-4" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Format Issues */}
      {atsScore.formatIssues.length > 0 &&
        atsScore.formatIssues[0].issue !== 'ats.format.allGood' && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A] flex items-center gap-2">
              <FileSearch className="h-5 w-5 text-[#E8890A]" />
              {t('ats.formatIssues')}
            </h3>
            <div className="space-y-3">
              {atsScore.formatIssues.map((issue, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border bg-white p-4 ${
                    issue.severity === 'critical'
                      ? 'border-red-200'
                      : issue.severity === 'warning'
                        ? 'border-yellow-200'
                        : 'border-black/[0.08]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {issue.severity === 'critical' ? (
                      <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    ) : issue.severity === 'warning' ? (
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5 flex-shrink-0" />
                    ) : (
                      <Info className="h-5 w-5 text-blue-500 mt-0.5 flex-shrink-0" />
                    )}
                    <div>
                      <p className="font-medium text-[#1A1A1A]">{t(issue.description)}</p>
                      {issue.fix && (
                        <p className="mt-1 text-sm text-gray-600">
                          <span className="font-medium text-[#E8890A]">{t('ats.fix')}:</span>{' '}
                          {t(issue.fix)}
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
      {atsScore.formatIssues.length === 1 &&
        atsScore.formatIssues[0].issue === 'ats.format.allGood' && (
          <div className="rounded-2xl border border-green-200 bg-green-50 p-5">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <div>
                <h4 className="font-medium text-green-800">{t('ats.format.allGoodDesc')}</h4>
              </div>
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
              <div
                key={i}
                className="rounded-2xl border border-black/[0.08] bg-white p-4 cursor-pointer hover:border-[#E8890A]/30 transition-colors"
                onClick={() => setExpandedRec(expandedRec === i ? null : i)}
              >
                <div className="flex items-start gap-3">
                  <span
                    className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold text-white flex-shrink-0 ${
                      rec.priority === 'critical'
                        ? 'bg-red-500'
                        : rec.priority === 'high'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1">
                    <p className="font-medium text-[#1A1A1A]">{rec.action}</p>
                    <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                      <span className="rounded bg-gray-100 px-1.5 py-0.5">
                        {rec.section}
                      </span>
                      <span
                        className={`rounded px-1.5 py-0.5 font-medium ${
                          rec.priority === 'critical'
                            ? 'bg-red-100 text-red-700'
                            : rec.priority === 'high'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-blue-100 text-blue-700'
                        }`}
                      >
                        {rec.priority}
                      </span>
                    </div>
                    {expandedRec === i && rec.example && (
                      <div className="mt-3 rounded-xl bg-gray-50 p-3 text-sm text-gray-700 border border-gray-100">
                        <span className="text-xs font-medium text-gray-500 uppercase">
                          {t('ats.example')}
                        </span>
                        <p className="mt-1 italic">{rec.example}</p>
                      </div>
                    )}
                    {expandedRec === i && rec.keywords.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {rec.keywords.map((kw, j) => (
                          <span
                            key={j}
                            className="inline-flex rounded-full bg-[#E8890A]/10 px-2 py-0.5 text-xs text-[#E8890A] font-medium"
                          >
                            {kw}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  {rec.example && (
                    <span className="text-gray-400">
                      {expandedRec === i ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </span>
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
