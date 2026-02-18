'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import CVUpload from '@/components/analyze/CVUpload';
import LinkedInImport from '@/components/analyze/LinkedInImport';
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
import { useTranslation } from '@/lib/i18n';
import type { AnalysisResult, CareerQuestionnaire } from '@/lib/types';

type AppState = 'upload' | 'processing' | 'results' | 'error';

export default function AnalyzePage() {
  const { t, locale } = useTranslation();
  const [state, setState] = useState<AppState>('upload');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [file, setFile] = useState<File | null>(null);
  const [isDemo, setIsDemo] = useState(false);
  const [linkedInOpen, setLinkedInOpen] = useState(false);
  const [linkedInText, setLinkedInText] = useState<string>('');
  const [detecting, setDetecting] = useState(false);
  const [autoDetected, setAutoDetected] = useState<string>('');
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

  // Auto-detect LinkedIn / structured CV when a PDF is uploaded
  const handleFileSelect = useCallback(async (selectedFile: File | null) => {
    setFile(selectedFile);
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
        // Auto-fill only empty fields — don't overwrite if user already typed something
        setQuestionnaire((prev) => ({
          ...prev,
          ...(data.currentRole && !prev.currentRole ? { currentRole: data.currentRole } : {}),
          ...(data.yearsExperience > 0 && !prev.yearsExperience ? { yearsExperience: data.yearsExperience } : {}),
          ...(data.country && !prev.country ? { country: data.country } : {}),
        }));

        // Build a summary of what was detected
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

  const handleAnalyze = useCallback(async () => {
    if (!file || !isFormValid) return;

    setState('processing');
    setError('');
    setIsDemo(false);

    try {
      const formData = new FormData();
      formData.append('cv', file);
      formData.append('questionnaire', JSON.stringify({
        ...questionnaire,
        language: locale,
        ...(linkedInText && { linkedInProfile: linkedInText }),
      }));

      const response = await fetch('/api/analyze', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || t('analyze.somethingWrong'));
      }

      const data: AnalysisResult = await response.json();
      setResult(data);
      setState('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setError(err instanceof Error ? err.message : t('analyze.somethingWrong'));
      setState('error');
    }
  }, [file, isFormValid, questionnaire, locale, linkedInText, t]);

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
    setAutoDetected('');
    setLinkedInText('');
    setQuestionnaire({
      currentRole: '',
      targetRole: '',
      yearsExperience: 0,
      country: '',
      workPreference: 'remote',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleLinkedInApply = useCallback(
    (updates: Partial<CareerQuestionnaire>, profileText: string) => {
      setQuestionnaire((prev) => ({ ...prev, ...updates }));
      setLinkedInText(profileText);
    },
    []
  );

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
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {t('analyze.yourAnalysis')}
                </h1>
                <p className="text-text-secondary mt-1 text-sm sm:text-base">
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

            <FitScoreGauge fitScore={result.fitScore} />
            <StrengthsPanel strengths={result.strengths} />
            <GapsPanel gaps={result.gaps} />
            <RoleRecommendations roles={result.roleRecommendations} />
            <ActionPlan plan={result.actionPlan} />
            <SalaryBenchmark salary={result.salaryAnalysis} />
            {result.jobMatch && <JobMatchPanel match={result.jobMatch} />}

            {/* Bottom CTA */}
            <div className="text-center pt-8 pb-4">
              <div className="card inline-flex flex-col items-center gap-4 px-8 py-6">
                <p className="text-text-secondary text-sm">
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
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  {t('analyze.title')}
                </h1>
                <p className="text-text-secondary mt-2 text-sm sm:text-base">
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
            <div className="mb-6 bg-danger/10 border border-danger/20 rounded-xl p-4 flex items-start gap-3">
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
            <div className="lg:col-span-2">
              <div className="card lg:sticky lg:top-24">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                  {t('analyze.uploadCV')}
                </h2>
                <CVUpload file={file} onFileSelect={handleFileSelect} />

                {/* Auto-detection banner */}
                {detecting && (
                  <div className="mt-3 flex items-center gap-2 px-3 py-2.5 bg-primary/5 border border-primary/10 rounded-lg animate-pulse">
                    <svg className="animate-spin w-4 h-4 text-primary flex-shrink-0" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span className="text-sm text-primary">Detecting profile details...</span>
                  </div>
                )}

                {autoDetected && !detecting && (
                  <div className="mt-3 flex items-start gap-2.5 px-3 py-2.5 bg-success/5 border border-success/20 rounded-lg">
                    <div className="w-5 h-5 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-success font-medium">Profile detected — form pre-filled</p>
                      <p className="text-xs text-text-secondary mt-0.5 truncate">{autoDetected}</p>
                    </div>
                    <button
                      onClick={() => setAutoDetected('')}
                      className="text-text-secondary hover:text-text-primary ml-auto flex-shrink-0 p-0.5"
                      aria-label="Dismiss"
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                    </button>
                  </div>
                )}

                {/* LinkedIn Import */}
                <div className="mt-4 pt-4 border-t border-card-border">
                  {linkedInText ? (
                    <div className="flex items-center justify-between bg-[#0A66C2]/5 border border-[#0A66C2]/20 rounded-lg px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2">
                          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                        </svg>
                        <span className="text-sm text-[#0A66C2] font-medium">LinkedIn profile imported</span>
                      </div>
                      <button
                        onClick={() => { setLinkedInText(''); }}
                        className="text-xs text-text-secondary hover:text-danger transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setLinkedInOpen(true)}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-card-border bg-background text-sm text-text-secondary hover:border-[#0A66C2]/50 hover:text-[#0A66C2] transition-all duration-200"
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Import from LinkedIn
                    </button>
                  )}
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="card">
                <h2 className="text-lg font-semibold text-text-primary mb-5 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                  {t('analyze.careerDetails')}
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
              {t('common.analyzeMyCareer')}
              <svg className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
            {!isFormValid && (
              <p className="text-sm text-text-secondary text-center">
                {!file ? t('analyze.uploadToContinue') : t('analyze.fillFields')}
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
      <LinkedInImport
        isOpen={linkedInOpen}
        onClose={() => setLinkedInOpen(false)}
        onApply={handleLinkedInApply}
      />
    </ErrorBoundary>
  );
}