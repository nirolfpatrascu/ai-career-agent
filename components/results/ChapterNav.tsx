'use client';

import { useRef, useEffect, useCallback, useMemo } from 'react';
import { useTranslation } from '@/lib/i18n';

export interface Tab {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

const TABS: Tab[] = [
  { id: 'fit-score', labelKey: 'results.fitScore.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'linkedin', labelKey: 'linkedin.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="#0A66C2"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg> },
  { id: 'cv-optimizer', labelKey: 'nav.cvOptimizer', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><path d="m9 15 2 2 4-4"/></svg> },
  { id: 'strengths-gaps', labelKey: 'results.strengthsGaps.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" opacity="0.4"/></svg> },
  { id: 'action-plan', labelKey: 'results.actionPlan.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'roles', labelKey: 'results.roles.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'salary', labelKey: 'results.salary.title', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
];

const UPWORK_TAB: Tab = {
  id: 'upwork',
  labelKey: 'nav.upwork',
  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>,
};

const COVER_LETTER_TAB: Tab = {
  id: 'cover-letter',
  labelKey: 'nav.coverLetter',
  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
};

const GITHUB_TAB: Tab = {
  id: 'github-analysis',
  labelKey: 'nav.githubAnalysis',
  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>,
};

const COACH_TAB: Tab = {
  id: 'ai-coach',
  labelKey: 'chat.title',
  icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

interface ChapterNavProps {
  hasUpwork?: boolean;
  hasCoverLetter?: boolean;
  hasGitHub?: boolean;
  hasJobMatch?: boolean;
  showCoach?: boolean;
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function ChapterNav({ hasUpwork, hasCoverLetter, hasGitHub, hasJobMatch, showCoach, activeTab, onTabChange }: ChapterNavProps) {
  const { t } = useTranslation();
  const activeRefMobile = useRef<HTMLButtonElement>(null);

  const tabs: Tab[] = useMemo(() => {
    const result = [...TABS];
    // Rename first tab when a job match score is present
    if (hasJobMatch) {
      result[0] = { ...result[0], labelKey: 'results.fitScore.jobMatch.title' };
    }
    // Insert cover letter after cv-optimizer
    if (hasCoverLetter) {
      const cvIdx = result.findIndex(tab => tab.id === 'cv-optimizer');
      result.splice(cvIdx + 1, 0, COVER_LETTER_TAB);
    }
    // Insert GitHub analysis after cover letter (or after cv-optimizer if no cover letter)
    if (hasGitHub) {
      const insertAfter = hasCoverLetter ? 'cover-letter' : 'cv-optimizer';
      const idx = result.findIndex(tab => tab.id === insertAfter);
      result.splice(idx + 1, 0, GITHUB_TAB);
    }
    if (hasUpwork) result.push(UPWORK_TAB);
    if (showCoach) result.push(COACH_TAB);
    return result;
  }, [hasUpwork, hasCoverLetter, hasGitHub, hasJobMatch, showCoach]);

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  useEffect(() => {
    const btn = activeRefMobile.current;
    if (!btn) return;
    const container = btn.closest('[role="tablist"]') as HTMLElement | null;
    if (!container) return;
    const scrollLeft = btn.offsetLeft - container.offsetWidth / 2 + btn.offsetWidth / 2;
    container.scrollTo({ left: scrollLeft, behavior: 'smooth' });
  }, [activeTab]);

  const handleTabClick = useCallback((tabId: string) => {
    onTabChange(tabId);
  }, [onTabChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      e.preventDefault();
      const next = Math.min(activeIndex + 1, tabs.length - 1);
      onTabChange(tabs[next].id);
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = Math.max(activeIndex - 1, 0);
      onTabChange(tabs[prev].id);
    }
  }, [activeIndex, tabs, onTabChange]);

  return (
    <>
      {/* ===== DESKTOP VERTICAL SIDEBAR ===== */}
      <aside className="hidden lg:flex fixed top-20 left-0 bottom-0 w-56 z-40 no-print flex-col bg-white/80 backdrop-blur-xl border-r border-black/[0.06]">
        <nav
          role="tablist"
          aria-label="Analysis sections"
          className="flex flex-col gap-1 p-3 flex-1 overflow-y-auto"
          onKeyDown={handleKeyDown}
        >
          {tabs.map((tab, i) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                className={`relative flex items-center gap-3 w-full px-3.5 py-3 rounded-xl text-sm font-medium text-left transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary/[0.08] shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary hover:bg-black/[0.03]'
                }`}
              >
                <span className={`flex-shrink-0 transition-colors duration-200 ${isActive ? 'text-primary' : ''}`}>
                  {tab.icon}
                </span>
                <span className="truncate">{t(tab.labelKey)}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                )}
              </button>
            );
          })}
        </nav>
      </aside>

      {/* ===== TABLET HORIZONTAL BAR (sm-lg) ===== */}
      <nav className="hidden sm:block lg:hidden fixed top-16 left-0 right-0 z-40 no-print bg-white/85 backdrop-blur-xl border-b border-black/[0.06]">
        <div className="max-w-container mx-auto px-4 sm:px-6">
          <div
            role="tablist"
            aria-label="Analysis sections"
            className="flex items-center gap-1 overflow-x-auto scrollbar-none py-2"
            onKeyDown={handleKeyDown}
          >
            {tabs.map((tab) => {
              const isActive = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => handleTabClick(tab.id)}
                  className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'text-primary bg-primary/[0.10]'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-black/[0.04]'
                  }`}
                >
                  <span className={`flex-shrink-0 ${isActive ? 'text-primary' : ''}`}>{tab.icon}</span>
                  <span>{t(tab.labelKey)}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* ===== MOBILE BOTTOM TAB BAR ===== */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 z-50 no-print bg-white/90 backdrop-blur-xl border-t border-black/[0.08] safe-bottom">
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
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleTabClick(tab.id)}
                className={`flex flex-col items-center gap-1 min-w-[60px] px-3 py-2 rounded-xl text-[11px] font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'text-primary bg-primary/[0.10]'
                    : 'text-text-tertiary'
                }`}
              >
                <span className={`transition-colors ${isActive ? 'text-primary' : ''}`}>{tab.icon}</span>
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