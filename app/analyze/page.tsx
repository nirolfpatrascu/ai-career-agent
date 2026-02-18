'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import DocumentUpload from '@/components/analyze/DocumentUpload';
import Questionnaire from '@/components/analyze/Questionnaire';
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
  const [cvFile, setCVFile] = useState<File | null>(null);
  const [linkedInFile, setLinkedInFile] = useState<File | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [detecting, setDetecting] = useState(false);
  const [autoDetected, setAutoDetected] = useState<string>('');
  const [questionnaire, setQuestionnaire] = useState<CareerQuestionnaire>({
    currentRole: '',
    targetRole: '',
    yearsExperience: 0,
    country: '',
    workPreference: 'remote',
  });

  // Streaming analysis hook
  const streaming = useStreamingAnalysis();

  // React to streaming completion → show results
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

  // Auto-trigger demo mode if ?demo=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      handleDemo();
      window.history.replaceState({}, '', '/analyze');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const hasFile = cvFile || linkedInFile;

  const isFormValid =
    hasFile &&
    questionnaire.currentRole.trim() &&
    questionnaire.targetRole.trim() &&
    questionnaire.yearsExperience > 0 &&
    questionnaire.country;

  // Auto-detect profile from LinkedIn PDF upload
  const handleLinkedInSelect = useCallback(async (selectedFile: File | null) => {
    setLinkedInFile(selectedFile);
    setAutoDetected('');

    if (!selectedFile) return;

    setDetecting(true);
    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);

      const response = await fetch('/api/detect-profile', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        setDetecting(false);
        return;
      }

      const data = await response.json();

      if (data.isLinkedIn) {
        // Auto-fill only empty fields — don't overwrite user input
        setQuestionnaire((prev) => ({
          ...prev,
          ...(data.currentRole && !prev.currentRole ? { currentRole: data.currentRole } : {}),
          ...(data.yearsExperience > 0 && !prev.yearsExperience ? { yearsExperience: data.yearsExperience } : {}),
          ...(data.country && !prev.country ? { country: data.country } : {}),
        }));

        const parts: string[] = [];
        if (data.currentRole) parts.push(data.currentRole);
        if (data.yearsExperience > 0) parts.push(`${data.yearsExperience} yrs`);
        if (data.country) parts.push(data.country);
        setAutoDetected(data.summary || parts.join(' · '));
      }
    } catch {
      // Non-critical — silently fail
    } finally {
      setDetecting(false);
    }
  }, []);

  // Also auto-detect from CV uploads (works for any structured PDF)
  const handleCVSelect = useCallback(async (selectedFile: File | null) => {
    setCVFile(selectedFile);

    // Only auto-detect from CV if no LinkedIn file and no detection yet
    if (!selectedFile || linkedInFile || autoDetected) return;

    setDetecting(true);
    try {
      const formData = new FormData();
      formData.append('cv', selectedFile);

      const response = await fetch('/api/detect-profile', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.isLinkedIn) {
          setQuestionnaire((prev) => ({
            ...prev,
            ...(data.currentRole && !prev.currentRole ? { currentRole: data.currentRole } : {}),
            ...(data.yearsExperience > 0 && !prev.yearsExperience ? { yearsExperience: data.yearsExperience } : {}),
            ...(data.country && !prev.country ? { country: data.country } : {}),
          }));

          const parts: string[] = [];
          if (data.currentRole) parts.push(data.currentRole);
          if (data.yearsExperience > 0) parts.push(`${data.yearsExperience} yrs`);
          if (data.country) parts.push(data.country);
          setAutoDetected(data.summary || parts.join(' · '));
        }
      }
    } catch {
      // Non-critical
    } finally {
      setDetecting(false);
    }
  }, [linkedInFile, autoDetected]);

  const handleAnalyze = useCallback(async () => {
    if (!hasFile || !isFormValid) return;

    setState('processing');
    setError('');
    setIsDemo(false);

    const formData = new FormData();

    // Primary file for analysis: prefer CV, fall back to LinkedIn PDF
    const primaryFile = cvFile || linkedInFile;
    formData.append('cv', primaryFile!);

    // If both files exist, also send LinkedIn PDF for enrichment
    if (cvFile && linkedInFile) {
      formData.append('linkedInPdf', linkedInFile);
    }

    formData.append('questionnaire', JSON.stringify({
      ...questionnaire,
      language: locale,
    }));

    streaming.startAnalysis(formData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasFile, cvFile, linkedInFile, isFormValid, questionnaire, locale, streaming.startAnalysis]);

  const handleDemo = useCallback(() => {
    setResult(getSampleAnalysis(locale));
    setIsDemo(true);
    setState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [locale]);

  const handleReset = useCallback(() => {
    setState('upload');
    setResult(null);
    setCVFile(null);
    setLinkedInFile(null);
    setError('');
    setIsDemo(false);
    setAutoDetected('');
    streaming.reset();
    setQuestionnaire({
      currentRole: '',
      targetRole: '',
      yearsExperience: 0,
      country: '',
      workPreference: 'remote',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streaming.reset]);

  // --- PROCESSING STATE ---
  if (state === 'processing') {
    return <StreamingProgress currentStep={streaming.currentStep} />;
  }

  // --- RESULTS STATE ---
  if (state === 'results' && result) {
    return (
      <ErrorBoundary>
        <Header />
        <ChapterNav hasJobMatch={!!result.jobMatch} />
        <main className="pt-24 pb-20 px-4 sm:px-6">
          <div className="max-w-container mx-auto space-y-12">
            {/* Demo banner */}
            {isDemo && (
              <div className="bg-primary/[0.06] border border-primary/15 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👋</span>
                  <p className="text-primary text-sm font-medium">
                    {t('analyze.demoBanner')}
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm font-medium text-primary hover:text-primary-light transition-colors underline underline-offset-2 sm:ml-auto"
                >
                  {t('analyze.uploadOwn')} →
                </button>
              </div>
            )}

            {/* Results header */}
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

            {/* Sections with IDs for ChapterNav */}
            <div id="fit-score" className="scroll-mt-24">
              <FitScoreGauge fitScore={result.fitScore} />
            </div>
            <div id="strengths" className="scroll-mt-24">
              <StrengthsPanel strengths={result.strengths} />
            </div>
            <div id="gaps" className="scroll-mt-24">
              <GapsPanel gaps={result.gaps} />
            </div>
            <div id="roles" className="scroll-mt-24">
              <RoleRecommendations roles={result.roleRecommendations} />
            </div>
            <div id="action-plan" className="scroll-mt-24">
              <ActionPlan plan={result.actionPlan} />
            </div>
            <div id="salary" className="scroll-mt-24">
              <SalaryBenchmark salary={result.salaryAnalysis} />
            </div>
            {result.jobMatch && (
              <div id="job-match" className="scroll-mt-24">
                <JobMatchPanel match={result.jobMatch} />
              </div>
            )}

            {/* AI Career Coach Chat */}
            <div id="ai-coach" className="scroll-mt-24">
              <ChatPanel analysis={result} />
            </div>

            {/* Bottom CTA */}
            <div className="text-center pt-8 pb-4">
              <div className="inline-flex flex-col items-center gap-4 px-8 py-6 rounded-2xl border border-white/[0.06] bg-white/[0.02]">
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

  // --- UPLOAD STATE ---
  return (
    <ErrorBoundary>
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6">
        <div className="max-w-container mx-auto">
          {/* Page header */}
          <div className="mb-8">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-primary transition-colors mb-4"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
              {t('common.backToHome')}
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">
                  {t('analyze.title')}
                </h1>
                <p className="text-text-tertiary mt-2 text-sm sm:text-base">
                  {t('analyze.subtitle')}
                </p>
              </div>
              <button
                onClick={handleDemo}
                className="btn-secondary text-sm whitespace-nowrap flex items-center gap-2 self-start"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                {t('common.tryDemo')}
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 bg-danger/[0.06] border border-danger/15 rounded-2xl p-4 flex items-start gap-3">
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

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Document Upload */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6 lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2 font-display">
                  <span className="w-6 h-6 rounded-md bg-primary/[0.08] border border-primary/15 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  {t('analyze.uploadDocs')}
                </h2>
                <p className="text-xs text-text-secondary mb-5">
                  {t('analyze.uploadDocsHint')}
                </p>
                <DocumentUpload
                  linkedInFile={linkedInFile}
                  cvFile={cvFile}
                  onLinkedInSelect={handleLinkedInSelect}
                  onCVSelect={handleCVSelect}
                  detecting={detecting}
                  autoDetected={autoDetected}
                  onDismissDetection={() => setAutoDetected('')}
                />
              </div>
            </div>

            {/* Right: Questionnaire */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-6">
                <h2 className="text-lg font-semibold text-text-primary mb-1 flex items-center gap-2 font-display">
                  <span className="w-6 h-6 rounded-md bg-primary/[0.08] border border-primary/15 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  {t('analyze.careerDetails')}
                </h2>
                <p className="text-xs text-text-secondary mb-5">
                  {autoDetected
                    ? t('analyze.preFilled')
                    : t('analyze.tellUsGoals')}
                </p>
                <Questionnaire data={questionnaire} onChange={setQuestionnaire} />
              </div>
            </div>
          </div>

          {/* Analyze button */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className="group btn-primary text-base sm:text-lg px-8 sm:px-12 py-4 flex items-center gap-3 disabled:shadow-none w-full sm:w-auto justify-center rounded-2xl"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              {t('common.analyzeMyCareer')}
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            {!isFormValid && (
              <p className="text-sm text-text-secondary text-center">
                {!hasFile
                  ? t('analyze.uploadAtLeastOne')
                  : t('analyze.fillFields')}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
