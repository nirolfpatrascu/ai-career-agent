'use client';

import { useState } from 'react';
import type { ActionPlan as ActionPlanType, ActionItem } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface ActionPlanProps {
  plan: ActionPlanType;
}

const TAB_KEYS = ['thirtyDays', 'ninetyDays', 'twelveMonths'] as const;
const TAB_ICONS = ['⚡', '📚', '🚀'];

const PRIORITY_STYLES = {
  critical: 'bg-danger/10 text-danger border-danger/20',
  high: 'bg-warning/10 text-warning border-warning/20',
  medium: 'bg-primary/10 text-primary border-primary/20',
};

export default function ActionPlan({ plan }: ActionPlanProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<keyof ActionPlanType>('thirtyDays');

  const items = plan[activeTab];

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">{t('results.actionPlan.title')}</h2>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        {TAB_KEYS.map((key, idx) => {
          const count = plan[key].length;
          const label = t(`results.actionPlan.tabs.${key}`);
          return (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === key
                  ? 'bg-primary/10 text-primary border border-primary/30'
                  : 'bg-card border border-card-border text-text-secondary hover:text-text-primary hover:border-primary/30'
              }`}
            >
              <span>{TAB_ICONS[idx]}</span>
              <span>{label}</span>
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeTab === key ? 'bg-primary/20' : 'bg-card-border'}`}>{count}</span>
            </button>
          );
        })}
      </div>

      <div className="space-y-3">
        {items.map((item: ActionItem, i: number) => (
          <div key={i} className="card hover:border-primary/20 transition-colors duration-200">
            <div className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-lg bg-background flex items-center justify-center text-sm font-semibold text-text-secondary flex-shrink-0">{i + 1}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full border capitalize ${PRIORITY_STYLES[item.priority]}`}>{item.priority}</span>
                  <span className="text-xs text-text-secondary">{item.timeEstimate}</span>
                </div>
                <p className="text-text-primary font-medium leading-relaxed">{item.action}</p>
                <div className="flex items-center gap-1.5 mt-2 text-sm text-text-secondary">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
                  {item.resource}
                </div>
                <p className="text-sm text-success mt-2">↗ {item.expectedImpact}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
