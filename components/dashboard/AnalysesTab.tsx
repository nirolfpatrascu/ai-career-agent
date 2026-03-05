'use client';

import Link from 'next/link';
import { useTranslation } from '@/lib/i18n';

interface SavedAnalysis {
  id: string;
  target_role: string;
  current_role: string;
  country: string;
  fit_score: number;
  fit_label: string;
  cv_filename: string | null;
  language: string;
  created_at: string;
}

interface AnalysesTabProps {
  analyses: SavedAnalysis[];
  loading: boolean;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  deleting: string | null;
}

function ScoreBadge({ score }: { score: number }) {
  const color = score >= 7 ? 'text-success bg-success/10 border-success/20'
    : score >= 5 ? 'text-amber-400 bg-amber-400/10 border-amber-400/20'
    : 'text-danger bg-danger/10 border-danger/20';

  return (
    <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl border text-lg font-bold ${color}`}>
      {score}
    </span>
  );
}

export default function AnalysesTab({ analyses, loading, onOpen, onDelete, deleting }: AnalysesTabProps) {
  const { t } = useTranslation();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5 animate-pulse">
            <div className="h-5 bg-black/[0.04] rounded w-3/4 mb-3" />
            <div className="h-4 bg-black/[0.03] rounded w-1/2 mb-2" />
            <div className="h-4 bg-black/[0.03] rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  if (analyses.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-black/[0.04] border border-black/[0.06] flex items-center justify-center mx-auto mb-4">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-text-tertiary">
            <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="9" x2="21" y2="9"/><line x1="9" y1="21" x2="9" y2="9"/>
          </svg>
        </div>
        <p className="text-text-secondary mb-1">{t('dashboard.empty')}</p>
        <p className="text-text-tertiary text-sm mb-6">{t('dashboard.emptySubtitle')}</p>
        <Link href="/analyze" className="btn-primary text-sm">
          {t('dashboard.startFirst')}
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {analyses.map((a) => (
        <div
          key={a.id}
          className="group bg-black/[0.03] border border-black/[0.06] rounded-2xl p-5 hover:border-primary/20 hover:bg-black/[0.04] transition-all duration-200 cursor-pointer relative"
          onClick={() => onOpen(a.id)}
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-text-primary truncate">
                {a.target_role}
              </h3>
              <p className="text-xs text-text-tertiary mt-0.5">
                {a.country} • {new Date(a.created_at).toLocaleDateString(undefined, {
                  year: 'numeric', month: 'short', day: 'numeric'
                })}
              </p>
            </div>
            <ScoreBadge score={a.fit_score} />
          </div>

          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-md ${
              a.fit_score >= 7 ? 'bg-success/10 text-success'
              : a.fit_score >= 5 ? 'bg-amber-400/10 text-amber-400'
              : 'bg-danger/10 text-danger'
            }`}>
              {a.fit_label}
            </span>
            {a.cv_filename && (
              <span className="text-xs text-text-tertiary truncate max-w-[150px]">
                {a.cv_filename}
              </span>
            )}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-black/[0.06]">
            <span className="text-xs text-primary font-medium group-hover:underline">
              {t('dashboard.viewAnalysis')} →
            </span>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(a.id); }}
              disabled={deleting === a.id}
              className="text-text-tertiary hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/[0.06] disabled:opacity-50"
              title={t('dashboard.delete')}
            >
              {deleting === a.id ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="animate-spin">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                </svg>
              ) : (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
