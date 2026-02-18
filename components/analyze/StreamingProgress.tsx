'use client';

import { useTranslation } from '@/lib/i18n';
import type { StreamStep } from '@/lib/hooks/useStreamingAnalysis';

interface StreamingProgressProps {
  currentStep: StreamStep;
}

const PIPELINE_STEPS = [
  { key: 'parsing', doneAt: 'extraction' },
  { key: 'extraction', doneAt: 'gap_analysis' },
  { key: 'gap_analysis', doneAt: 'gap_done' },
  { key: 'career_plan', doneAt: 'plan_done' },
  { key: 'translating', doneAt: 'complete' },
];

const STEP_ICONS = [
  <svg key="0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>,
  <svg key="1" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  <svg key="2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/></svg>,
  <svg key="3" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>,
  <svg key="4" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
];

function getStepStatus(
  stepKey: string,
  currentStepKey: string,
  stepIndex: number,
  allSteps: typeof PIPELINE_STEPS
): 'done' | 'active' | 'pending' {
  const currentIndex = allSteps.findIndex(
    (s) => s.key === currentStepKey || s.doneAt === currentStepKey
  );
  const doneAtIndex = allSteps.findIndex((s) => s.doneAt === currentStepKey);
  if (doneAtIndex >= stepIndex) return 'done';
  if (currentIndex === stepIndex) return 'active';
  if (currentIndex > stepIndex) return 'done';
  return 'pending';
}

export default function StreamingProgress({ currentStep }: StreamingProgressProps) {
  const { t } = useTranslation();

  const isTranslating = ['translating', 'complete'].includes(currentStep.step) &&
    PIPELINE_STEPS.some((s) => s.key === 'translating');

  const visibleSteps = isTranslating
    ? PIPELINE_STEPS
    : PIPELINE_STEPS.filter((s) => s.key !== 'translating');

  const completedCount = visibleSteps.filter((step, i) =>
    getStepStatus(step.key, currentStep.step, i, visibleSteps) === 'done'
  ).length;

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 grid-bg opacity-30" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-primary/[0.04] blur-[100px]" />
      <div className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-accent-cyan/[0.03] blur-[80px]" />

      <div className="relative z-10 max-w-md w-full space-y-10">
        {/* Orbital spinner */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-28 h-28">
            {/* Outer ring */}
            <svg className="absolute inset-0 w-28 h-28 -rotate-90" viewBox="0 0 128 128">
              <circle cx="64" cy="64" r="56" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="3" />
              <circle
                cx="64" cy="64" r="56" fill="none"
                stroke="url(#progressGrad)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeDasharray={2 * Math.PI * 56}
                strokeDashoffset={2 * Math.PI * 56 * (1 - currentStep.progress / 100)}
                style={{ transition: 'stroke-dashoffset 0.8s ease-out', filter: 'drop-shadow(0 0 6px rgba(59,130,246,0.3))' }}
              />
              <defs>
                <linearGradient id="progressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3B82F6" />
                  <stop offset="100%" stopColor="#06B6D4" />
                </linearGradient>
              </defs>
            </svg>

            {/* Inner content */}
            <div className="absolute inset-4 rounded-full bg-white/[0.03] border border-white/[0.06] flex flex-col items-center justify-center">
              <span className="text-2xl font-bold font-display text-text-primary tabular-nums">{Math.round(currentStep.progress)}%</span>
            </div>
          </div>

          {/* Status message */}
          <div className="text-center space-y-1.5">
            <p className="text-lg font-semibold text-text-primary font-display">
              {currentStep.message || t('progress.messages.0')}
            </p>
            <p className="text-xs text-text-tertiary">
              {t('progress.stepLabel')} {completedCount + 1}/{visibleSteps.length}
            </p>
          </div>
        </div>

        {/* Pipeline steps */}
        <div className="space-y-2">
          {visibleSteps.map((step, i) => {
            const status = getStepStatus(step.key, currentStep.step, i, visibleSteps);
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-500 ${
                  status === 'done'
                    ? 'bg-success/[0.04] border border-success/15'
                    : status === 'active'
                    ? 'bg-primary/[0.06] border border-primary/20'
                    : 'bg-white/[0.01] border border-white/[0.04] opacity-40'
                }`}
              >
                {/* Status indicator */}
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                  {status === 'done' ? (
                    <div className="w-6 h-6 rounded-full bg-success/[0.12] border border-success/20 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  ) : status === 'active' ? (
                    <div className="w-6 h-6 rounded-full bg-primary/[0.12] border border-primary/20 flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-white/[0.03] border border-white/[0.06] flex items-center justify-center text-text-tertiary">
                      {STEP_ICONS[i]}
                    </div>
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`text-sm font-medium flex-1 ${
                    status === 'done'
                      ? 'text-success'
                      : status === 'active'
                      ? 'text-primary'
                      : 'text-text-tertiary'
                  }`}
                >
                  {t(`progress.steps.${step.key}`)}
                </span>

                {/* Status text */}
                {status === 'done' && (
                  <span className="text-[11px] text-success/60 font-medium">Done</span>
                )}
                {status === 'active' && (
                  <span className="text-[11px] text-primary/60 font-medium animate-pulse">Processing...</span>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom progress bar */}
        <div className="space-y-2.5">
          <div className="h-1.5 rounded-full bg-white/[0.04] border border-white/[0.04] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-accent-cyan transition-all duration-700 ease-out"
              style={{
                width: `${currentStep.progress}%`,
                boxShadow: '0 0 12px rgba(59,130,246,0.3)',
              }}
            />
          </div>
          <p className="text-[11px] text-text-tertiary text-center">
            {t('progress.percentComplete', { percent: String(Math.round(currentStep.progress)) })}
          </p>
        </div>
      </div>
    </div>
  );
}