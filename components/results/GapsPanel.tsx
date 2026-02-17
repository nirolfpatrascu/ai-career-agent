'use client';

import { useState } from 'react';
import type { Gap } from '@/lib/types';
import { getSeverityBg } from '@/lib/utils';

interface GapsPanelProps {
  gaps: Gap[];
}

const SEVERITY_COLORS = {
  critical: { border: 'border-l-danger', dot: 'bg-danger', text: 'text-danger' },
  moderate: { border: 'border-l-warning', dot: 'bg-warning', text: 'text-warning' },
  minor: { border: 'border-l-success', dot: 'bg-success', text: 'text-success' },
};

const SEVERITY_LABELS = {
  critical: '🔴 Critical — Auto-reject level',
  moderate: '🟡 Moderate — Hurts in interviews',
  minor: '🟢 Minor — Nice to have',
};

export default function GapsPanel({ gaps }: GapsPanelProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(0);

  if (gaps.length === 0) return null;

  const criticalCount = gaps.filter((g) => g.severity === 'critical').length;
  const moderateCount = gaps.filter((g) => g.severity === 'moderate').length;
  const minorCount = gaps.filter((g) => g.severity === 'minor').length;

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-danger/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">Skill Gaps</h2>
      </div>

      {/* Summary chips */}
      <div className="flex flex-wrap gap-2 mb-5">
        {criticalCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-danger/10 text-danger border border-danger/20">
            {criticalCount} Critical
          </span>
        )}
        {moderateCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-warning/10 text-warning border border-warning/20">
            {moderateCount} Moderate
          </span>
        )}
        {minorCount > 0 && (
          <span className="text-xs font-medium px-3 py-1.5 rounded-full bg-success/10 text-success border border-success/20">
            {minorCount} Minor
          </span>
        )}
      </div>

      {/* Gap cards */}
      <div className="space-y-3">
        {gaps.map((gap, i) => {
          const colors = SEVERITY_COLORS[gap.severity];
          const isExpanded = expandedIndex === i;

          return (
            <div
              key={i}
              className={`card ${colors.border} border-l-4 cursor-pointer transition-all duration-200 hover:bg-card/80`}
              onClick={() => setExpandedIndex(isExpanded ? null : i)}
            >
              {/* Header - always visible */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${getSeverityBg(gap.severity)} border capitalize`}>
                      {gap.severity}
                    </span>
                    <span className="text-xs text-text-secondary">
                      {gap.timeToClose}
                    </span>
                  </div>
                  <h3 className="font-semibold text-text-primary">{gap.skill}</h3>
                  <p className={`text-sm mt-1 ${colors.text}`}>{gap.impact}</p>
                </div>

                {/* Expand indicator */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className={`text-text-secondary flex-shrink-0 mt-1 transition-transform duration-200 ${
                    isExpanded ? 'rotate-180' : ''
                  }`}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>

              {/* Expanded content */}
              {isExpanded && (
                <div className="mt-4 pt-4 border-t border-card-border space-y-4 animate-fade-in">
                  {/* Current vs Required */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Current Level</p>
                      <p className="text-sm text-text-primary">{gap.currentLevel}</p>
                    </div>
                    <div className="bg-background rounded-lg p-3">
                      <p className="text-xs text-text-secondary mb-1">Required Level</p>
                      <p className="text-sm text-text-primary">{gap.requiredLevel}</p>
                    </div>
                  </div>

                  {/* Closing plan */}
                  <div>
                    <p className="text-xs text-text-secondary mb-1">How to Close This Gap</p>
                    <p className="text-sm text-text-primary leading-relaxed">
                      {gap.closingPlan}
                    </p>
                  </div>

                  {/* Resources */}
                  {gap.resources.length > 0 && (
                    <div>
                      <p className="text-xs text-text-secondary mb-2">Resources</p>
                      <div className="space-y-1.5">
                        {gap.resources.map((r, ri) => (
                          <div
                            key={ri}
                            className="flex items-start gap-2 text-sm text-primary/80"
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0 mt-0.5">
                              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                              <polyline points="15 3 21 3 21 9" />
                              <line x1="10" y1="14" x2="21" y2="3" />
                            </svg>
                            {r}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
