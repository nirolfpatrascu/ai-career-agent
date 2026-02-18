'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';

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

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 7 ? 'text-success bg-success/10 border-success/20'
    : score >= 5 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : 'text-danger bg-danger/10 border-danger/20';

  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border text-lg font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { user, session, loading: authLoading } = useAuth();
  const [analyses, setAnalyses] = useState<SavedAnalysis[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);

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

  useEffect(() => {
    if (user && session) {
      fetchAnalyses();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, session, authLoading, fetchAnalyses]);

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
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
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

          {/* Loading state */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 animate-pulse">
                  <div className="h-5 bg-white/[0.06] rounded w-3/4 mb-3" />
                  <div className="h-4 bg-white/[0.04] rounded w-1/2 mb-2" />
                  <div className="h-4 bg-white/[0.04] rounded w-1/3" />
                </div>
              ))}
            </div>
          )}

          {/* Empty state */}
          {!loading && analyses.length === 0 && (
            <div className="text-center py-16">
              <div className="w-14 h-14 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center mx-auto mb-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
                  <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
                </svg>
              </div>
              <p className="text-text-secondary mb-1">{t('dashboard.empty')}</p>
              <p className="text-text-tertiary text-sm mb-6">{t('dashboard.emptySubtitle')}</p>
              <Link href="/analyze" className="btn-primary text-sm">
                {t('dashboard.startFirst')}
              </Link>
            </div>
          )}

          {/* Analyses grid */}
          {!loading && analyses.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {analyses.map((a) => (
                <div
                  key={a.id}
                  className="group bg-white/[0.04] border border-white/[0.08] rounded-2xl p-5 hover:border-primary/20 hover:bg-white/[0.06] transition-all duration-200 cursor-pointer relative"
                  onClick={() => handleOpen(a.id)}
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-text-primary truncate">
                        {a.target_role}
                      </h3>
                      <p className="text-xs text-text-tertiary mt-0.5">
                        {a.country} • {new Date(a.created_at).toLocaleDateString(undefined, {
                          year: 'numeric', month: 'short', day: 'numeric'
                        })}
                      </p>
                    </div>
                    <ScoreBadge score={a.fit_score} />
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
                      a.fit_score >= 7 ? 'bg-success/10 text-success'
                      : a.fit_score >= 5 ? 'bg-amber-400/10 text-amber-400'
                      : 'bg-danger/10 text-danger'
                    }`}>
                      {a.fit_label}
                    </span>
                    {a.cv_filename && (
                      <span className="text-xs text-text-tertiary truncate max-w-[150px]">
                        📄 {a.cv_filename}
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                    <span className="text-xs text-primary font-medium group-hover:underline">
                      {t('dashboard.viewAnalysis')} →
                    </span>
                    <button
                      onClick={(e) => { e.stopPropagation(); handleDelete(a.id); }}
                      disabled={deleting === a.id}
                      className="text-text-tertiary hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/[0.06] disabled:opacity-50"
                      title={t('dashboard.delete')}
                    >
                      {deleting === a.id ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                          <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                        </svg>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}