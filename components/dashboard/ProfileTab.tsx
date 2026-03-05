'use client';

import { useState, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTranslation } from '@/lib/i18n';
import { useAuth } from '@/lib/auth/context';
import QuotaBar from '@/components/shared/QuotaBar';
import UpgradePrompt from '@/components/shared/UpgradePrompt';
import type { CareerProfile, UserQuotaStatus } from '@/lib/types';

interface SavedAnalysis {
  id: string;
  target_role: string;
  current_role: string;
  country: string;
  fit_score: number;
  fit_label: string;
  cv_filename: string | null;
  language: string;
  created_at: string;
}

interface ProfileTabProps {
  profile: CareerProfile | null;
  onProfileUpdate: () => void;
  quota: UserQuotaStatus | null;
  quotaLoading?: boolean;
  recentAnalyses?: SavedAnalysis[];
  onOpenAnalysis?: (id: string) => void;
}

const CONTEXT_EXAMPLES = [
  'I took a 6-month career break in 2023 to complete AWS Solutions Architect certification and build 3 full-stack projects on GitHub.',
  'I freelanced for 8 months between jobs — built React dashboards for 2 startups and a data pipeline project using Python/Airflow.',
  'I transitioned from teaching to tech in 2022. During the gap, I completed a coding bootcamp and contributed to 2 open-source projects.',
  'I worked part-time as a consultant while studying for my PMP certification. Not reflected on LinkedIn but I managed 3 client projects.',
];

function DetailCard({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="bg-black/[0.03] border border-black/[0.06] rounded-xl p-4">
      <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1">{label}</p>
      <p className="text-sm font-semibold text-text-primary">{value || '—'}</p>
    </div>
  );
}

function DocumentCard({
  label,
  filename,
  onReplace,
  onRemove,
  isUploading,
}: {
  label: string;
  filename: string | null;
  onReplace: (file: File) => void;
  onRemove: () => void;
  isUploading: boolean;
}) {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type === 'application/pdf') onReplace(file);
  }, [onReplace]);

  return (
    <div
      className="bg-black/[0.03] border border-black/[0.06] rounded-xl p-4 border-dashed"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center text-primary flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider">{label}</p>
            {filename ? (
              <p className="text-sm font-medium text-text-primary truncate">{filename}</p>
            ) : (
              <p className="text-sm text-text-tertiary italic">{t('profile.noFile')}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={() => inputRef.current?.click()}
            disabled={isUploading}
            className="text-xs text-primary font-medium px-2.5 py-1.5 rounded-lg hover:bg-primary/[0.06] transition-colors disabled:opacity-50"
          >
            {isUploading ? '...' : filename ? t('profile.replace') : t('profile.upload')}
          </button>
          {filename && (
            <button
              onClick={onRemove}
              disabled={isUploading}
              className="text-xs text-text-tertiary hover:text-danger px-1.5 py-1.5 rounded-lg hover:bg-danger/[0.06] transition-colors disabled:opacity-50"
            >
              {t('common.remove')}
            </button>
          )}
          <input
            ref={inputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onReplace(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>
    </div>
  );
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 7 ? 'text-success bg-success/10 border-success/20'
    : score >= 5 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : 'text-danger bg-danger/10 border-danger/20';

  return (
    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-lg border text-sm font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function ProfileTab({
  profile,
  onProfileUpdate,
  quota,
  quotaLoading,
  recentAnalyses = [],
  onOpenAnalysis,
}: ProfileTabProps) {
  const { t } = useTranslation();
  const { session } = useAuth();
  const router = useRouter();
  const [jobDescription, setJobDescription] = useState('');
  const [additionalContext, setAdditionalContext] = useState(profile?.additionalContext || '');
  const [isUploading, setIsUploading] = useState(false);
  const [contextSaving, setContextSaving] = useState(false);
  const [contextSaved, setContextSaved] = useState(false);
  const [showExamples, setShowExamples] = useState(false);

  // Sync additionalContext when profile changes
  const profileContextRef = useRef(profile?.additionalContext);
  if (profile?.additionalContext !== profileContextRef.current) {
    profileContextRef.current = profile?.additionalContext;
    if (profile?.additionalContext != null) {
      setAdditionalContext(profile.additionalContext);
    }
  }

  const randomExample = useMemo(() => {
    return CONTEXT_EXAMPLES[Math.floor(Math.random() * CONTEXT_EXAMPLES.length)];
  }, []);

  const handleDocumentReplace = useCallback(async (type: 'cv' | 'linkedin', file: File) => {
    if (!session?.access_token || !profile) return;
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('profile', JSON.stringify({}));
      formData.append(type, file);

      await fetch('/api/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      onProfileUpdate();
    } catch {
      // Non-critical
    } finally {
      setIsUploading(false);
    }
  }, [session?.access_token, profile, onProfileUpdate]);

  const handleDocumentRemove = useCallback(async (type: 'cv' | 'linkedin') => {
    if (!session?.access_token) return;
    setIsUploading(true);
    try {
      const clearFields: Record<string, null> = {};
      if (type === 'cv') {
        clearFields.cvFilename = null;
      } else {
        clearFields.linkedinFilename = null;
      }
      const formData = new FormData();
      formData.append('profile', JSON.stringify(clearFields));

      await fetch('/api/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      onProfileUpdate();
    } catch {
      // Non-critical
    } finally {
      setIsUploading(false);
    }
  }, [session?.access_token, onProfileUpdate]);

  const handleSaveContext = useCallback(async () => {
    if (!session?.access_token) return;
    setContextSaving(true);
    try {
      const formData = new FormData();
      formData.append('profile', JSON.stringify({ additionalContext: additionalContext.trim() || null }));

      await fetch('/api/profile', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${session.access_token}` },
        body: formData,
      });
      setContextSaved(true);
      setTimeout(() => setContextSaved(false), 2000);
      onProfileUpdate();
    } catch {
      // Non-critical
    } finally {
      setContextSaving(false);
    }
  }, [session?.access_token, additionalContext, onProfileUpdate]);

  const handleRunAnalysis = useCallback(() => {
    if (jobDescription.trim()) {
      sessionStorage.setItem('gapzero_job_description', jobDescription.trim());
    }
    router.push('/analyze?fromProfile=true');
  }, [jobDescription, router]);

  const canRunAnalysis = quota
    ? (quota.analysis.used < quota.analysis.limit || !quota.hasUsedInitialAnalysis)
    : true;

  // Empty state — no profile yet
  if (!profile) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-primary">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <p className="text-text-secondary mb-1">{t('profile.empty')}</p>
        <p className="text-text-tertiary text-sm mb-6">{t('profile.emptySubtitle')}</p>
        <Link href="/analyze" className="btn-primary text-sm">
          {t('profile.runFirstAnalysis')}
        </Link>
      </div>
    );
  }

  const workPrefLabel = profile.workPreference
    ? t(`questionnaire.workOptions.${profile.workPreference}`)
    : null;

  const recentThree = recentAnalyses.slice(0, 3);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Left column: Profile details + Documents + Context */}
      <div className="lg:col-span-2 space-y-6">
        {/* Career Details */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t('profile.careerDetails')}</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <DetailCard label={t('questionnaire.currentRole')} value={profile.currentRole} />
            <DetailCard label={t('questionnaire.targetRole')} value={profile.targetRole} />
            <DetailCard label={t('questionnaire.yearsExperience')} value={profile.yearsExperience != null ? String(profile.yearsExperience) : null} />
            <DetailCard label={t('questionnaire.country')} value={profile.country} />
            <DetailCard label={t('questionnaire.workPreference')} value={workPrefLabel} />
            {profile.githubUrl && (
              <DetailCard label="GitHub" value={profile.githubUrl} />
            )}
          </div>
        </div>

        {/* Documents */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t('profile.documents')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <DocumentCard
              label={t('profile.cvDocument')}
              filename={profile.cvFilename}
              onReplace={(file) => handleDocumentReplace('cv', file)}
              onRemove={() => handleDocumentRemove('cv')}
              isUploading={isUploading}
            />
            <DocumentCard
              label={t('profile.linkedinDocument')}
              filename={profile.linkedinFilename}
              onReplace={(file) => handleDocumentReplace('linkedin', file)}
              onRemove={() => handleDocumentRemove('linkedin')}
              isUploading={isUploading}
            />
          </div>
        </div>

        {/* Additional Context */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-text-primary">{t('profile.additionalContext')}</h3>
            <button
              onClick={() => setShowExamples(!showExamples)}
              className="text-xs text-primary font-medium hover:underline"
            >
              {showExamples ? t('profile.hideExamples') : t('profile.showExamples')}
            </button>
          </div>

          {showExamples && (
            <div className="bg-primary/[0.03] border border-primary/10 rounded-xl p-4 mb-3">
              <p className="text-xs font-medium text-primary mb-2">{t('profile.examplesTitle')}</p>
              <ul className="space-y-2">
                {CONTEXT_EXAMPLES.map((ex, i) => (
                  <li key={i} className="text-xs text-text-secondary leading-relaxed flex gap-2">
                    <span className="text-primary/40 flex-shrink-0 mt-0.5">&bull;</span>
                    <span>{ex}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5">
            <p className="text-sm text-text-secondary mb-3">{t('profile.contextHint')}</p>
            <textarea
              value={additionalContext}
              onChange={(e) => {
                setAdditionalContext(e.target.value);
                setContextSaved(false);
              }}
              placeholder={randomExample}
              className="w-full h-28 bg-white border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary/60 resize-none focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
              maxLength={5000}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-[11px] text-text-tertiary">
                {additionalContext.length}/5000
              </span>
              <button
                onClick={handleSaveContext}
                disabled={contextSaving || additionalContext === (profile.additionalContext || '')}
                className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors disabled:opacity-40 bg-primary/[0.06] text-primary hover:bg-primary/[0.1] disabled:hover:bg-primary/[0.06]"
              >
                {contextSaving ? '...' : contextSaved ? t('profile.contextSaved') : t('profile.saveContext')}
              </button>
            </div>
          </div>
        </div>

        {/* Quick Re-Analysis */}
        <div>
          <h3 className="text-sm font-semibold text-text-primary mb-3">{t('profile.quickAnalysis')}</h3>
          <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5">
            <p className="text-sm text-text-secondary mb-3">{t('profile.quickAnalysisHint')}</p>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={t('profile.jobDescriptionPlaceholder')}
              className="w-full h-24 bg-white border border-black/[0.08] rounded-xl px-4 py-3 text-sm text-text-primary placeholder:text-text-tertiary resize-none focus:outline-none focus:border-primary/30 focus:ring-2 focus:ring-primary/10 transition-all"
            />
            <div className="flex items-center justify-between mt-3">
              <p className="text-xs text-text-tertiary">{t('profile.usesStoredProfile')}</p>
              <button
                onClick={handleRunAnalysis}
                disabled={!canRunAnalysis}
                className="btn-primary text-sm flex items-center gap-2 disabled:opacity-50"
                title={!canRunAnalysis ? t('quota.limitReached') : undefined}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                {t('profile.runAnalysis')}
              </button>
            </div>
            {!canRunAnalysis && quota?.plan === 'free' && (
              <p className="text-xs text-danger mt-2">
                {t('quota.weeklyLimitReached')} <Link href="/pricing" className="text-primary underline">{t('quota.upgradePro')}</Link>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Right column: Quota + Recent Analyses + Upgrade */}
      <div className="space-y-6">
        {/* Quota Bar */}
        <QuotaBar quota={quota} loading={quotaLoading} />

        {/* Recent Analyses */}
        {recentThree.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-text-primary mb-3">{t('profile.recentAnalyses')}</h3>
            <div className="space-y-2">
              {recentThree.map((a) => (
                <button
                  key={a.id}
                  onClick={() => onOpenAnalysis?.(a.id)}
                  className="w-full text-left bg-black/[0.03] border border-black/[0.06] rounded-xl p-3 hover:border-primary/20 hover:bg-black/[0.04] transition-all"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-text-primary truncate">{a.target_role}</p>
                      <p className="text-[11px] text-text-tertiary mt-0.5">
                        {new Date(a.created_at).toLocaleDateString(undefined, {
                          month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <ScoreBadge score={a.fit_score} />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Upgrade Prompt for free users */}
        {quota?.plan === 'free' && <UpgradePrompt />}
      </div>
    </div>
  );
}
