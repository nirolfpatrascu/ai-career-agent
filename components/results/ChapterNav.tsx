'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useTranslation } from '@/lib/i18n';

interface Chapter {
  id: string;
  labelKey: string;
  icon: React.ReactNode;
}

const makeIcon = (d: string) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d={d} /></svg>
);

const CHAPTERS: Chapter[] = [
  { id: 'fit-score', labelKey: 'results.fitScore.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
  { id: 'strengths', labelKey: 'results.strengths.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> },
  { id: 'gaps', labelKey: 'results.gaps.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg> },
  { id: 'roles', labelKey: 'results.roles.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg> },
  { id: 'action-plan', labelKey: 'results.actionPlan.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> },
  { id: 'salary', labelKey: 'results.salary.title', icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg> },
];

const JOB_MATCH_CHAPTER: Chapter = {
  id: 'job-match',
  labelKey: 'results.jobMatch.title',
  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
};

const COACH_CHAPTER: Chapter = {
  id: 'ai-coach',
  labelKey: 'chat.title',
  icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>,
};

interface ChapterNavProps {
  hasJobMatch?: boolean;
}

export default function ChapterNav({ hasJobMatch }: ChapterNavProps) {
  const { t } = useTranslation();
  const [activeId, setActiveId] = useState('fit-score');
  const [isOpen, setIsOpen] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);

  const chapters = [
    ...CHAPTERS,
    ...(hasJobMatch ? [JOB_MATCH_CHAPTER] : []),
    COACH_CHAPTER,
  ];

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: '-100px 0px -60% 0px', threshold: 0.1 }
    );

    const timer = setTimeout(() => {
      chapters.forEach((ch) => {
        const el = document.getElementById(ch.id);
        if (el) observerRef.current?.observe(el);
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      observerRef.current?.disconnect();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasJobMatch]);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setActiveId(id);
    }
    setIsOpen(false);
  }, []);

  const activeChapter = chapters.find((c) => c.id === activeId);
  const activeIndex = chapters.findIndex((c) => c.id === activeId);

  return (
    <>
      {/* ===== DESKTOP SIDEBAR ===== */}
      <nav className="hidden xl:block fixed left-[max(1rem,calc((100vw-1200px)/2-210px))] top-1/2 -translate-y-1/2 w-[180px] z-40 no-print">
        <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-2xl p-2 backdrop-blur-sm">
          {chapters.map((ch, i) => (
            <button
              key={ch.id}
              onClick={() => scrollTo(ch.id)}
              className={`w-full flex items-center gap-2.5 py-2.5 px-3 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
                ch.id === activeId
                  ? 'text-primary bg-primary/[0.08] font-medium'
                  : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.03]'
              }`}
            >
              <span className={`flex-shrink-0 transition-colors duration-200 ${ch.id === activeId ? 'text-primary' : 'text-text-tertiary'}`}>
                {ch.icon}
              </span>
              <span className="truncate">{t(ch.labelKey)}</span>
            </button>
          ))}

          {/* Progress indicator */}
          <div className="absolute left-0 top-2 bottom-2 w-[3px] rounded-full overflow-hidden">
            <div className="w-full bg-white/[0.04] h-full rounded-full" />
            <div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-primary to-accent-cyan rounded-full transition-all duration-500 ease-out"
              style={{ height: `${((activeIndex + 1) / chapters.length) * 100}%` }}
            />
          </div>
        </div>
      </nav>

      {/* ===== MOBILE FLOATING BAR ===== */}
      <div className="xl:hidden fixed bottom-4 left-4 right-4 z-50 no-print">
        {!isOpen && (
          <button
            onClick={() => setIsOpen(true)}
            className="w-full flex items-center justify-between gap-3 bg-background/80 backdrop-blur-xl border border-white/[0.08] rounded-2xl px-4 py-3 shadow-xl shadow-black/30"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-primary">{activeChapter?.icon}</span>
              <span className="text-sm font-medium text-text-primary truncate">
                {activeChapter ? t(activeChapter.labelKey) : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs text-text-tertiary font-medium tabular-nums">
                {activeIndex + 1}/{chapters.length}
              </span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-text-tertiary">
                <polyline points="18 15 12 9 6 15" />
              </svg>
            </div>
          </button>
        )}

        {isOpen && (
          <div className="bg-background/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-3 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between mb-2.5 px-2">
              <span className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider">
                Chapters
              </span>
              <button onClick={() => setIsOpen(false)} className="text-text-tertiary hover:text-text-secondary p-1">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-1">
              {chapters.map((ch) => (
                <button
                  key={ch.id}
                  onClick={() => scrollTo(ch.id)}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all ${
                    ch.id === activeId
                      ? 'bg-primary/[0.08] text-primary font-medium'
                      : 'text-text-tertiary hover:text-text-secondary hover:bg-white/[0.03]'
                  }`}
                >
                  <span className="flex-shrink-0">{ch.icon}</span>
                  <span className="truncate">{t(ch.labelKey)}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
