'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import Link from 'next/link';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import WizardFlow from '@/components/analyze/WizardFlow';
import StreamingProgress from '@/components/analyze/StreamingProgress';
import { useStreamingAnalysis } from '@/lib/hooks/useStreamingAnalysis';
import FitScoreGauge from '@/components/results/FitScore';
import StrengthsGapsPanel from '@/components/results/StrengthsGapsPanel';
import RoleRecommendations from '@/components/results/RoleRecommendations';
import ActionPlan from '@/components/results/ActionPlan';
import SalaryBenchmark from '@/components/results/SalaryBenchmark';
import JobMatchPanel from '@/components/results/JobMatchPanel';
import PDFReport from '@/components/shared/PDFReport';
import ChatPanel from '@/components/results/ChatPanel';
import { CVOptimizerPanel } from '@/components/results/CVOptimizerPanel';
import LinkedInPlan from '@/components/results/LinkedInPlan';
import UpworkPanel from '@/components/results/UpworkPanel';
import CoverLetterPanel from '@/components/results/CoverLetterPanel';
import GitHubAnalysisPanel from '@/components/results/GitHubAnalysisPanel';
import ChapterNav, { DEFAULT_TAB } from '@/components/results/ChapterNav';
import SectionIntro from '@/components/results/SectionIntro';
import { getSampleAnalysis } from '@/lib/demo';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/lib/auth/context';
import { useTags } from '@/lib/hooks/useTags';
import type { AnalysisResult, CareerQuestionnaire, CareerProfileInput, UpworkProfile, UpworkProfileAnalysis } from '@/lib/types';

type AppState = 'upload' | 'processing' | 'results' | 'error';

export default function AnalyzePage() {
  const { t, locale } = useTranslation();
  const { user, session } = useAuth();
  const [state, setState] = useState<AppState>('upload');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string>('');
  const [isDemo, setIsDemo] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [analysisId, setAnalysisId] = useState<string | undefined>(undefined);
  const { tags, addTag, removeTag } = useTags(analysisId);
  const [upworkProfile, setUpworkProfile] = useState<UpworkProfile | null>(null);
  const [upworkAnalysis, setUpworkAnalysis] = useState<UpworkProfileAnalysis | null>(null);
  const [upworkAnalyzing, setUpworkAnalyzing] = useState(false);
  const [githubUrl, setGithubUrl] = useState<string | null>(null);
  const [hasRealCV, setHasRealCV] = useState(false);

  // Store wizard files + questionnaire for profile persistence
  const wizardDataRef = useRef<{
    cvFile: File | null;
    linkedInFile: File | null;
    questionnaire: CareerQuestionnaire | null;
  }>({ cvFile: null, linkedInFile: null, questionnaire: null });

  // Streaming analysis hook
  const streaming = useStreamingAnalysis();

  // React to streaming completion — save if logged in
  useEffect(() => {
    if (streaming.result) {
      const enrichedResult = {
        ...streaming.result,
        metadata: { ...streaming.result.metadata, hasRealCV },
      };
      setResult(enrichedResult);
      setState('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Auto-save if user is logged in
      if (session?.access_token) {
        setSaveStatus('saving');
        fetch('/api/analyses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ result: enrichedResult }),
        })
          .then(async res => {
            if (res.ok) {
              const data = await res.json();
              setSaveStatus('saved');
              if (data.id) setAnalysisId(data.id);
            } else {
              setSaveStatus('error');
            }
          })
          .catch(() => setSaveStatus('error'));

        // Save career profile for persistence
        const wd = wizardDataRef.current;
        if (wd.questionnaire) {
          const profileInput: CareerProfileInput = {
            currentRole: wd.questionnaire.currentRole,
            targetRole: wd.questionnaire.targetRole,
            yearsExperience: wd.questionnaire.yearsExperience,
            country: wd.questionnaire.country,
            workPreference: wd.questionnaire.workPreference,
            githubUrl: wd.questionnaire.githubUrl,
            cvFilename: wd.cvFile?.name,
            linkedinFilename: wd.linkedInFile?.name,
            extractedProfile: enrichedResult.profile ?? undefined,
          };
          const profileFormData = new FormData();
          profileFormData.append('profile', JSON.stringify(profileInput));
          if (wd.cvFile) profileFormData.append('cv', wd.cvFile);
          if (wd.linkedInFile) profileFormData.append('linkedin', wd.linkedInFile);

          fetch('/api/profile', {
            method: 'PUT',
            headers: { Authorization: `Bearer ${session.access_token}` },
            body: profileFormData,
          }).catch(() => {
            // Profile save is non-critical
          });
        }
      }
    }
  }, [streaming.result, session?.access_token, hasRealCV]);

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
    // Load saved analysis if ?saved=<id>
    const savedId = params.get('saved');
    if (savedId && session?.access_token) {
      setState('processing');
      fetch(`/api/analyses/${savedId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      })
        .then(res => res.ok ? res.json() : Promise.reject('Not found'))
        .then(data => {
          if (data.analysis?.result) {
            setResult(data.analysis.result);
            setState('results');
            setSaveStatus('saved');
            setAnalysisId(savedId);
          }
        })
        .catch(() => {
          setState('upload');
          setError('Could not load saved analysis');
        });
      window.history.replaceState({}, '', '/analyze');
    }
    // Profile-aware re-analysis: fetch stored profile + documents, auto-start
    if (params.get('fromProfile') === 'true' && session?.access_token) {
      window.history.replaceState({}, '', '/analyze');
      setState('processing');

      (async () => {
        try {
          const profileRes = await fetch('/api/profile', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          });
          if (!profileRes.ok) throw new Error('No profile');
          const { profile: storedProfile } = await profileRes.json();
          if (!storedProfile) throw new Error('No profile');

          // Download stored CV (required) or LinkedIn PDF
          const { supabase } = await import('@/lib/supabase/client');
          let cvBlob: Blob | null = null;
          let linkedinBlob: Blob | null = null;

          if (storedProfile.cvStoragePath) {
            const { data } = await supabase.storage
              .from('user-documents')
              .download(storedProfile.cvStoragePath);
            if (data) cvBlob = data;
          }
          if (storedProfile.linkedinStoragePath) {
            const { data } = await supabase.storage
              .from('user-documents')
              .download(storedProfile.linkedinStoragePath);
            if (data) linkedinBlob = data;
          }

          if (!cvBlob && !linkedinBlob) throw new Error('No documents stored');

          const jobDescription = sessionStorage.getItem('gapzero_job_description') || '';
          sessionStorage.removeItem('gapzero_job_description');

          const questionnaire: CareerQuestionnaire = {
            currentRole: storedProfile.currentRole || '',
            targetRole: storedProfile.targetRole || '',
            yearsExperience: storedProfile.yearsExperience || 0,
            country: storedProfile.country || '',
            workPreference: storedProfile.workPreference || 'flexible',
            githubUrl: storedProfile.githubUrl || undefined,
            jobPosting: jobDescription || undefined,
            additionalContext: storedProfile.additionalContext || undefined,
            language: locale,
          };

          if (storedProfile.githubUrl) setGithubUrl(storedProfile.githubUrl);
          setHasRealCV(!!cvBlob);

          const formData = new FormData();
          const primaryFile = cvBlob
            ? new File([cvBlob], storedProfile.cvFilename || 'cv.pdf', { type: 'application/pdf' })
            : new File([linkedinBlob!], storedProfile.linkedinFilename || 'linkedin.pdf', { type: 'application/pdf' });
          formData.append('cv', primaryFile);

          if (cvBlob && linkedinBlob) {
            formData.append('linkedInPdf', new File([linkedinBlob], storedProfile.linkedinFilename || 'linkedin.pdf', { type: 'application/pdf' }));
          }

          formData.append('questionnaire', JSON.stringify(questionnaire));
          streaming.startAnalysis(formData);
        } catch {
          setState('upload');
          setError('Could not load stored profile. Please run the wizard manually.');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.access_token]);

  // --- Wizard submit ---
  const handleWizardSubmit = useCallback(({ linkedInFile, cvFile, questionnaire, upworkProfile: wizardUpwork }: {
    linkedInFile: File | null;
    cvFile: File | null;
    questionnaire: CareerQuestionnaire;
    upworkProfile?: UpworkProfile;
  }) => {
    if (wizardUpwork) setUpworkProfile(wizardUpwork);
    if (questionnaire.githubUrl) setGithubUrl(questionnaire.githubUrl);
    setHasRealCV(!!cvFile);
    wizardDataRef.current = { cvFile, linkedInFile, questionnaire };
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
    setActiveTab(DEFAULT_TAB);
    setSaveStatus('idle');
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
  // RESULTS STATE — Tabbed dashboard
  // ==========================================================================
  if (state === 'results' && result) {
    const fitScore = result.fitScore.score;
    const renderActiveTab = () => {
      switch (activeTab) {
        case 'fit-score':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-fit-score" aria-labelledby="tab-fit-score">
              <SectionIntro messageKey="motivation.fitScore" variant={fitScore >= 7 ? 'celebratory' : 'encouraging'} />
              <FitScoreGauge fitScore={result.fitScore} jobMatch={result.jobMatch} onNavigate={setActiveTab} analysisId={analysisId} tags={tags} onTagCreated={addTag} onTagDeleted={removeTag} />
            </div>
          );
        case 'strengths-gaps':
        case 'strengths':
        case 'gaps':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-strengths-gaps" aria-labelledby="tab-strengths-gaps">
              <SectionIntro messageKey="motivation.strengths" variant="celebratory" />
              <StrengthsGapsPanel strengths={result.strengths} gaps={result.gaps} analysisId={analysisId} tags={tags} onTagCreated={addTag} onTagDeleted={removeTag} />
            </div>
          );
        case 'action-plan':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-action-plan" aria-labelledby="tab-action-plan">
              <SectionIntro messageKey="motivation.actionPlan" variant="encouraging" />
              <ActionPlan plan={result.actionPlan} fitScore={result.fitScore.score} analysisId={analysisId} tags={tags} onTagCreated={addTag} onTagDeleted={removeTag} />
            </div>
          );
        case 'roles':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-roles" aria-labelledby="tab-roles">
              <SectionIntro messageKey="motivation.roles" variant="encouraging" />
              <RoleRecommendations roles={result.roleRecommendations} analysisId={analysisId} tags={tags} onTagCreated={addTag} onTagDeleted={removeTag} />
            </div>
          );
        case 'salary':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-salary" aria-labelledby="tab-salary">
              <SectionIntro messageKey="motivation.salary" variant="encouraging" />
              <SalaryBenchmark salary={result.salaryAnalysis} analysisId={analysisId} tags={tags} onTagCreated={addTag} onTagDeleted={removeTag} />
            </div>
          );
        case 'job-match':
          return result.jobMatch ? (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-job-match" aria-labelledby="tab-job-match">
              <SectionIntro messageKey="motivation.jobMatch" variant="encouraging" />
              <JobMatchPanel match={result.jobMatch} />
            </div>
          ) : null;
        case 'linkedin':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-linkedin" aria-labelledby="tab-linkedin">
              <SectionIntro messageKey="motivation.linkedin" variant="encouraging" />
              <LinkedInPlan analysis={result} />
            </div>
          );
        case 'cv-optimizer':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-cv-optimizer" aria-labelledby="tab-cv-optimizer">
              <SectionIntro messageKey="motivation.cvOptimizer" variant="encouraging" />
              <CVOptimizerPanel
                atsScore={result.atsScore}
                jobMatch={result.jobMatch}
                analysis={result}
              />
            </div>
          );
        case 'cover-letter':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-cover-letter" aria-labelledby="tab-cover-letter">
              <SectionIntro messageKey="motivation.coverLetter" variant="encouraging" />
              <CoverLetterPanel analysis={result} />
            </div>
          );
        case 'github-analysis':
          return githubUrl ? (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-github-analysis" aria-labelledby="tab-github-analysis">
              <SectionIntro messageKey="motivation.githubAnalysis" variant="encouraging" />
              <GitHubAnalysisPanel
                githubUrl={githubUrl}
                targetRole={result.metadata.targetRole}
                jobPosting={result.metadata.jobPosting}
              />
            </div>
          ) : null;
        case 'upwork':
          return upworkProfile ? (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-upwork" aria-labelledby="tab-upwork">
              <UpworkPanel
                profile={upworkProfile}
                analysis={upworkAnalysis}
                onAnalyze={async (targetNiche?: string) => {
                  setUpworkAnalyzing(true);
                  try {
                    const res = await fetch('/api/upwork/analyze', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ profile: upworkProfile, targetNiche }),
                    });
                    if (res.ok) {
                      const data = await res.json();
                      setUpworkAnalysis(data);
                    }
                  } catch {
                    // Non-critical
                  } finally {
                    setUpworkAnalyzing(false);
                  }
                }}
                analyzing={upworkAnalyzing}
              />
            </div>
          ) : null;
        case 'ai-coach':
          return (
            <div role="tabpanel" className="animate-panel-enter" id="tabpanel-ai-coach" aria-labelledby="tab-ai-coach">
              <ChatPanel analysis={result} />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <ErrorBoundary>
        <Header />
        <ChapterNav
          hasJobMatch={!!result.jobMatch}
          hasUpwork={!!upworkProfile}
          hasCoverLetter={!!result.metadata.jobPosting}
          hasGitHub={!!githubUrl}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
        {/* pt: sm has horizontal bar below header, lg has sidebar so only header offset */}
        <main className="pt-[7.5rem] lg:pt-24 pb-20 sm:pb-12 px-4 sm:px-6 min-h-screen lg:pl-60">
          <div className="max-w-4xl mx-auto lg:mx-0 lg:max-w-none">
            {/* Demo banner */}
            {isDemo && (
              <div className="flex items-center justify-between bg-primary/[0.06] border border-primary/15 rounded-2xl px-5 py-3 text-sm mb-6">
                <span className="text-text-secondary">
                  👆 {t('analyze.demoNotice')}
                </span>
                <Link href="/analyze" className="text-primary font-medium hover:text-primary-light transition-colors">
                  {t('analyze.uploadOwn')} →
                </Link>
              </div>
            )}

            {/* Header with metadata + actions */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">
                  {t('analyze.yourAnalysis')}
                </h1>
                <p className="text-text-tertiary mt-1.5 text-sm">
                  {t('analyze.target')}: {result.metadata.targetRole} • {result.metadata.country} •{' '}
                  {new Date(result.metadata.analyzedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex gap-3 flex-wrap items-center">
                {/* Save status */}
                {user && saveStatus !== 'idle' && (
                  <span className={`text-xs font-medium flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
                    saveStatus === 'saving' ? 'text-text-tertiary border-black/[0.06] bg-black/[0.03]' :
                    saveStatus === 'saved' ? 'text-success border-success/15 bg-success/[0.04]' :
                    'text-danger border-danger/15 bg-danger/[0.04]'
                  }`}>
                    {saveStatus === 'saving' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
                    )}
                    {saveStatus === 'saved' && (
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    )}
                    {saveStatus === 'error' && '⚠'}
                    {t(`auth.save${saveStatus.charAt(0).toUpperCase() + saveStatus.slice(1)}`)}
                  </span>
                )}
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

            {/* Active tab content — key forces re-mount for entrance animation */}
            <div key={activeTab}>
              {renderActiveTab()}
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
            <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display mb-2">
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