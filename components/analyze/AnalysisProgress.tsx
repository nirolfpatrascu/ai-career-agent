'use client';

import { useEffect, useState } from 'react';
import { useTranslation } from '@/lib/i18n';

const MESSAGE_ICONS = ['📄', '🔍', '📊', '🎯', '🏢', '🗺️', '💰', '✨', '🌐'];

const CHECKPOINTS = [
  { seconds: 0, progress: 0 },
  { seconds: 10, progress: 10 },
  { seconds: 20, progress: 20 },
  { seconds: 35, progress: 32 },
  { seconds: 50, progress: 45 },
  { seconds: 65, progress: 55 },
  { seconds: 80, progress: 65 },
  { seconds: 95, progress: 75 },
  { seconds: 110, progress: 83 },
  { seconds: 125, progress: 90 },
  { seconds: 140, progress: 94 },
  { seconds: 160, progress: 96 },
];

function getTargetProgress(elapsedSeconds: number): number {
  for (let i = CHECKPOINTS.length - 1; i >= 0; i--) {
    if (elapsedSeconds >= CHECKPOINTS[i].seconds) {
      if (i === CHECKPOINTS.length - 1) return CHECKPOINTS[i].progress;
      const curr = CHECKPOINTS[i];
      const next = CHECKPOINTS[i + 1];
      const segmentProgress = (elapsedSeconds - curr.seconds) / (next.seconds - curr.seconds);
      return curr.progress + (next.progress - curr.progress) * segmentProgress;
    }
  }
  return 0;
}

export default function AnalysisProgress() {
  const { t } = useTranslation();
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  // Load translated messages individually by index
  const messages: string[] = MESSAGE_ICONS.map((_, i) => t(`progress.messages.${i}`));

  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) => (prev < messages.length - 1 ? prev + 1 : prev));
    }, 12000);
    return () => clearInterval(interval);
  }, [messages.length]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        const elapsed = prev;
        return getTargetProgress(elapsed + 0.5);
      });
    }, 500);

    // Use a separate counter for elapsed time
    let elapsed = 0;
    const timer = setInterval(() => {
      elapsed += 0.5;
      setProgress(getTargetProgress(elapsed));
    }, 500);

    return () => {
      clearInterval(interval);
      clearInterval(timer);
    };
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        <div className="relative w-24 h-24 mx-auto">
          <div className="absolute inset-0 rounded-full border-2 border-card-border" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          <div className="absolute inset-3 rounded-full bg-primary/5 animate-pulse flex items-center justify-center">
            <span className="text-2xl">{MESSAGE_ICONS[messageIndex]}</span>
          </div>
        </div>

        <div className="space-y-2">
          <p className="text-xl font-semibold text-text-primary transition-all duration-300">
            {messages[messageIndex]}
          </p>
          <p className="text-sm text-text-secondary">
            {t('progress.typicallyTakes')}
          </p>
        </div>

        <div className="space-y-3">
          <div className="h-2 rounded-full bg-card-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-text-secondary">
            {t('progress.percentComplete', { percent: String(Math.round(progress)) })}
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          {MESSAGE_ICONS.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= messageIndex ? 'bg-primary scale-100' : 'bg-card-border scale-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}