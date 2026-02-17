'use client';

import { useEffect, useState } from 'react';

const PROGRESS_MESSAGES = [
  { text: 'Reading your CV...', icon: '📄' },
  { text: 'Extracting skills and experience...', icon: '🔍' },
  { text: 'Analyzing market positioning...', icon: '📊' },
  { text: 'Identifying skill gaps...', icon: '🎯' },
  { text: 'Building your career roadmap...', icon: '🗺️' },
  { text: 'Calculating salary benchmarks...', icon: '💰' },
  { text: 'Generating your personalized report...', icon: '✨' },
];

export default function AnalysisProgress() {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  // Rotate messages every 4 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setMessageIndex((prev) =>
        prev < PROGRESS_MESSAGES.length - 1 ? prev + 1 : prev
      );
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Animate progress bar (ease out over ~60 seconds)
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95; // Never reach 100 until actually done
        // Fast at start, slow at end
        const remaining = 95 - prev;
        const increment = remaining * 0.02;
        return prev + Math.max(increment, 0.1);
      });
    }, 200);
    return () => clearInterval(interval);
  }, []);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
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
            This typically takes 30-60 seconds
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

          <div className="flex items-center justify-between text-xs text-text-secondary">
            <span>{Math.round(progress)}% complete</span>
            <span>{elapsed}s elapsed</span>
          </div>
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
