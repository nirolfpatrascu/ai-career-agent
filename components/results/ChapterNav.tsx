'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

export interface Tab {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'fit-score', labelKey: 'results.fitScore.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'strengths', labelKey: 'results.strengths.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  { id: 'gaps', labelKey: 'results.gaps.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> },
  { id: 'action-plan', labelKey: 'results.actionPlan.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'roles', labelKey: 'results.roles.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'salary', labelKey: 'results.salary.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
  { id: 'linkedin', labelKey: 'linkedin.title', icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
];

const JOB_MATCH_TAB: Tab = {
  id: 'job-match',
  labelKey: 'results.jobMatch.title',
  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
};

const COACH_TAB: Tab = {
  id: 'ai-coach',
  labelKey: 'chat.title',
  icon: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

interface ChapterNavProps {
  hasJobMatch?: boolean;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ChapterNav({ hasJobMatch, activeTab, onTabChange }: ChapterNavProps) {
  const { t } = useTranslation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const activeRefDesktop = useRef<HTMLButtonElement>(null);
  const activeRefMobile = useRef<HTMLButtonElement>(null);

  const tabs: Tab[] = useMemo(() => [
    ...TABS,
    ...(hasJobMatch ? [JOB_MATCH_TAB] : []),
    COACH_TAB,
  ], [hasJobMatch]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  // Scroll active tab into view
  useEffect(() => {
    [activeRefDesktop.current, activeRefMobile.current].forEach(btn => {
      if (!btn) return;
      const container = btn.closest('[role="tablist"]') as HTMLElement | null;
      if (!container) return;
      const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
    });
  }, [activeTab]);

  const handleTabClick = useCallback((tabId: string) => {
    onTabChange(tabId);
  }, [onTabChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(activeIndex + 1, tabs.length - 1);
      onTabChange(tabs[next].id);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(activeIndex - 1, 0);
      onTabChange(tabs[prev].id);
    }
  }, [activeIndex, tabs, onTabChange]);

  return (
    <>
      {/* ===== DESKTOP TAB BAR (below header) ===== */}
      <nav className="hidden sm:block fixed top-16 left-0 right-0 z-40 no-print bg-background/80 backdrop-blur-xl border-b border-white/[0.08]">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Analysis sections"
            className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2"
            onKeyDown={handleKeyDown}
          >
            {tabs.map((tab, i) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  ref={isActive ? activeRefDesktop : undefined}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`tabpanel-${tab.id}`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/[0.10]'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.06]'
                  }`}
                >
                  <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : ''}`}>
                    {tab.icon}
                  </span>
                  <span>{t(tab.labelKey)}</span>
                  {isActive && (
                    <span className="lg:hidden ml-1 text-xs text-primary/60 tabular-nums">
                      {i + 1}/{tabs.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 no-print bg-background/90 backdrop-blur-xl border-t border-white/[0.10] safe-bottom">
        <div
          role="tablist"
          aria-label="Analysis sections"
          className="flex overflow-x-auto scrollbar-none px-2 py-2 gap-1"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeRefMobile : undefined}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1 min-w-[60px] px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary/[0.10]'
                    : 'text-text-tertiary'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-primary' : ''}`}>
                  {tab.icon}
                </span>
                <span className="truncate max-w-[64px]">{t(tab.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export const DEFAULT_TAB = 'fit-score';