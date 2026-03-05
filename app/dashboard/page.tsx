'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import DashboardTabs, { type DashboardTab } from '@/components/dashboard/DashboardTabs';
import AnalysesTab from '@/components/dashboard/AnalysesTab';
import ProfileTab from '@/components/dashboard/ProfileTab';
import JobTrackerContent from '@/components/jobs/JobTrackerContent';
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

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, session, loading: authLoading } = useAuth();

  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [profile, setProfile] = useState<CareerProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [jobsCount, setJobsCount] = useState(0);
  const [quota, setQuota] = useState<UserQuotaStatus | null>(null);
  const [quotaLoading, setQuotaLoading] = useState(true);
  const [paymentBanner, setPaymentBanner] = useState<'success' | 'canceled' | null>(null);

  // Determine initial tab from URL or defaults
  const tabParam = searchParams.get('tab') as DashboardTab | null;
  const paymentParam = searchParams.get('payment');
  const [activeTab, setActiveTab] = useState<DashboardTab>(
    tabParam && ['profile', 'analyses', 'jobs'].includes(tabParam)
      ? tabParam
      : 'profile'
  );

  // Sync tab changes to URL
  const handleTabChange = useCallback((tab: DashboardTab) => {
    setActiveTab(tab);
    const url = tab === 'profile' ? '/dashboard' : `/dashboard?tab=${tab}`;
    window.history.replaceState({}, '', url);
  }, []);

  // Fetch career profile
  const fetchProfile = useCallback(async () => {
    if (!session?.access_token) return;
    setProfileLoading(true);
    try {
      const res = await fetch('/api/profile', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile || null);
      }
    } catch {
      // Non-critical
    } finally {
      setProfileLoading(false);
    }
  }, [session?.access_token]);

  // Fetch analyses
  const fetchAnalyses = useCallback(async () => {
    if (!session?.access_token) return;
    setLoading(true);
    try {
      const res = await fetch('/api/analyses', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setAnalyses(data.analyses || []);
      }
    } catch (err) {
      console.error('Failed to fetch analyses:', err);
    } finally {
      setLoading(false);
    }
  }, [session?.access_token]);

  // Fetch job count for tab badge
  const fetchJobsCount = useCallback(async () => {
    if (!session?.access_token) return;
    try {
      const res = await fetch('/api/jobs', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setJobsCount(data.stats?.total || data.jobs?.length || 0);
      }
    } catch {
      // Non-critical
    }
  }, [session?.access_token]);

  // Fetch quota status
  const fetchQuota = useCallback(async () => {
    if (!session?.access_token) return;
    setQuotaLoading(true);
    try {
      const res = await fetch('/api/quota', {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setQuota(data);
      }
    } catch {
      // Non-critical — quota bar just won't show
    } finally {
      setQuotaLoading(false);
    }
  }, [session?.access_token]);

  useEffect(() => {
    if (user && session) {
      fetchProfile();
      fetchAnalyses();
      fetchJobsCount();
      fetchQuota();
    } else if (!authLoading) {
      setLoading(false);
      setProfileLoading(false);
      setQuotaLoading(false);
    }
  }, [user, session, authLoading, fetchProfile, fetchAnalyses, fetchJobsCount, fetchQuota]);

  // Handle Stripe payment return params
  useEffect(() => {
    if (paymentParam === 'success' || paymentParam === 'canceled') {
      setPaymentBanner(paymentParam);
      // Clean URL params after reading
      window.history.replaceState({}, '', '/dashboard?tab=profile');
      // Auto-dismiss after 6 seconds
      const timer = setTimeout(() => setPaymentBanner(null), 6000);
      return () => clearTimeout(timer);
    }
  }, [paymentParam]);

  // Set smart default tab after data loads
  useEffect(() => {
    if (!tabParam && !loading && !profileLoading) {
      if (profile) {
        setActiveTab('profile');
      } else if (analyses.length > 0) {
        setActiveTab('analyses');
      } else {
        setActiveTab('profile');
      }
    }
  }, [tabParam, loading, profileLoading, profile, analyses.length]);

  // Delete analysis
  const handleDelete = useCallback(async (id: string) => {
    if (!session?.access_token) return;
    if (!confirm(t('dashboard.confirmDelete'))) return;

    setDeleting(id);
    try {
      const res = await fetch(`/api/analyses?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${session.access_token}` },
      });
      if (res.ok) {
        setAnalyses(prev => prev.filter(a => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete:', err);
    } finally {
      setDeleting(null);
    }
  }, [session?.access_token, t]);

  // Open saved analysis
  const handleOpen = useCallback((id: string) => {
    router.push(`/analyze?saved=${id}`);
  }, [router]);

  // Not logged in
  if (!authLoading && !user) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6 min-h-screen">
          <div className="max-w-container mx-auto">
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display mb-3">
                {t('dashboard.signInRequired')}
              </h1>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                {t('dashboard.signInDescription')}
              </p>
              <p className="text-sm text-text-tertiary">
                ↗ {t('dashboard.useSignIn')}
              </p>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="pt-24 pb-12 px-4 sm:px-6 min-h-screen">
        <div className="max-w-container mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary font-display">
                {t('dashboard.title')}
              </h1>
              <p className="text-text-tertiary mt-1 text-sm">
                {t('dashboard.subtitle', { count: String(analyses.length) })}
              </p>
            </div>
            <Link href="/analyze" className="btn-primary text-sm flex items-center gap-2">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              {t('common.newAnalysis')}
            </Link>
          </div>

          {/* Payment banner */}
          {paymentBanner === 'success' && (
            <div className="mb-4 flex items-center gap-3 bg-success/10 border border-success/20 rounded-xl px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-success flex-shrink-0">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
              <p className="text-sm text-success font-medium">{t('dashboard.paymentSuccess')}</p>
              <button onClick={() => setPaymentBanner(null)} className="ml-auto text-success/60 hover:text-success">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}
          {paymentBanner === 'canceled' && (
            <div className="mb-4 flex items-center gap-3 bg-amber-400/10 border border-amber-400/20 rounded-xl px-4 py-3">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-amber-400 flex-shrink-0">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-amber-600 font-medium">{t('dashboard.paymentCanceled')}</p>
              <button onClick={() => setPaymentBanner(null)} className="ml-auto text-amber-400/60 hover:text-amber-500">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
          )}

          {/* Tabs */}
          <DashboardTabs
            activeTab={activeTab}
            onTabChange={handleTabChange}
            analysesCount={analyses.length}
            jobsCount={jobsCount}
            hasProfile={!!profile}
          />

          {/* Tab content */}
          {activeTab === 'profile' && (
            <ProfileTab
              profile={profile}
              onProfileUpdate={fetchProfile}
              quota={quota}
              quotaLoading={quotaLoading}
              recentAnalyses={analyses}
              onOpenAnalysis={handleOpen}
            />
          )}

          {activeTab === 'analyses' && (
            <AnalysesTab
              analyses={analyses}
              loading={loading}
              onOpen={handleOpen}
              onDelete={handleDelete}
              deleting={deleting}
            />
          )}

          {activeTab === 'jobs' && (
            <JobTrackerContent />
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
