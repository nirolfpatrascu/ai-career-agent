'use client';

import Header from '@/components/shared/Header';
import Footer from '@/components/shared/Footer';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import JobTrackerContent from '@/components/jobs/JobTrackerContent';

export default function JobTrackerPage() {
  const { t } = useTranslation();
  const { user, loading: authLoading } = useAuth();

  // Not logged in
  if (!authLoading && !user) {
    return (
      <>
        <Header />
        <main className="pt-24 pb-12 px-4 sm:px-6 min-h-screen">
          <div className="max-w-container mx-auto">
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
                <svg
                  width="28"
                  height="28"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <line x1="3" y1="9" x2="21" y2="9" />
                  <line x1="9" y1="21" x2="9" y2="9" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-text-primary font-display mb-3">
                {t('jobs.signInRequired')}
              </h1>
              <p className="text-text-secondary text-sm mb-6 max-w-md mx-auto">
                {t('jobs.signInDescription')}
              </p>
              <p className="text-sm text-text-tertiary">
                {t('jobs.useSignIn')}
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
          <JobTrackerContent />
        </div>
      </main>
      <Footer />
    </>
  );
}
