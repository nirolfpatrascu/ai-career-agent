'use client';

import { useTranslation } from '@/lib/i18n';
import type { StreamStep } from '@/lib/hooks/useStreamingAnalysis';

interface StreamingProgressProps {
  currentStep: StreamStep;
}

const PIPELINE_STEPS = [
  { key: 'parsing', icon: '📄', doneAt: 'extraction' },
  { key: 'extraction', icon: '🔍', doneAt: 'gap_analysis' },
  { key: 'gap_analysis', icon: '🎯', doneAt: 'gap_done' },
  { key: 'career_plan', icon: '🗺️', doneAt: 'plan_done' },
  { key: 'translating', icon: '🌐', doneAt: 'complete' },
];

function getStepStatus(
  stepKey: string,
  currentStepKey: string,
  stepIndex: number,
  allSteps: typeof PIPELINE_STEPS
): 'done' | 'active' | 'pending' {
  // Find current step index
  const currentIndex = allSteps.findIndex(
    (s) => s.key === currentStepKey || s.doneAt === currentStepKey
  );

  // Check if this step's "doneAt" event has been reached
  const doneAtIndex = allSteps.findIndex((s) => s.doneAt === currentStepKey);
  if (doneAtIndex >= stepIndex) return 'done';

  if (currentIndex === stepIndex) return 'active';
  if (currentIndex > stepIndex) return 'done';
  return 'pending';
}

export default function StreamingProgress({ currentStep }: StreamingProgressProps) {
  const { t } = useTranslation();

  // Filter out translation step for English users
  const isTranslating = ['translating', 'complete'].includes(currentStep.step) &&
    PIPELINE_STEPS.some((s) => s.key === 'translating');

  const visibleSteps = isTranslating
    ? PIPELINE_STEPS
    : PIPELINE_STEPS.filter((s) => s.key !== 'translating');

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full space-y-10">
        {/* Spinner + current message */}
        <div className="text-center space-y-4">
          <div className="relative w-20 h-20 mx-auto">
            <div className="absolute inset-0 rounded-full border-2 border-card-border" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
            <div className="absolute inset-3 rounded-full bg-primary/5 animate-pulse flex items-center justify-center">
              <span className="text-xl">
                {visibleSteps.find((s) => s.key === currentStep.step)?.icon || '⚡'}
              </span>
            </div>
          </div>

          <p className="text-lg font-semibold text-text-primary">
            {currentStep.message || t('progress.messages.0')}
          </p>
        </div>

        {/* Pipeline steps */}
        <div className="space-y-3">
          {visibleSteps.map((step, i) => {
            const status = getStepStatus(step.key, currentStep.step, i, visibleSteps);
            return (
              <div
                key={step.key}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-500 ${
                  status === 'done'
                    ? 'bg-success/5 border border-success/20'
                    : status === 'active'
                    ? 'bg-primary/5 border border-primary/30'
                    : 'bg-card border border-card-border opacity-40'
                }`}
              >
                {/* Status indicator */}
                <div className="flex-shrink-0 w-7 h-7 flex items-center justify-center">
                  {status === 'done' ? (
                    <svg
                      className="w-5 h-5 text-success"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  ) : status === 'active' ? (
                    <div className="w-5 h-5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border-2 border-card-border" />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`text-sm font-medium ${
                    status === 'done'
                      ? 'text-success'
                      : status === 'active'
                      ? 'text-primary'
                      : 'text-text-secondary'
                  }`}
                >
                  {t(`progress.steps.${step.key}`)}
                </span>

                {/* Step number */}
                <span className="ml-auto text-xs text-text-secondary">
                  {t('progress.stepLabel')} {i + 1}/{visibleSteps.length}
                </span>
              </div>
            );
          })}
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <div className="h-2 rounded-full bg-card-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-success transition-all duration-700 ease-out"
              style={{ width: `${currentStep.progress}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary text-center">
            {t('progress.percentComplete', { percent: String(Math.round(currentStep.progress)) })}
          </p>
        </div>
      </div>
    </div>
  );
}
