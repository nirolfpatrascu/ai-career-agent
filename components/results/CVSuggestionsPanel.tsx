'use client';

import { useState } from 'react';
import type { CVSuggestion } from '@/lib/types';
import { useTranslation } from '@/lib/i18n';

interface CVSuggestionsPanelProps {
  suggestions: CVSuggestion[];
}

function CopyBtn({ text }: { text: string }) {
  const { t } = useTranslation();
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* fallback: do nothing */ }
  };
  return (
    <button
      onClick={handleCopy}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
        copied
          ? 'bg-success/10 text-success border border-success/20'
          : 'bg-black/[0.03] text-text-tertiary hover:text-text-primary border border-black/[0.08] hover:border-primary/20'
      }`}
    >
      {copied ? (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
          {t('cv.copied')}
        </>
      ) : (
        <>
          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          {t('cv.copy')}
        </>
      )}
    </button>
  );
}

export default function CVSuggestionsPanel({ suggestions }: CVSuggestionsPanelProps) {
  const { t } = useTranslation();

  if (!suggestions.length) {
    return (
      <div className="text-center py-12 text-text-tertiary text-sm">
        {t('cvSuggestions.empty')}
      </div>
    );
  }

  return (
    <section>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary font-display">{t('cvSuggestions.title')}</h2>
          <p className="text-sm text-text-secondary mt-0.5">{t('cvSuggestions.subtitle')}</p>
        </div>
      </div>

      <div className="space-y-4">
        {suggestions.map((suggestion, i) => (
          <div key={i} className="rounded-2xl border border-black/[0.08] bg-white overflow-hidden">
            {/* Section header */}
            <div className="flex items-center justify-between px-5 py-3 border-b border-black/[0.06] bg-black/[0.02]">
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">{suggestion.section}</span>
              <CopyBtn text={suggestion.suggested} />
            </div>

            <div className="p-5">
              {/* Current vs Suggested */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl bg-danger/[0.04] border border-danger/10 p-4">
                  <p className="text-[11px] font-semibold text-danger uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    {t('results.jobMatch.current')}
                  </p>
                  <p className="text-sm text-text-secondary leading-relaxed">{suggestion.current}</p>
                </div>
                <div className="rounded-xl bg-success/[0.04] border border-success/10 p-4">
                  <p className="text-[11px] font-semibold text-success uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                    {t('results.jobMatch.suggested')}
                  </p>
                  <p className="text-sm text-text-primary leading-relaxed">{suggestion.suggested}</p>
                </div>
              </div>

              {/* Reasoning */}
              <div className="flex items-start gap-2 px-1">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="flex-shrink-0 mt-0.5 text-text-tertiary">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/>
                </svg>
                <p className="text-xs text-text-tertiary leading-relaxed">{suggestion.reasoning}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}