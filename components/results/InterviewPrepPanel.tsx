'use client';

import { useState, useCallback } from 'react';
import type {
  InterviewPrep,
  TechnicalQuestion,
  BehavioralQuestion,
  SituationalQuestion,
  CultureQuestion,
  QuestionToAsk,
  MissingSkill,
  Strength,
  Gap,
  ExtractedProfile,
} from '@/lib/types';
import { FeedbackButton } from './FeedbackButton';

// ─── Props ───────────────────────────────────────────────────────────────────

interface InterviewPrepPanelProps {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: MissingSkill[];
  strengths: Strength[];
  gaps: Gap[];
  targetRole: string;
  jobPosting: string;
  profile?: ExtractedProfile;
  analysisId?: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const APPLY_THRESHOLD = 65;

type QuestionTab = 'technical' | 'behavioral' | 'situational' | 'culture';

const DIFFICULTY_CONFIG = {
  easy: { label: 'Easy', color: '#10B981', bg: 'bg-success/[0.08]', border: 'border-success/20', text: 'text-success' },
  moderate: { label: 'Moderate', color: '#E8890A', bg: 'bg-[#E8890A]/[0.08]', border: 'border-[#E8890A]/20', text: 'text-[#E8890A]' },
  competitive: { label: 'Competitive', color: '#F97316', bg: 'bg-orange-500/[0.08]', border: 'border-orange-500/20', text: 'text-orange-500' },
  highly_competitive: { label: 'Highly Competitive', color: '#EF4444', bg: 'bg-danger/[0.08]', border: 'border-danger/20', text: 'text-danger' },
} as const;

const Q_DIFFICULTY_STYLES = {
  easy: 'bg-success/[0.08] text-success border-success/15',
  medium: 'bg-[#E8890A]/[0.08] text-[#E8890A] border-[#E8890A]/15',
  hard: 'bg-danger/[0.08] text-danger border-danger/15',
} as const;

const LIKELIHOOD_STYLES = {
  very_likely: 'bg-primary/[0.08] text-primary border-primary/15',
  possible: 'bg-black/[0.04] text-text-tertiary border-black/[0.08]',
} as const;

const ASK_CATEGORY_STYLES: Record<QuestionToAsk['category'], string> = {
  role: 'bg-primary/[0.08] text-primary border-primary/15',
  team: 'bg-violet-500/[0.08] text-violet-600 border-violet-500/15',
  company: 'bg-success/[0.08] text-success border-success/15',
  growth: 'bg-[#E8890A]/[0.08] text-[#E8890A] border-[#E8890A]/15',
  strategic: 'bg-cyan-500/[0.08] text-cyan-600 border-cyan-500/15',
};

const ASK_CATEGORY_LABELS: Record<QuestionToAsk['category'], string> = {
  role: 'Role',
  team: 'Team',
  company: 'Company',
  growth: 'Growth',
  strategic: 'Strategic',
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function ReadinessBanner({ matchScore }: { matchScore: number }) {
  const isReady = matchScore >= APPLY_THRESHOLD;
  const isClose = matchScore >= 45 && matchScore < APPLY_THRESHOLD;

  if (isReady) {
    return (
      <div className="rounded-2xl border border-success/25 bg-success/[0.05] p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-success/10 border border-success/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <div>
          <p className="font-semibold text-success text-sm">You&apos;re ready to apply — let&apos;s nail the interview.</p>
          <p className="text-xs text-text-secondary mt-1">Your {matchScore}% job match puts you in a strong position. The prep kit below is fully tailored to this role and your profile.</p>
        </div>
      </div>
    );
  }

  if (isClose) {
    return (
      <div className="rounded-2xl border border-[#E8890A]/25 bg-[#E8890A]/[0.05] p-5 flex items-start gap-4">
        <div className="w-9 h-9 rounded-xl bg-[#E8890A]/10 border border-[#E8890A]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#E8890A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
        </div>
        <div>
          <p className="font-semibold text-[#E8890A] text-sm">You&apos;re close — a bit more prep and you&apos;ll be competitive.</p>
          <p className="text-xs text-text-secondary mt-1">
            Your current job match is <span className="font-medium text-[#E8890A]">{matchScore}%</span>. We recommend reaching at least <span className="font-medium">{APPLY_THRESHOLD}%</span> before applying — optimize your CV and LinkedIn profile and close key skill gaps first. That said, this prep kit is ready when you are.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-danger/25 bg-danger/[0.05] p-5 flex items-start gap-4">
      <div className="w-9 h-9 rounded-xl bg-danger/10 border border-danger/20 flex items-center justify-center flex-shrink-0 mt-0.5">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
      </div>
      <div>
        <p className="font-semibold text-danger text-sm">Your job match is below {APPLY_THRESHOLD}% — close gaps before applying.</p>
        <p className="text-xs text-text-secondary mt-1">
          At <span className="font-medium text-danger">{matchScore}%</span>, we strongly advise optimizing your CV, updating your LinkedIn profile, and closing the critical skill gaps shown in the Strengths &amp; Gaps tab before interviewing. We&apos;ve generated this prep kit so you know what to expect when you&apos;re ready.
        </p>
      </div>
    </div>
  );
}

function DifficultyCard({ prep }: { prep: InterviewPrep }) {
  const cfg = DIFFICULTY_CONFIG[prep.difficultyRating];
  return (
    <div className={`rounded-2xl border ${cfg.border} ${cfg.bg} p-5`}>
      <div className="flex items-start gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${cfg.bg} ${cfg.border} ${cfg.text}`}>
              {cfg.label}
            </span>
            <span className="text-xs text-text-tertiary">Interview Difficulty</span>
            {prep.estimatedPrepHours > 0 && (
              <span className="ml-auto text-xs text-text-tertiary flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                ~{prep.estimatedPrepHours}h prep
              </span>
            )}
          </div>
          <p className="text-sm text-text-secondary">{prep.difficultyRationale}</p>
        </div>
      </div>
      {prep.focusAreas.length > 0 && (
        <div className="mt-4 pt-3.5 border-t border-black/[0.06]">
          <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-2">Expect questions on</p>
          <div className="flex flex-wrap gap-1.5">
            {prep.focusAreas.map((area, i) => (
              <span key={i} className="text-xs px-2.5 py-1 rounded-lg bg-white/60 border border-black/[0.08] text-text-secondary font-medium">
                {area}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ExpandableQuestion({ id, expanded, onToggle, children }: {
  id: string;
  expanded: boolean;
  onToggle: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden transition-all">
      <button
        onClick={() => onToggle(id)}
        className="w-full text-left px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-black/[0.02] transition-colors"
      >
        {children}
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 text-text-tertiary transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
    </div>
  );
}

function TechnicalQuestionCard({ q, index, expanded, onToggle }: {
  q: TechnicalQuestion;
  index: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const id = `tech-${index}`;
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${Q_DIFFICULTY_STYLES[q.difficulty]}`}>
              {q.difficulty}
            </span>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${LIKELIHOOD_STYLES[q.likelihood]}`}>
              {q.likelihood === 'very_likely' ? 'Very likely' : 'Possible'}
            </span>
          </div>
          <p className="text-sm font-medium text-text-primary leading-snug">{q.question}</p>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 text-text-tertiary mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 space-y-3 border-t border-black/[0.06]">
          <div className="pt-3">
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">What they&apos;re testing</p>
            <p className="text-sm text-text-secondary">{q.testing}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-1">How to approach it</p>
            <p className="text-sm text-text-secondary">{q.approach}</p>
          </div>
          {q.yourEdge && (
            <div className="rounded-lg bg-primary/[0.06] border border-primary/15 px-3 py-2.5">
              <p className="text-[11px] font-semibold text-primary uppercase tracking-wider mb-1">Your edge</p>
              <p className="text-xs text-text-secondary">{q.yourEdge}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function BehavioralQuestionCard({ q, index, expanded, onToggle }: {
  q: BehavioralQuestion;
  index: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const id = `beh-${index}`;
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <span className="text-[11px] font-medium text-text-tertiary mb-1 block">{q.competency}</span>
          <p className="text-sm font-medium text-text-primary leading-snug">{q.question}</p>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 text-text-tertiary mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-black/[0.06]">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mt-3 mb-2.5">STAR Framework</p>
          <div className="space-y-2">
            {(
              [
                { letter: 'S', label: 'Situation', hint: q.starHints.situation, color: 'text-primary bg-primary/[0.07] border-primary/15' },
                { letter: 'T', label: 'Task', hint: q.starHints.task, color: 'text-violet-600 bg-violet-500/[0.07] border-violet-500/15' },
                { letter: 'A', label: 'Action', hint: q.starHints.action, color: 'text-success bg-success/[0.07] border-success/15' },
                { letter: 'R', label: 'Result', hint: q.starHints.result, color: 'text-[#E8890A] bg-[#E8890A]/[0.07] border-[#E8890A]/15' },
              ] as const
            ).map(({ letter, label, hint, color }) => (
              <div key={letter} className={`flex gap-3 rounded-lg border px-3 py-2.5 ${color}`}>
                <span className="font-bold text-sm w-4 flex-shrink-0 mt-0.5">{letter}</span>
                <div className="min-w-0">
                  <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">{label}: </span>
                  <span className="text-xs opacity-90">{hint}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function SituationalQuestionCard({ q, index, expanded, onToggle }: {
  q: SituationalQuestion;
  index: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const id = `sit-${index}`;
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary leading-snug">{q.question}</p>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 text-text-tertiary mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-black/[0.06]">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mt-3 mb-1.5">Framework</p>
          <p className="text-sm text-text-secondary">{q.framework}</p>
        </div>
      )}
    </div>
  );
}

function CultureQuestionCard({ q, index, expanded, onToggle }: {
  q: CultureQuestion;
  index: number;
  expanded: boolean;
  onToggle: (id: string) => void;
}) {
  const id = `cul-${index}`;
  return (
    <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] overflow-hidden">
      <button
        onClick={() => onToggle(id)}
        className="w-full text-left px-4 py-3.5 flex items-start gap-3 hover:bg-black/[0.02] transition-colors"
      >
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-text-primary leading-snug">{q.question}</p>
        </div>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
          strokeLinecap="round" strokeLinejoin="round"
          className={`flex-shrink-0 text-text-tertiary mt-1 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      {expanded && (
        <div className="px-4 pb-4 border-t border-black/[0.06]">
          <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mt-3 mb-1.5">Suggested angle</p>
          <p className="text-sm text-text-secondary">{q.suggestedAngle}</p>
        </div>
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function InterviewPrepPanel({
  matchScore,
  matchingSkills,
  missingSkills,
  strengths,
  gaps,
  targetRole,
  jobPosting,
  profile,
  analysisId,
}: InterviewPrepPanelProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<QuestionTab>('technical');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const toggleExpanded = useCallback((id: string) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const generate = useCallback(async () => {
    setState('loading');
    setError('');
    try {
      const experienceHighlights = profile?.experience?.slice(0, 3).map(e => ({
        title: e.title,
        company: e.company,
        highlights: e.highlights,
      }));

      const res = await fetch('/api/interview-prep', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetRole,
          jobPosting,
          matchingSkills,
          missingSkills,
          strengths,
          gaps,
          profileSummary: profile?.summary,
          experienceHighlights,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Failed to generate interview prep');
      }

      const data = await res.json();
      setPrep(data.prep);
      setState('loaded');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setState('error');
    }
  }, [targetRole, jobPosting, matchingSkills, missingSkills, strengths, gaps, profile]);

  const Q_TABS: { id: QuestionTab; label: string; count: number }[] = prep
    ? [
        { id: 'technical', label: 'Technical', count: prep.technicalQuestions.length },
        { id: 'behavioral', label: 'Behavioral', count: prep.behavioralQuestions.length },
        { id: 'situational', label: 'Situational', count: prep.situationalQuestions.length },
        { id: 'culture', label: 'Culture & Motivation', count: prep.cultureQuestions.length },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" y1="19" x2="12" y2="23"/>
            <line x1="8" y1="23" x2="16" y2="23"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary font-display">Interview Prep</h2>
          <p className="text-sm text-text-tertiary">Personalized kit for {targetRole}</p>
        </div>
      </div>

      {/* ── Readiness banner (always visible) ── */}
      <ReadinessBanner matchScore={matchScore} />

      {/* ── Idle state — generate CTA ── */}
      {state === 'idle' && (
        <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-8 text-center">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
          </div>
          <h3 className="font-semibold text-text-primary mb-2">Generate your interview kit</h3>
          <p className="text-sm text-text-secondary mb-6 max-w-md mx-auto">
            AI will generate a personalized question bank, STAR prompts grounded in your experience, technical topics to review, and smart questions to ask your interviewers — all tailored to this specific job posting.
          </p>
          <button
            onClick={generate}
            className="btn-primary py-3 px-8 text-base font-semibold flex items-center justify-center gap-2 mx-auto"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
            </svg>
            Generate Interview Kit
          </button>
        </div>
      )}

      {/* ── Loading skeleton ── */}
      {state === 'loading' && (
        <div className="space-y-3">
          <p className="text-sm text-text-tertiary text-center animate-pulse">Generating your personalized interview kit…</p>
          {[80, 60, 72, 55, 68].map((w, i) => (
            <div key={i} className={`h-14 rounded-xl bg-black/[0.04] animate-pulse`} style={{ width: `${w}%` }} />
          ))}
        </div>
      )}

      {/* ── Error state ── */}
      {state === 'error' && (
        <div className="rounded-2xl border border-danger/15 bg-danger/[0.04] p-5 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" className="flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm font-medium text-danger">{error || 'Failed to generate interview prep.'}</p>
          </div>
          <button onClick={generate} className="btn-secondary text-sm !py-1.5 !px-3 flex-shrink-0">Retry</button>
        </div>
      )}

      {/* ── Loaded content ── */}
      {state === 'loaded' && prep && (
        <>
          {/* Difficulty card */}
          <DifficultyCard prep={prep} />

          {/* ── Question Bank ── */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3 className="font-semibold text-text-primary text-base">Question Bank</h3>
            </div>

            {/* Inner tabs */}
            <div className="flex gap-1 p-1 bg-black/[0.03] border border-black/[0.08] rounded-xl mb-4 overflow-x-auto scrollbar-none">
              {Q_TABS.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-white text-text-primary shadow-sm'
                      : 'text-text-tertiary hover:text-text-secondary'
                  }`}
                >
                  {tab.label}
                  {tab.count > 0 && (
                    <span className={`text-[11px] px-1.5 py-0.5 rounded-md font-semibold ${activeTab === tab.id ? 'bg-primary/10 text-primary' : 'bg-black/[0.04] text-text-tertiary'}`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Question lists */}
            <div className="space-y-2">
              {activeTab === 'technical' && prep.technicalQuestions.map((q, i) => (
                <TechnicalQuestionCard
                  key={i} q={q} index={i}
                  expanded={expanded.has(`tech-${i}`)}
                  onToggle={toggleExpanded}
                />
              ))}
              {activeTab === 'behavioral' && prep.behavioralQuestions.map((q, i) => (
                <BehavioralQuestionCard
                  key={i} q={q} index={i}
                  expanded={expanded.has(`beh-${i}`)}
                  onToggle={toggleExpanded}
                />
              ))}
              {activeTab === 'situational' && prep.situationalQuestions.map((q, i) => (
                <SituationalQuestionCard
                  key={i} q={q} index={i}
                  expanded={expanded.has(`sit-${i}`)}
                  onToggle={toggleExpanded}
                />
              ))}
              {activeTab === 'culture' && prep.cultureQuestions.map((q, i) => (
                <CultureQuestionCard
                  key={i} q={q} index={i}
                  expanded={expanded.has(`cul-${i}`)}
                  onToggle={toggleExpanded}
                />
              ))}
            </div>
          </div>

          {/* ── Questions to Ask ── */}
          {prep.questionsToAsk.length > 0 && (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-success/10 border border-success/20 flex items-center justify-center text-success">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </div>
                <h3 className="font-semibold text-text-primary text-base">Questions to Ask Them</h3>
              </div>
              <div className="space-y-2">
                {prep.questionsToAsk.map((q, i) => (
                  <div key={i} className="flex items-start gap-3 rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3">
                    <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 mt-0.5 whitespace-nowrap ${ASK_CATEGORY_STYLES[q.category]}`}>
                      {ASK_CATEGORY_LABELS[q.category]}
                    </span>
                    <p className="text-sm text-text-primary leading-relaxed">{q.question}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Mental readiness tip ── */}
          {prep.mentalReadinessTip && (
            <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-5 py-4 flex items-start gap-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-0.5">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <p className="text-sm text-text-secondary italic">{prep.mentalReadinessTip}</p>
            </div>
          )}

          {/* Re-generate + feedback */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={generate}
              className="btn-secondary text-sm flex items-center gap-2 !py-2 !px-4"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
              </svg>
              Regenerate
            </button>
            <FeedbackButton compact analysisId={analysisId} section="interview-prep" />
          </div>
        </>
      )}
    </div>
  );
}
