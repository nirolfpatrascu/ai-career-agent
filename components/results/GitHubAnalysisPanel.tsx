'use client';

import { useState, useCallback } from 'react';
import { useTranslation } from '@/lib/i18n';
import { FeedbackButton } from './FeedbackButton';
import type { GitHubAnalysis } from '@/lib/prompts/github-analysis';

interface GitHubAnalysisPanelProps {
  githubUrl: string;
  targetRole: string;
  jobPosting?: string;
}

const PRIORITY_STYLES: Record<string, string> = {
  high: 'bg-danger/[0.08] border-danger/15 text-danger',
  medium: 'bg-warning/[0.08] border-warning/15 text-warning',
  low: 'bg-primary/[0.08] border-primary/15 text-primary',
};

export default function GitHubAnalysisPanel({ githubUrl, targetRole, jobPosting }: GitHubAnalysisPanelProps) {
  const { t, locale } = useTranslation();
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<GitHubAnalysis | null>(null);
  const [error, setError] = useState('');

  const handleAnalyze = useCallback(async () => {
    setAnalyzing(true);
    setError('');
    try {
      const res = await fetch('/api/analyze-github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ githubUrl, targetRole, jobPosting, language: locale }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to analyze GitHub profile');
      }
      const data = await res.json();
      setAnalysis(data.analysis);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setAnalyzing(false);
    }
  }, [githubUrl, targetRole, jobPosting, locale]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-black/[0.06] border border-black/[0.08] flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary font-display">{t('github.title') || 'GitHub Analysis'}</h2>
            <p className="text-sm text-text-tertiary">{t('github.subtitle') || 'Repos, languages, and contribution insights'}</p>
          </div>
        </div>
        <FeedbackButton section="github-analysis" />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-center gap-2 px-4 py-3 bg-danger/[0.06] border border-danger/15 rounded-xl text-sm text-danger">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
          {error}
        </div>
      )}

      {/* Pre-analysis state */}
      {!analysis && !analyzing && (
        <div className="text-center py-8">
          <p className="text-sm text-text-secondary mb-4 font-mono">{githubUrl}</p>
          <button
            onClick={handleAnalyze}
            className="btn-primary py-3 px-8 text-base font-semibold flex items-center justify-center gap-2 mx-auto"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            {t('github.analyze') || 'Analyze GitHub Profile'}
          </button>
        </div>
      )}

      {/* Loading */}
      {analyzing && (
        <div className="flex flex-col items-center gap-3 py-12">
          <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
          <p className="text-sm text-text-tertiary">{t('github.analyzing') || 'Analyzing your GitHub profile...'}</p>
        </div>
      )}

      {/* Analysis results */}
      {analysis && !analyzing && (
        <>
          {/* Stats overview */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {[
              { label: t('github.totalRepos') || 'Total Repos', value: analysis.stats.totalRepos },
              { label: t('github.topLanguages') || 'Top Languages', value: analysis.stats.topLanguages?.slice(0, 3).join(', ') || 'N/A' },
              { label: t('github.avgStars') || 'Avg Stars', value: analysis.stats.avgStars?.toFixed(1) || '0' },
              { label: t('github.accountAge') || 'Account Age', value: analysis.stats.accountAge },
              { label: t('github.recentActivity') || 'Recent Activity', value: analysis.stats.recentActivity },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4 text-center">
                <p className="text-lg font-bold text-text-primary">{stat.value}</p>
                <p className="text-xs text-text-tertiary mt-1">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Strengths */}
          {analysis.strengths?.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-3">{t('github.strengths') || 'Strengths'}</h3>
              <div className="space-y-3">
                {analysis.strengths.map((s, i) => (
                  <div key={i} className="relative rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-success" />
                    <div className="pl-4">
                      <h4 className="font-semibold text-text-primary text-[15px] mb-1">{s.area}</h4>
                      <p className="text-sm text-text-secondary mb-2">{s.description}</p>
                      <p className="text-xs text-success/80 italic">{s.evidence}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Improvements */}
          {analysis.improvements?.length > 0 && (
            <div>
              <h3 className="text-base font-semibold text-text-primary mb-3">{t('github.improvements') || 'Areas to Improve'}</h3>
              <div className="space-y-3">
                {analysis.improvements.map((imp, i) => (
                  <div key={i} className="relative rounded-2xl border border-black/[0.08] bg-black/[0.02] p-5">
                    <div className="absolute left-0 top-4 bottom-4 w-[3px] rounded-full bg-warning" />
                    <div className="pl-4">
                      <div className="flex items-start justify-between gap-3 mb-1">
                        <h4 className="font-semibold text-text-primary text-[15px]">{imp.area}</h4>
                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border capitalize ${PRIORITY_STYLES[imp.priority] || PRIORITY_STYLES.medium}`}>
                          {t(`github.priority.${imp.priority}`) || imp.priority}
                        </span>
                      </div>
                      <p className="text-sm text-text-secondary mb-2">{imp.description}</p>
                      <div className="flex items-start gap-2 text-xs text-primary">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                        <span>{imp.actionable}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Project Idea */}
          {analysis.projectIdea?.name && (
            <div className="rounded-2xl border-2 border-primary/20 bg-primary/[0.03] p-6">
              <h3 className="text-base font-semibold text-text-primary mb-1 flex items-center gap-2">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="16"/><line x1="8" y1="12" x2="16" y2="12"/></svg>
                {t('github.projectIdea') || 'Recommended Project'}
              </h3>
              <h4 className="text-lg font-bold text-primary mb-3">{analysis.projectIdea.name}</h4>

              {/* Tech stack pills */}
              <div className="flex flex-wrap gap-2 mb-3">
                {analysis.projectIdea.techStack?.map((tech, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-primary/[0.08] border border-primary/15 text-primary font-medium">
                    {tech}
                  </span>
                ))}
              </div>

              <p className="text-sm text-text-secondary mb-4">{analysis.projectIdea.description}</p>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-medium text-text-primary">{t('github.whyRelevant') || 'Why This Helps'}:</span>{' '}
                  <span className="text-text-secondary">{analysis.projectIdea.whyRelevant}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-text-primary">{t('github.estimatedTime') || 'Estimated Time'}:</span>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-black/[0.04] border border-black/[0.08] text-text-secondary font-medium">
                    {analysis.projectIdea.estimatedTime}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
