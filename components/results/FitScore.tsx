'use client';

import { useEffect, useState } from 'react';
import { getFitScoreColor } from '@/lib/utils';
import type { FitScore } from '@/lib/types';

interface FitScoreGaugeProps {
  fitScore: FitScore;
}

export default function FitScoreGauge({ fitScore }: FitScoreGaugeProps) {
  const [animated, setAnimated] = useState(false);
  const color = getFitScoreColor(fitScore.score);
  const percentage = fitScore.score / 10;
  const circumference = 2 * Math.PI * 54; // radius = 54
  const strokeDashoffset = circumference * (1 - percentage);

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="card text-center py-10">
      <div className="flex flex-col items-center gap-6">
        {/* Gauge */}
        <div className="relative w-40 h-40">
          <svg className="w-40 h-40 -rotate-90" viewBox="0 0 120 120">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="#27272A"
              strokeWidth="8"
            />
            {/* Animated foreground */}
            <circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? strokeDashoffset : circumference}
              className="transition-all duration-[1.5s] ease-out"
            />
          </svg>

          {/* Score text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-4xl font-bold"
              style={{ color }}
            >
              {fitScore.score}
            </span>
            <span className="text-sm text-text-secondary">/10</span>
          </div>
        </div>

        {/* Label and summary */}
        <div className="space-y-3 max-w-2xl">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${color}15`,
              color: color,
              border: `1px solid ${color}30`,
            }}
          >
            {fitScore.label}
          </div>
          <p className="text-text-secondary leading-relaxed">
            {fitScore.summary}
          </p>
        </div>
      </div>
    </div>
  );
}
