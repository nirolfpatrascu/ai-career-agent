'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface UpgradePromptProps {
  compact?: boolean;
}

export default function UpgradePrompt({ compact }: UpgradePromptProps) {
  const { t } = useTranslation();

  if (compact) {
    return (
      <Link
        href="/pricing"
        className="flex items-center gap-2 text-xs text-primary font-medium px-3 py-2 rounded-xl bg-primary/[0.06] hover:bg-primary/[0.1] transition-colors"
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        {t('quota.upgradePro')}
      </Link>
    );
  }

  return (
    <div className="bg-gradient-to-br from-primary/[0.06] to-primary/[0.02] border border-primary/15 rounded-2xl p-5">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-text-primary mb-1">
            {t('quota.upgradeTitle')}
          </h4>
          <p className="text-xs text-text-secondary mb-3">
            {t('quota.upgradeDescription')}
          </p>
          <Link
            href="/pricing"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-white bg-primary hover:bg-primary/90 px-3.5 py-2 rounded-lg transition-colors"
          >
            {t('quota.viewPlans')}
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
