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
  SalaryAnalysis,
} from '@/lib/types';
import { formatCurrency } from '@/lib/utils';
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
  salaryAnalysis?: SalaryAnalysis;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const APPLY_THRESHOLD = 65;

type QuestionTab = 'technical' | 'behavioral' | 'situational' | 'culture';
type PrepTab = 'overview' | 'questions' | 'study' | 'soft-skills' | 'salary';

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

const TESTGORILLA_MAP: Record<string, { name: string; url: string; minutes: number }> = {
  'Python': { name: 'Python (Coding)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/python-coding/', minutes: 10 },
  'JavaScript': { name: 'JavaScript (Coding)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/javascript-coding/', minutes: 10 },
  'TypeScript': { name: 'TypeScript', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/typescript/', minutes: 10 },
  'React': { name: 'React', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/react/', minutes: 10 },
  'Node.js': { name: 'Node.js', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/nodejs/', minutes: 10 },
  'SQL': { name: 'SQL (Intermediate)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/sql-intermediate-level/', minutes: 10 },
  'Excel': { name: 'Microsoft Excel (Intermediate)', url: 'https://www.testgorilla.com/test-library/software-skills-tests/microsoft-excel-intermediate/', minutes: 10 },
  'Attention to Detail': { name: 'Attention to Detail', url: 'https://www.testgorilla.com/test-library/cognitive-ability-tests/attention-to-detail-visual/', minutes: 7 },
  'Critical Thinking': { name: 'Critical Thinking', url: 'https://www.testgorilla.com/test-library/cognitive-ability-tests/critical-thinking/', minutes: 12 },
  'Communication': { name: 'Communication', url: 'https://www.testgorilla.com/test-library/personality-culture-tests/communication/', minutes: 10 },
  'Problem Solving': { name: 'Problem Solving', url: 'https://www.testgorilla.com/test-library/cognitive-ability-tests/problem-solving/', minutes: 10 },
  'Leadership': { name: 'Leadership & People Management', url: 'https://www.testgorilla.com/test-library/personality-culture-tests/leadership-and-people-management/', minutes: 10 },
  'Project Management': { name: 'Project Management', url: 'https://www.testgorilla.com/test-library/role-specific-skills-tests/project-management/', minutes: 10 },
  'Time Management': { name: 'Time Management', url: 'https://www.testgorilla.com/test-library/personality-culture-tests/time-management/', minutes: 10 },
  'Data Analysis': { name: 'Data Analysis', url: 'https://www.testgorilla.com/test-library/role-specific-skills-tests/data-analysis/', minutes: 10 },
  'Machine Learning': { name: 'Machine Learning', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/machine-learning/', minutes: 15 },
  'Java': { name: 'Java (Coding)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/java-coding/', minutes: 10 },
  'C#': { name: 'C# (Coding)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/c-sharp-coding/', minutes: 10 },
  'PHP': { name: 'PHP (Coding)', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/php-coding/', minutes: 10 },
  'CSS': { name: 'CSS', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/css/', minutes: 10 },
  'Git': { name: 'Git', url: 'https://www.testgorilla.com/test-library/programming-skills-tests/git/', minutes: 10 },
};

type MentalItem = { id: string; text: string };
const MENTAL_ITEMS: Record<'pre' | 'day' | 'during', MentalItem[]> = {
  pre: [
    { id: 'mental-pre-0', text: 'Research the company mission, values, and recent news.' },
    { id: 'mental-pre-1', text: 'Prepare 3 strong examples from your experience using STAR.' },
    { id: 'mental-pre-2', text: 'Prepare 5 thoughtful questions to ask the interviewer.' },
    { id: 'mental-pre-3', text: 'Test your audio, video, and internet connection (for remote).' },
  ],
  day: [
    { id: 'mental-day-0', text: 'Sleep 7+ hours the night before.' },
    { id: 'mental-day-1', text: 'Eat a good meal 1-2 hours before the interview.' },
    { id: 'mental-day-2', text: 'Arrive or log in 5-10 minutes early.' },
    { id: 'mental-day-3', text: 'Do a quick 5-minute breathing exercise to calm nerves.' },
  ],
  during: [
    { id: 'mental-dur-0', text: "Pause before answering — it shows thoughtfulness, not weakness." },
    { id: 'mental-dur-1', text: 'Ask for clarification if a question is unclear.' },
    { id: 'mental-dur-2', text: "Mirror the interviewer's energy and pace." },
    { id: 'mental-dur-3', text: 'End with a clear closing statement expressing your interest.' },
  ],
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
  salaryAnalysis,
}: InterviewPrepPanelProps) {
  const [state, setState] = useState<'idle' | 'loading' | 'loaded' | 'error'>('idle');
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [error, setError] = useState('');
  const [activePrepTab, setActivePrepTab] = useState<PrepTab>('overview');
  const [activeTab, setActiveTab] = useState<QuestionTab>('technical');
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  const storageKey = `interview-prep-checks-${analysisId || 'demo'}`;
  const [checked, setChecked] = useState<Set<string>>(() => {
    if (typeof window === 'undefined') return new Set();
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? new Set<string>(JSON.parse(raw)) : new Set<string>();
    } catch {
      return new Set<string>();
    }
  });

  const toggleChecked = useCallback((id: string) => {
    setChecked(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        localStorage.setItem(storageKey, JSON.stringify(Array.from(next)));
      } catch {}
      return next;
    });
  }, [storageKey]);

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
    setActivePrepTab('overview');
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

  // Progress computation (used in loaded state)
  const totalChecks = (prep?.technicalReview?.length ?? 0) + 12;
  const doneChecks = checked.size;
  const progressPct = totalChecks > 0 ? Math.round((doneChecks / totalChecks) * 100) : 0;

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
          {/* ── Progress bar — always visible ── */}
          <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-semibold text-text-primary">Prep Progress</p>
              <span className="text-sm font-bold text-primary">{progressPct}%</span>
            </div>
            <div className="h-2 bg-black/[0.06] rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="text-xs text-text-tertiary mt-2">{doneChecks} of {totalChecks} items checked</p>
          </div>

          {/* ── Section tab bar ── */}
          <div className="flex gap-1 p-1 bg-black/[0.03] border border-black/[0.08] rounded-xl overflow-x-auto scrollbar-none">
            {(
              [
                { id: 'overview' as PrepTab, label: 'Overview' },
                { id: 'questions' as PrepTab, label: 'Questions' },
                { id: 'study' as PrepTab, label: 'Study Plan' },
                { id: 'soft-skills' as PrepTab, label: 'Soft Skills' },
                ...(salaryAnalysis ? [{ id: 'salary' as PrepTab, label: 'Salary' }] : []),
              ]
            ).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActivePrepTab(tab.id)}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-200 flex-shrink-0 ${
                  activePrepTab === tab.id
                    ? 'bg-white text-text-primary shadow-sm'
                    : 'text-text-tertiary hover:text-text-secondary'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* ── Tab: Overview ── */}
          {activePrepTab === 'overview' && (
            <DifficultyCard prep={prep} />
          )}

          {/* ── Tab: Questions ── */}
          {activePrepTab === 'questions' && (
            <div className="space-y-6">
              {/* Question Bank */}
              <div>
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
                <div className="space-y-2">
                  {activeTab === 'technical' && prep.technicalQuestions.map((q, i) => (
                    <TechnicalQuestionCard key={i} q={q} index={i} expanded={expanded.has(`tech-${i}`)} onToggle={toggleExpanded} />
                  ))}
                  {activeTab === 'behavioral' && prep.behavioralQuestions.map((q, i) => (
                    <BehavioralQuestionCard key={i} q={q} index={i} expanded={expanded.has(`beh-${i}`)} onToggle={toggleExpanded} />
                  ))}
                  {activeTab === 'situational' && prep.situationalQuestions.map((q, i) => (
                    <SituationalQuestionCard key={i} q={q} index={i} expanded={expanded.has(`sit-${i}`)} onToggle={toggleExpanded} />
                  ))}
                  {activeTab === 'culture' && prep.cultureQuestions.map((q, i) => (
                    <CultureQuestionCard key={i} q={q} index={i} expanded={expanded.has(`cul-${i}`)} onToggle={toggleExpanded} />
                  ))}
                </div>
              </div>

              {/* Questions to Ask Them */}
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
            </div>
          )}

          {/* ── Tab: Study Plan ── */}
          {activePrepTab === 'study' && (
            <div className="space-y-6">
              {/* Technical Review Checklist */}
              {prep.technicalReview.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-600">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-text-primary text-base">Technical Review Checklist</h3>
                  </div>
                  {Array.from(new Set(prep.technicalReview.map(item => item.cluster))).map(cluster => (
                    <div key={cluster} className="mb-5">
                      <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-2">{cluster}</p>
                      <div className="space-y-2">
                        {prep.technicalReview
                          .map((item, i) => ({ item, i }))
                          .filter(({ item }) => item.cluster === cluster)
                          .map(({ item, i }) => {
                            const id = `tr-${i}`;
                            const isChecked = checked.has(id);
                            return (
                              <div
                                key={i}
                                onClick={() => toggleChecked(id)}
                                className={`rounded-xl border px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors ${
                                  isChecked ? 'border-success/20 bg-success/[0.04]' : 'border-black/[0.08] bg-black/[0.02] hover:bg-black/[0.03]'
                                }`}
                              >
                                <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                  isChecked ? 'bg-success border-success' : 'border-black/20'
                                }`}>
                                  {isChecked && (
                                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                      <polyline points="20 6 9 17 4 12"/>
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className={`text-sm font-medium ${isChecked ? 'line-through text-text-tertiary' : 'text-text-primary'}`}>{item.topic}</p>
                                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-black/[0.04] border border-black/[0.06] text-text-tertiary">{item.estimatedTime}</span>
                                  </div>
                                  <p className="text-xs text-text-tertiary mt-0.5">{item.whyItMatters}</p>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* TestGorilla Practice Tests */}
              {(() => {
                const matches = prep.testGorillaTests.map(k => TESTGORILLA_MAP[k]).filter(Boolean);
                return matches.length > 0 ? (
                  <div>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-600">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/>
                        </svg>
                      </div>
                      <h3 className="font-semibold text-text-primary text-base">Practice Tests (TestGorilla)</h3>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {matches.map((entry, i) => (
                        <a key={i} href={entry.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.08] bg-black/[0.02] px-4 py-3 hover:border-primary/20 hover:bg-primary/[0.02] transition-colors group"
                        >
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors truncate">{entry.name}</p>
                            <p className="text-xs text-text-tertiary">{entry.minutes} min</p>
                          </div>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-text-tertiary group-hover:text-primary flex-shrink-0 transition-colors">
                            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
                          </svg>
                        </a>
                      ))}
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* ── Tab: Soft Skills ── */}
          {activePrepTab === 'soft-skills' && (
            <div className="space-y-6">
              {/* Soft Skills Deep Dive */}
              {prep.softSkills.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-[#E8890A]/10 border border-[#E8890A]/20 flex items-center justify-center text-[#E8890A]">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                      </svg>
                    </div>
                    <h3 className="font-semibold text-text-primary text-base">Soft Skills Deep Dive</h3>
                  </div>
                  <div className="space-y-3">
                    {prep.softSkills.map((skill, i) => (
                      <div key={i} className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4">
                        <p className="text-sm font-semibold text-text-primary mb-0.5">{skill.skill}</p>
                        <p className="text-xs text-text-tertiary mb-3">{skill.inContext}</p>
                        <div className="grid sm:grid-cols-2 gap-3">
                          <div className="rounded-lg bg-success/[0.05] border border-success/15 px-3 py-2.5">
                            <p className="text-[11px] font-semibold text-success uppercase tracking-wider mb-1.5">How to signal it</p>
                            <ul className="space-y-1">
                              {skill.howToSignal.map((point, j) => (
                                <li key={j} className="text-xs text-text-secondary flex items-start gap-1.5">
                                  <span className="text-success mt-0.5 flex-shrink-0">›</span>
                                  {point}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="rounded-lg bg-danger/[0.05] border border-danger/15 px-3 py-2.5">
                            <p className="text-[11px] font-semibold text-danger uppercase tracking-wider mb-1.5">Red flag to avoid</p>
                            <p className="text-xs text-text-secondary">{skill.redFlag}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mental Readiness */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    </svg>
                  </div>
                  <h3 className="font-semibold text-text-primary text-base">Mental Readiness</h3>
                </div>
                {prep.mentalReadinessTip && (
                  <div className="rounded-xl border border-primary/15 bg-primary/[0.04] px-4 py-3.5 flex items-start gap-3 mb-4">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary flex-shrink-0 mt-0.5">
                      <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    <p className="text-sm text-text-secondary italic">{prep.mentalReadinessTip}</p>
                  </div>
                )}
                <div className="grid sm:grid-cols-3 gap-3">
                  {(
                    [
                      { key: 'pre' as const, label: 'Pre-Interview', color: 'text-violet-600', bg: 'bg-violet-500/[0.05]', border: 'border-violet-500/15' },
                      { key: 'day' as const, label: 'Day Of', color: 'text-[#E8890A]', bg: 'bg-[#E8890A]/[0.05]', border: 'border-[#E8890A]/15' },
                      { key: 'during' as const, label: 'During', color: 'text-success', bg: 'bg-success/[0.05]', border: 'border-success/15' },
                    ]
                  ).map(({ key, label, color, bg, border }) => (
                    <div key={key} className={`rounded-xl border ${border} ${bg} p-3.5`}>
                      <p className={`text-[11px] font-semibold uppercase tracking-wider mb-2.5 ${color}`}>{label}</p>
                      <div className="space-y-2">
                        {MENTAL_ITEMS[key].map(item => {
                          const isChecked = checked.has(item.id);
                          return (
                            <div key={item.id} onClick={() => toggleChecked(item.id)} className="flex items-start gap-2 cursor-pointer">
                              <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${
                                isChecked ? 'bg-success border-success' : 'border-black/20 bg-white/60'
                              }`}>
                                {isChecked && (
                                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"/>
                                  </svg>
                                )}
                              </div>
                              <p className={`text-xs leading-relaxed ${isChecked ? 'line-through text-text-tertiary' : 'text-text-secondary'}`}>{item.text}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── Tab: Salary ── */}
          {activePrepTab === 'salary' && salaryAnalysis && (
            <div className="space-y-4">
              <div className="rounded-2xl border border-black/[0.08] bg-black/[0.02] p-4">
                <div className="grid grid-cols-3 gap-3 mb-1">
                  {(
                    [
                      { label: 'Floor', value: salaryAnalysis.targetRoleMarket.low, color: 'text-text-secondary', border: 'border-black/[0.08]', bg: 'bg-white/60' },
                      { label: 'Target', value: salaryAnalysis.targetRoleMarket.mid, color: 'text-primary', border: 'border-primary/20', bg: 'bg-primary/[0.04]' },
                      { label: 'Stretch', value: salaryAnalysis.targetRoleMarket.high, color: 'text-success', border: 'border-success/20', bg: 'bg-success/[0.04]' },
                    ]
                  ).map(({ label, value, color, border, bg }) => (
                    <div key={label} className={`rounded-xl border ${border} ${bg} px-3 py-3 text-center`}>
                      <p className="text-[11px] text-text-tertiary font-medium mb-1">{label}</p>
                      <p className={`text-sm font-bold ${color}`}>{formatCurrency(value, salaryAnalysis.targetRoleMarket.currency)}</p>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-text-tertiary text-center mt-2">{salaryAnalysis.targetRoleMarket.region}</p>
              </div>
              {salaryAnalysis.negotiationTips.length > 0 && (
                <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4">
                  <p className="text-[11px] font-semibold text-text-tertiary uppercase tracking-wider mb-3">Negotiation Tips</p>
                  <ul className="space-y-2">
                    {salaryAnalysis.negotiationTips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="text-success font-bold flex-shrink-0 mt-0.5 text-sm">›</span>
                        <p className="text-sm text-text-secondary">{tip}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ── Re-generate + feedback — always visible ── */}
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
