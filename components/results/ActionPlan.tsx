'use client';

import { useState } from 'react';
import type { ActionPlan as ActionPlanType, ActionItem } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface ActionPlanProps {
  plan: ActionPlanType;
}

const TAB_KEYS = ['thirtyDays', 'ninetyDays', 'twelveMonths'] as const;

const TAB_META = [
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>, color: '#EF4444' },
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>, color: '#EAB308' },
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, color: '#22C55E' },
];

const PRIORITY_STYLES: Record<string, string> = {
  critical: 'bg-danger/10 text-danger border-danger/15',
  high: 'bg-warning/10 text-warning border-warning/15',
  medium: 'bg-primary/10 text-primary border-primary/15',
};

export default function ActionPlan({ plan }: ActionPlanProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<keyof ActionPlanType>('thirtyDays');

  const items = plan[activeTab];
  const activeIdx = TAB_KEYS.indexOf(activeTab as typeof TAB_KEYS[number]);

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary font-display">{t('results.actionPlan.title')}</h2>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 p-1 bg-white/[0.02] border border-white/[0.06] rounded-xl w-fit">
        {TAB_KEYS.map((key, idx) => {
          const count = plan[key].length;
          const label = t(`results.actionPlan.tabs.${key}`);
          const isActive = activeTab === key;
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-white/[0.08] text-text-primary shadow-sm'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.03]'
              }`}
            >
              <span className={`transition-colors duration-200 ${isActive ? '' : 'opacity-50'}`} style={{ color: isActive ? TAB_META[idx].color : undefined }}>
                {TAB_META[idx].icon}
              </span>
              <span className="hidden sm:inline">{label}</span>
              <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${isActive ? 'bg-white/[0.1]' : 'bg-white/[0.04]'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      {/* Items */}
      <div className="space-y-3">
        {items.map((item: ActionItem, i: number) => (
          <div key={i} className="relative rounded-2xl border border-white/[0.06] bg-white/[0.02] p-5 transition-all duration-300 hover:bg-white/[0.04] hover:border-white/[0.1]">
            <div className="flex items-start gap-4">
              {/* Step number */}
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                style={{ backgroundColor: `${TAB_META[activeIdx].color}12`, color: TAB_META[activeIdx].color }}
              >
                {i + 1}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center flex-wrap gap-2 mb-1.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${PRIORITY_STYLES[item.priority] || PRIORITY_STYLES.medium}`}>{item.priority}</span>
                  <span className="text-xs text-text-tertiary">{item.timeEstimate}</span>
                </div>
                <p className="text-text-primary font-medium leading-relaxed text-[15px]">{item.action}</p>
                <div className="flex items-center gap-1.5 mt-2.5 text-sm text-text-tertiary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  {item.resource}
                </div>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-success/80">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="7" y1="17" x2="17" y2="7"/><polyline points="7 7 17 7 17 17"/></svg>
                  {item.expectedImpact}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
