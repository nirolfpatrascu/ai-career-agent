'use client';

import { useEffect, useState, useMemo } from 'react';
import { getFitScoreColor } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import type { FitScore } from '@/lib/types';

interface FitScoreGaugeProps {
  fitScore: FitScore;
}

// Generate confetti particles for high scores
function ConfettiParticles({ color }: { color: string }) {
  const particles = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      x: 50 + (Math.random() - 0.5) * 60,
      y: 50 + (Math.random() - 0.5) * 60,
      size: 3 + Math.random() * 4,
      delay: Math.random() * 0.8,
      duration: 1.5 + Math.random() * 1,
      rotation: Math.random() * 360,
      color: i % 3 === 0 ? color : i % 3 === 1 ? '#22C55E' : '#E8890A',
    }));
  }, [color]);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti-burst"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            transform: `rotate(${p.rotation}deg)`,
          }}
        />
      ))}
    </div>
  );
}

export default function FitScoreGauge({ fitScore }: FitScoreGaugeProps) {
  const { t } = useTranslation();
  const [animated, setAnimated] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const color = getFitScoreColor(fitScore.score);
  const percentage = fitScore.score / 10;
  const radius = 56;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - percentage);
  const isHighScore = fitScore.score >= 7;

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(true), 200);
    // Trigger confetti after gauge animation completes
    const confettiTimer = isHighScore ? setTimeout(() => setShowConfetti(true), 2000) : undefined;
    return () => {
      clearTimeout(timer);
      if (confettiTimer) clearTimeout(confettiTimer);
    };
  }, [isHighScore]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-black/[0.08] bg-white py-12 px-6">
      {/* Confetti for high scores */}
      {showConfetti && isHighScore && <ConfettiParticles color={color} />}

      {/* Subtle radial glow behind gauge */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full blur-[80px] transition-opacity duration-1000"
        style={{ backgroundColor: color, opacity: animated ? 0.12 : 0 }}
      />

      <div className="relative z-10 flex flex-col items-center gap-7">
        {/* Gauge */}
        <div className="relative w-44 h-44">
          <svg className="w-44 h-44 -rotate-90" viewBox="0 0 128 128">
            {/* Track */}
            <circle
              cx="64" cy="64" r={radius}
              fill="none"
              stroke="rgba(0,0,0,0.06)"
              strokeWidth="10"
            />
            {/* Animated arc */}
            <circle
              cx="64" cy="64" r={radius}
              fill="none"
              stroke={color}
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={animated ? strokeDashoffset : circumference}
              style={{
                transition: 'stroke-dashoffset 1.8s cubic-bezier(0.16, 1, 0.3, 1)',
                filter: `drop-shadow(0 0 8px ${color}60)`,
              }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span
              className="text-5xl font-extrabold font-display tabular-nums transition-colors duration-500"
              style={{ color }}
            >
              {fitScore.score}
            </span>
            <span className="text-sm text-text-tertiary font-medium">/10</span>
          </div>
        </div>

        {/* Label + summary */}
        <div className="text-center space-y-3 max-w-2xl">
          <span
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-semibold"
            style={{
              backgroundColor: `${color}10`,
              color: color,
              border: `1px solid ${color}20`,
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
            {fitScore.label}
          </span>
          <p className="text-text-secondary leading-relaxed text-sm sm:text-base">
            {fitScore.summary}
          </p>
        </div>
      </div>
    </div>
  );
}