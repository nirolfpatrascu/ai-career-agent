'use client';

import { useEffect, useState } from 'react';

const PROGRESS_MESSAGES = [
  { text: 'Reading your CV...', icon: '📄' },
  { text: 'Extracting skills and experience...', icon: '🔍' },
  { text: 'Analyzing market positioning...', icon: '📊' },
  { text: 'Identifying skill gaps...', icon: '🎯' },
  { text: 'Matching against target roles...', icon: '🏢' },
  { text: 'Building your career roadmap...', icon: '🗺️' },
  { text: 'Calculating salary benchmarks...', icon: '💰' },
  { text: 'Generating your personalized report...', icon: '✨' },
];

// Target: reach ~92% at 90s, hold at 95% until done
const CHECKPOINTS = [
  { seconds: 0, progress: 0 },
  { seconds: 10, progress: 12 },
  { seconds: 20, progress: 25 },
  { seconds: 30, progress: 38 },
  { seconds: 45, progress: 52 },
  { seconds: 60, progress: 68 },
  { seconds: 75, progress: 80 },
  { seconds: 90, progress: 90 },
  { seconds: 105, progress: 94 },
  { seconds: 120, progress: 95 },
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
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Rotate messages every 12 seconds (8 messages over ~96 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 12000);
    return () => clearInterval(interval);
  }, []);

  // Update progress based on elapsed time
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => {
        const newElapsed = prev + 0.5;
        setProgress(getTargetProgress(newElapsed));
        return newElapsed;
      });
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-lg w-full text-center space-y-8">
        {/* Animated spinner */}
        <div className="relative w-24 h-24 mx-auto">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border-2 border-card-border" />
          {/* Spinning arc */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin" />
          {/* Inner pulse */}
          <div className="absolute inset-3 rounded-full bg-primary/5 animate-pulse flex items-center justify-center">
            <span className="text-2xl">
              {PROGRESS_MESSAGES[messageIndex].icon}
            </span>
          </div>
        </div>

        {/* Current message */}
        <div className="space-y-2">
          <p className="text-xl font-semibold text-text-primary transition-all duration-300">
            {PROGRESS_MESSAGES[messageIndex].text}
          </p>
          <p className="text-sm text-text-secondary">
            This typically takes 60-90 seconds
          </p>
        </div>

        {/* Progress bar */}
        <div className="space-y-3">
          <div className="h-2 rounded-full bg-card-border overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="text-center text-xs text-text-secondary">
            <span>{Math.round(progress)}% complete</span>
          </div>

        {/* Steps completed indicator */}
        <div className="flex items-center justify-center gap-3">
          {PROGRESS_MESSAGES.map((_, i) => (
            <div
              key={i}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                i <= messageIndex
                  ? 'bg-primary scale-100'
                  : 'bg-card-border scale-75'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}