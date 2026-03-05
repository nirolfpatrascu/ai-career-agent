'use client';

import { useTranslation } from '@/lib/i18n';
import type { UserQuotaStatus } from '@/lib/types';

interface QuotaBarProps {
  quota: UserQuotaStatus | null;
  loading?: boolean;
}

function UsageRow({
  label,
  used,
  limit,
}: {
  label: string;
  used: number;
  limit: number;
}) {
  const pct = limit > 0 ? Math.min((used / limit) * 100, 100) : 0;
  const isExhausted = used >= limit;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-text-secondary font-medium">{label}</span>
        <span className={`font-semibold ${isExhausted ? 'text-danger' : 'text-text-primary'}`}>
          {used}/{limit}
        </span>
      </div>
      <div className="h-1.5 bg-black/[0.06] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-300 ${
            isExhausted ? 'bg-danger' : pct >= 80 ? 'bg-amber-400' : 'bg-primary'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

export default function QuotaBar({ quota, loading }: QuotaBarProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5 animate-pulse">
        <div className="h-4 bg-black/[0.04] rounded w-1/3 mb-4" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 bg-black/[0.03] rounded w-2/3" />
              <div className="h-1.5 bg-black/[0.04] rounded-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!quota) return null;

  const resetDate = new Date(quota.resetAt);
  const resetLabel = resetDate.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-text-primary">
          {t('quota.weeklyUsage')}
        </h3>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
          quota.plan === 'pro'
            ? 'bg-primary/10 text-primary'
            : 'bg-black/[0.04] text-text-tertiary'
        }`}>
          {quota.plan === 'pro' ? 'Pro' : t('common.free')}
        </span>
      </div>

      <div className="space-y-3">
        <UsageRow
          label={t('quota.analyses')}
          used={quota.analysis.used}
          limit={quota.analysis.limit}
        />
        <UsageRow
          label={t('quota.cvGenerations')}
          used={quota.cvGeneration.used}
          limit={quota.cvGeneration.limit}
        />
        <UsageRow
          label={t('quota.coverLetters')}
          used={quota.coverLetter.used}
          limit={quota.coverLetter.limit}
        />
        <UsageRow
          label={t('quota.coachSessions')}
          used={quota.coachRequest.used}
          limit={quota.coachRequest.limit}
        />
      </div>

      <p className="text-[11px] text-text-tertiary mt-3">
        {t('quota.resetsOn', { date: resetLabel })}
      </p>
    </div>
  );
}
