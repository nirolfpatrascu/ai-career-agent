'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import CVUpload from '@/components/analyze/CVUpload';
import Questionnaire from '@/components/analyze/Questionnaire';
import AnalysisProgress from '@/components/analyze/AnalysisProgress';
import FitScoreGauge from '@/components/results/FitScore';
import StrengthsPanel from '@/components/results/StrengthsPanel';
import GapsPanel from '@/components/results/GapsPanel';
import RoleRecommendations from '@/components/results/RoleRecommendations';
import ActionPlan from '@/components/results/ActionPlan';
import SalaryBenchmark from '@/components/results/SalaryBenchmark';
import JobMatchPanel from '@/components/results/JobMatchPanel';
import PDFReport from '@/components/shared/PDFReport';
import { SAMPLE_ANALYSIS } from '@/lib/demo';
import type { AnalysisResult, CareerQuestionnaire } from '@/lib/types';

type AppState = 'upload' | 'processing' | 'results' | 'error';

export default function AnalyzePage() {
  const [state, setState] = useState<AppState>('upload');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<CareerQuestionnaire>({
    currentRole: '',
    targetRole: '',
    yearsExperience: 0,
    country: '',
    workPreference: 'remote',
  });

  // Auto-trigger demo mode if ?demo=true is in URL
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === 'true') {
      handleDemo();
      // Clean the URL
      window.history.replaceState({}, '', '/analyze');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isFormValid =
    file &&
    questionnaire.currentRole.trim() &&
    questionnaire.targetRole.trim() &&
    questionnaire.yearsExperience > 0 &&
    questionnaire.country;

  const handleAnalyze = useCallback(async () => {
    if (!file || !isFormValid) return;

    setState('processing');
    setError('');
    setIsDemo(false);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('questionnaire', JSON.stringify(questionnaire));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Analysis failed. Please try again.');
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setState('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
      setState('error');
    }
  }, [file, isFormValid, questionnaire]);

  const handleDemo = useCallback(() => {
    setResult(SAMPLE_ANALYSIS);
    setIsDemo(true);
    setState('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleReset = useCallback(() => {
    setState('upload');
    setResult(null);
    setFile(null);
    setError('');
    setIsDemo(false);
    setQuestionnaire({
      currentRole: '',
      targetRole: '',
      yearsExperience: 0,
      country: '',
      workPreference: 'remote',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // --- PROCESSING STATE ---
  if (state === 'processing') {
    return <AnalysisProgress />;
  }

  // --- RESULTS STATE ---
  if (state === 'results' && result) {
    return (
      <ErrorBoundary>
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6">
          <div className="max-w-container mx-auto space-y-10">
            {/* Demo banner */}
            {isDemo && (
              <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">👋</span>
                  <p className="text-primary text-sm font-medium">
                    This is a demo analysis using sample data.
                  </p>
                </div>
                <button
                  onClick={handleReset}
                  className="text-sm font-medium text-primary hover:text-primary-light transition-colors underline underline-offset-2 sm:ml-auto"
                >
                  Upload your own CV →
                </button>
              </div>
            )}

            {/* Results header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Your Career Analysis
                </h1>
                <p className="text-text-secondary mt-1 text-sm sm:text-base">
                  Target: {result.metadata.targetRole} • {result.metadata.country} •{' '}
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
                  New Analysis
                </button>
              </div>
            </div>

            {/* Fit Score */}
            <FitScoreGauge fitScore={result.fitScore} />

            {/* Strengths */}
            <StrengthsPanel strengths={result.strengths} />

            {/* Gaps */}
            <GapsPanel gaps={result.gaps} />

            {/* Role Recommendations */}
            <RoleRecommendations roles={result.roleRecommendations} />

            {/* Action Plan */}
            <ActionPlan plan={result.actionPlan} />

            {/* Salary Analysis */}
            <SalaryBenchmark salary={result.salaryAnalysis} />

            {/* Job Match (if available) */}
            {result.jobMatch && <JobMatchPanel match={result.jobMatch} />}

            {/* Bottom CTA */}
            <div className="text-center pt-8 pb-4">
              <div className="card inline-flex flex-col items-center gap-4 px-8 py-6">
                <p className="text-text-secondary text-sm">
                  Want to analyze a different career path?
                </p>
                <button onClick={handleReset} className="btn-primary text-sm">
                  Start New Analysis
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
              Back to home
            </Link>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Analyze Your Career
                </h1>
                <p className="text-text-secondary mt-2 text-sm sm:text-base">
                  Upload your CV and tell us about your career goals. We&apos;ll generate
                  a comprehensive analysis in about 60 seconds.
                </p>
              </div>
              <button
                onClick={handleDemo}
                className="btn-secondary text-sm whitespace-nowrap flex items-center gap-2 self-start"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
                Try Demo
              </button>
            </div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="mb-6 bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
              <div>
                <p className="text-danger font-medium">Analysis Failed</p>
                <p className="text-danger/80 text-sm mt-0.5">{error}</p>
              </div>
              <button
                onClick={() => setError('')}
                className="text-danger/60 hover:text-danger ml-auto"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          )}

          {/* Two-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Left: Upload */}
            <div className="lg:col-span-2">
              <div className="card lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  Upload CV
                </h2>
                <CVUpload file={file} onFileSelect={setFile} />
              </div>
            </div>

            {/* Right: Questionnaire */}
            <div className="lg:col-span-3">
              <div className="card">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  Career Details
                </h2>
                <Questionnaire data={questionnaire} onChange={setQuestionnaire} />
              </div>
            </div>
          </div>

          {/* Analyze button */}
          <div className="mt-8 flex flex-col items-center gap-3">
            <button
              onClick={handleAnalyze}
              disabled={!isFormValid}
              className="group btn-primary text-base sm:text-lg px-8 sm:px-12 py-4 flex items-center gap-3 shadow-lg shadow-primary/20 disabled:shadow-none w-full sm:w-auto justify-center"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
              </svg>
              Analyze My Career
              <svg
                className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            {!isFormValid && (
              <p className="text-sm text-text-secondary text-center">
                {!file
                  ? 'Upload your CV to continue'
                  : 'Fill in all required fields to continue'}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </ErrorBoundary>
  );
}
