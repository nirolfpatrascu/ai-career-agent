'use client';

import { useState } from 'react';
import type { JobMatch } from '@/lib/types';

interface JobMatchPanelProps {
  match: JobMatch;
}

export default function JobMatchPanel({ match }: JobMatchPanelProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#22C55E';
    if (score >= 60) return '#3B82F6';
    if (score >= 40) return '#EAB308';
    return '#EF4444';
  };

  const color = getScoreColor(match.matchScore);

  return (
    <section>
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-text-primary">Job Match Analysis</h2>
      </div>

      <div className="space-y-4">
        {/* Match score */}
        <div className="card text-center py-8">
          <div
            className="text-5xl font-bold mb-2"
            style={{ color }}
          >
            {match.matchScore}%
          </div>
          <p className="text-text-secondary">Match Score</p>
        </div>

        {/* Skills comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Matching */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              <h3 className="text-sm font-semibold text-success">
                Matching Skills ({match.matchingSkills.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.matchingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md bg-success/10 text-success border border-success/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing */}
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <h3 className="text-sm font-semibold text-danger">
                Missing Skills ({match.missingSkills.length})
              </h3>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {match.missingSkills.map((skill, i) => (
                <span
                  key={i}
                  className="text-xs px-2.5 py-1 rounded-md bg-danger/10 text-danger border border-danger/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Overall advice */}
        <div className="card">
          <h3 className="font-semibold text-text-primary mb-2">Assessment</h3>
          <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-line">
            {match.overallAdvice}
          </p>
        </div>

        {/* CV Suggestions */}
        {match.cvSuggestions.length > 0 && (
          <div>
            <button
              onClick={() => setShowSuggestions(!showSuggestions)}
              className="flex items-center gap-2 text-primary hover:text-primary-light transition-colors text-sm font-medium mb-3"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className={`transition-transform ${showSuggestions ? 'rotate-180' : ''}`}
              >
                <polyline points="6 9 12 15 18 9" />
              </svg>
              {showSuggestions ? 'Hide' : 'Show'} CV Rewrite Suggestions ({match.cvSuggestions.length})
            </button>

            {showSuggestions && (
              <div className="space-y-3 animate-fade-in">
                {match.cvSuggestions.map((suggestion, i) => (
                  <div key={i} className="card">
                    <p className="text-xs font-medium text-primary mb-3">
                      {suggestion.section}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                      <div className="bg-danger/5 rounded-lg p-3 border border-danger/10">
                        <p className="text-xs text-danger font-medium mb-1">Current</p>
                        <p className="text-sm text-text-secondary">{suggestion.current}</p>
                      </div>
                      <div className="bg-success/5 rounded-lg p-3 border border-success/10">
                        <p className="text-xs text-success font-medium mb-1">Suggested</p>
                        <p className="text-sm text-text-primary">{suggestion.suggested}</p>
                      </div>
                    </div>
                    <p className="text-xs text-text-secondary">{suggestion.reasoning}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
