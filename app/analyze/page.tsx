'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import WizardFlow from '@/components/analyze/WizardFlow';
import StreamingProgress from '@/components/analyze/StreamingProgress';
import { useStreamingAnalysis } from '@/lib/hooks/useStreamingAnalysis';
import FitScoreGauge from '@/components/results/FitScore';
import StrengthsPanel from '@/components/results/StrengthsPanel';
import GapsPanel from '@/components/results/GapsPanel';
import RoleRecommendations from '@/components/results/RoleRecommendations';
import ActionPlan from '@/components/results/ActionPlan';
import SalaryBenchmark from '@/components/results/SalaryBenchmark';
import JobMatchPanel from '@/components/results/JobMatchPanel';
import PDFReport from '@/components/shared/PDFReport';
import ChatPanel from '@/components/results/ChatPanel';
import ChapterNav from '@/components/results/ChapterNav';
import { getSampleAnalysis } from '@/lib/demo';
import { useTranslation } from '@/lib/i18n';
import type { AnalysisResult, CareerQuestionnaire } from '@/lib/types';

type AppState = 'upload' | 'processing' | 'results' | 'error';

export default function AnalyzePage() {
  const { t, locale } = useTranslation();
  const [state, setState] = useState<AppState>('upload');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isDemo, setIsDemo] = useState(false);

  // Streaming analysis hook
  const streaming = useStreamingAnalysis();

  // React to streaming completion
  useEffect(() => {
    if (streaming.result) {
      setResult(streaming.result);
      setState('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [streaming.result]);

  // React to streaming error
  useEffect(() => {
    if (streaming.error && state === 'processing') {
      setError(streaming.error);
      setState('upload');
    }
  }, [streaming.error, state]);

  // Auto-trigger demo mode if ?demo=true
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      handleDemo();
      window.history.replaceState({}, '', '/analyze');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Wizard submit ---
  const handleWizardSubmit = useCallback(({ linkedInFile, cvFile, questionnaire }: {
    linkedInFile: File | null;
    cvFile: File | null;
    questionnaire: CareerQuestionnaire;
  }) => {
    setState('processing');
    setError('');
    setIsDemo(false);

    const formData = new FormData();
    const primaryFile = cvFile || linkedInFile;
    formData.append('cv', primaryFile!);

    if (cvFile && linkedInFile) {
      formData.append('linkedInPdf', linkedInFile);
    }

    formData.append('questionnaire', JSON.stringify({
      ...questionnaire,
      language: locale,
    }));

    streaming.startAnalysis(formData);
  }, [locale, streaming]);

  // --- Demo ---
  const handleDemo = useCallback(() => {
    setIsDemo(true);
    const sample = getSampleAnalysis(locale);
    setResult(sample);
    setState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [locale]);

  // --- Reset ---
  const handleReset = useCallback(() => {
    setState('upload');
    setResult(null);
    setError('');
    setIsDemo(false);
    streaming.reset();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [streaming]);

  // ==========================================================================
  // PROCESSING STATE
  // ==========================================================================
  if (state === 'processing') {
    return (
      <ErrorBoundary>
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6">
          <StreamingProgress
            currentStep={streaming.currentStep}
          />
        </main>
      </ErrorBoundary>
    );
  }

  // ==========================================================================
  // RESULTS STATE (Action Plan first — #6 from feature list)
  // ==========================================================================
  if (state === 'results' && result) {
    return (
      <ErrorBoundary>
        <Header />
        <ChapterNav hasJobMatch={!!result.jobMatch} />
        <main className="pt-24 pb-12 px-4 sm:px-6">
          <div className="max-w-container mx-auto space-y-12">
            {/* Demo banner */}
            {isDemo && (
              <div className="flex items-center justify-between bg-primary/[0.06] border border-primary/15 rounded-2xl px-5 py-3 text-sm">
                <span className="text-text-secondary">
                  👆 {t('analyze.demoNotice')}
                </span>
                <Link href="/analyze" className="text-primary font-medium hover:text-primary-light transition-colors">
                  {t('analyze.uploadOwn')} →
                </Link>
              </div>
            )}

            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">
                  {t('analyze.yourAnalysis')}
                </h1>
                <p className="text-text-tertiary mt-1.5 text-sm">
                  {t('analyze.target')}: {result.metadata.targetRole} • {result.metadata.country} •{' '}
                  {new Date(result.metadata.analyzedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap">
                <PDFReport result={result} />
                <button onClick={handleReset} className="btn-secondary text-sm flex items-center gap-2">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="1 4 1 10 7 10" />
                    <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
                  </svg>
                  {t('common.newAnalysis')}
                </button>
              </div>
            </div>

            {/* Sections — Action Plan FIRST (#6 from feature list) */}
            <div id="action-plan" className="scroll-mt-24">
              <ActionPlan plan={result.actionPlan} />
            </div>
            <div id="gaps" className="scroll-mt-24">
              <GapsPanel gaps={result.gaps} />
            </div>
            <div id="fit-score" className="scroll-mt-24">
              <FitScoreGauge fitScore={result.fitScore} />
            </div>
            <div id="strengths" className="scroll-mt-24">
              <StrengthsPanel strengths={result.strengths} />
            </div>
            <div id="roles" className="scroll-mt-24">
              <RoleRecommendations roles={result.roleRecommendations} />
            </div>
            <div id="salary" className="scroll-mt-24">
              <SalaryBenchmark salary={result.salaryAnalysis} />
            </div>
            {result.jobMatch && (
              <div id="job-match" className="scroll-mt-24">
                <JobMatchPanel match={result.jobMatch} />
              </div>
            )}

            <div id="ai-coach" className="scroll-mt-24">
              <ChatPanel analysis={result} />
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-8 pb-4">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border border-white/[0.10] bg-white/[0.05]">
                <p className="text-text-tertiary text-sm">
                  {t('analyze.wantDifferent')}
                </p>
                <button onClick={handleReset} className="btn-primary text-sm">
                  {t('common.startNewAnalysis')}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </ErrorBoundary>
    );
  }

  // ==========================================================================
  // UPLOAD STATE — WIZARD FLOW
  // ==========================================================================
  return (
    <ErrorBoundary>
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-container mx-auto">
          {/* Page header */}
          <div className="text-center mb-10">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-6"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t('common.backToHome')}
            </Link>
            <h1 className="text-2xl sm:text-3xl font-bold text-white font-display mb-2">
              {t('analyze.title')}
            </h1>
            <p className="text-text-secondary text-sm sm:text-base">
              {t('analyze.subtitle')}
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="max-w-3xl mx-auto mb-6 bg-danger/[0.06] border border-danger/15 rounded-2xl p-4 flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <div>
                <p className="text-danger font-medium">{t('analyze.analysisFailed')}</p>
                <p className="text-danger/80 text-sm mt-0.5">{error}</p>
              </div>
              <button onClick={() => setError('')} className="text-danger/60 hover:text-danger ml-auto">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}

          <WizardFlow onSubmit={handleWizardSubmit} onDemo={handleDemo} />
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}