'use client';

import { useTranslation } from '@/lib/i18n';

export type DashboardTab = 'profile' | 'analyses' | 'jobs';

interface DashboardTabsProps {
  activeTab: DashboardTab;
  onTabChange: (tab: DashboardTab) => void;
  analysesCount: number;
  jobsCount: number;
  hasProfile: boolean;
}

const TABS: { id: DashboardTab; icon: React.ReactNode }[] = [
  {
    id: 'profile',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
  {
    id: 'analyses',
    icon: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
      </svg>
    ),
  },
];

export default function DashboardTabs({
  activeTab,
  onTabChange,
  analysesCount,
  jobsCount,
  hasProfile,
}: DashboardTabsProps) {
  const { t } = useTranslation();

  const getCount = (id: DashboardTab): number | null => {
    if (id === 'analyses' && analysesCount > 0) return analysesCount;
    if (id === 'jobs' && jobsCount > 0) return jobsCount;
    return null;
  };

  return (
    <div className="flex items-center gap-1 bg-black/[0.03] border border-black/[0.08] rounded-xl p-1 mb-6">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id;
        const count = getCount(tab.id);

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-white text-primary shadow-sm border border-black/[0.06]'
                : 'text-text-tertiary hover:text-text-secondary'
            }`}
          >
            {tab.icon}
            <span>{t(`dashboard.tabs.${tab.id}`)}</span>
            {count !== null && (
              <span className={`text-xs px-1.5 py-0.5 rounded-md ${
                isActive ? 'bg-primary/10 text-primary' : 'bg-black/[0.04] text-text-tertiary'
              }`}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
