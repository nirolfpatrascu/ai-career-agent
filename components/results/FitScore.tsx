'use client';

import { useEffect, useState, useMemo } from 'react';
import { getFitScoreColor } from '@/lib/utils';
import { useTranslation } from '@/lib/i18n';
import type { FitScore, JobMatch } from '@/lib/types';

interface FitScoreGaugeProps {
  fitScore: FitScore;
  jobMatch?: JobMatch;
  onNavigate?: (tabId: string) => void;
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

export default function FitScoreGauge({ fitScore, jobMatch, onNavigate }: FitScoreGaugeProps) {
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

      {/* Score interpretation guide */}
      <div className="relative z-10 mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3 px-2">
        <div className={`rounded-xl border p-4 text-center ${fitScore.score >= 8 ? 'border-success/30 bg-success/[0.04]' : 'border-black/[0.06] bg-black/[0.02]'}`}>
          <div className="text-lg font-bold text-success mb-1">8-10</div>
          <p className="text-xs text-text-secondary leading-relaxed">{t('results.fitScore.guide.high')}</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${fitScore.score >= 5 && fitScore.score < 8 ? 'border-warning/30 bg-warning/[0.04]' : 'border-black/[0.06] bg-black/[0.02]'}`}>
          <div className="text-lg font-bold text-warning mb-1">5-7</div>
          <p className="text-xs text-text-secondary leading-relaxed">{t('results.fitScore.guide.medium')}</p>
        </div>
        <div className={`rounded-xl border p-4 text-center ${fitScore.score < 5 ? 'border-danger/30 bg-danger/[0.04]' : 'border-black/[0.06] bg-black/[0.02]'}`}>
          <div className="text-lg font-bold text-danger mb-1">&lt; 5</div>
          <p className="text-xs text-text-secondary leading-relaxed">{t('results.fitScore.guide.low')}</p>
        </div>
      </div>

      {/* Job Match summary card */}
      {jobMatch && onNavigate && (
        <div className="relative z-10 mt-6 mx-2 rounded-2xl border border-black/[0.08] bg-white p-5">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2.5">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>
              <h3 className="font-semibold text-text-primary text-sm">{t('results.fitScore.jobMatch.title')}</h3>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-lg font-bold ${
                jobMatch.matchScore >= 75 ? 'text-success' :
                jobMatch.matchScore >= 50 ? 'text-warning' : 'text-danger'
              }`}>
                {jobMatch.matchScore}%
              </span>
              <button
                onClick={() => onNavigate('job-match')}
                className="text-xs font-medium text-primary hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/[0.06]"
              >
                {t('results.fitScore.jobMatch.viewFull')} →
              </button>
            </div>
          </div>
          {/* Matching skills */}
          {jobMatch.matchingSkills.length > 0 && (
            <div className="mb-2">
              <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.fitScore.jobMatch.matching')}</p>
              <div className="flex flex-wrap gap-1.5">
                {jobMatch.matchingSkills.slice(0, 6).map((skill, i) => (
                  <span key={i} className="text-xs px-2.5 py-1 rounded-full bg-success/10 text-success border border-success/15 font-medium">{skill}</span>
                ))}
                {jobMatch.matchingSkills.length > 6 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-black/[0.04] text-text-tertiary font-medium">+{jobMatch.matchingSkills.length - 6}</span>
                )}
              </div>
            </div>
          )}
          {/* Missing skills */}
          {jobMatch.missingSkills.length > 0 && (
            <div>
              <p className="text-[11px] font-medium text-text-tertiary uppercase tracking-wider mb-1.5">{t('results.fitScore.jobMatch.missing')}</p>
              <div className="flex flex-wrap gap-1.5">
                {jobMatch.missingSkills.slice(0, 4).map((skill, i) => (
                  <span key={i} className={`text-xs px-2.5 py-1 rounded-full border font-medium ${
                    skill.importance === 'important' ? 'bg-danger/10 text-danger border-danger/15' :
                    skill.importance === 'not_a_deal_breaker' ? 'bg-[#E8890A]/10 text-[#E8890A] border-[#E8890A]/15' :
                    'bg-black/[0.04] text-text-tertiary border-black/[0.08]'
                  }`}>{skill.skill}</span>
                ))}
                {jobMatch.missingSkills.length > 4 && (
                  <span className="text-xs px-2.5 py-1 rounded-full bg-black/[0.04] text-text-tertiary font-medium">+{jobMatch.missingSkills.length - 4}</span>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Cross-link callout for scores < 8 */}
      {fitScore.score < 8 && onNavigate && (
        <div className="relative z-10 mt-6 mx-2 rounded-xl border border-primary/15 bg-primary/[0.04] p-4 flex items-start gap-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary flex-shrink-0 mt-0.5">
            <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
          </svg>
          <div className="flex-1">
            <p className="text-sm text-text-secondary leading-relaxed">{t('results.fitScore.callout')}</p>
            <div className="flex flex-wrap gap-2 mt-3">
              <button onClick={() => onNavigate('linkedin')} className="text-xs font-medium text-primary hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/[0.06]">
                {t('linkedin.title')} →
              </button>
              <button onClick={() => onNavigate('cv-optimizer')} className="text-xs font-medium text-primary hover:text-primary-light transition-colors px-3 py-1.5 rounded-lg border border-primary/20 hover:bg-primary/[0.06]">
                {t('nav.cvOptimizer')} →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}