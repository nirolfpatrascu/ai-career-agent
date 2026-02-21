'use client';

import { useTranslation } from '@/lib/i18n';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function DeleteConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  loading,
}: DeleteConfirmDialogProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-2xl border border-black/[0.08] shadow-xl max-w-sm w-full p-6 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-lg font-bold text-text-primary font-display mb-2">
          {title}
        </h3>
        <p className="text-sm text-text-secondary mb-6">
          {message}
        </p>
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-text-secondary bg-black/[0.04] border border-black/[0.08] hover:bg-black/[0.06] transition-all duration-200 disabled:opacity-50"
          >
            {t('jobs.cancel')}
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-white bg-[#EF4444] hover:bg-[#DC2626] transition-all duration-200 disabled:opacity-50 flex items-center gap-2"
          >
            {loading && (
              <svg
                className="animate-spin w-3.5 h-3.5"
                viewBox="0 0 24 24"
                fill="none"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            )}
            {t('jobs.delete')}
          </button>
        </div>
      </div>
    </div>
  );
}
