'use client';

import { useEffect } from 'react';
import { X } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const TOAST_COLORS: Record<string, { bg: string; border: string; text: string }> = {
  success: { bg: 'bg-white', border: 'border-l-[#22C55E]', text: 'text-[#22C55E]' },
  error: { bg: 'bg-white', border: 'border-l-[#EF4444]', text: 'text-[#EF4444]' },
  info: { bg: 'bg-white', border: 'border-l-[#3B82F6]', text: 'text-[#3B82F6]' },
};

export default function Toast({ message, type, onClose }: ToastProps) {
  const { t } = useTranslation();

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = TOAST_COLORS[type];

  return (
    <div
      className={`fixed bottom-6 right-6 z-[60] ${colors.bg} border border-black/[0.08] ${colors.border} border-l-4 rounded-xl shadow-lg shadow-black/[0.08] px-4 py-3 flex items-center gap-3 min-w-[280px] max-w-[400px] animate-slide-up transition-all duration-300`}
      role="alert"
    >
      <span className={`text-sm font-medium text-text-primary flex-1`}>
        {message}
      </span>
      <button
        onClick={onClose}
        className="text-text-tertiary hover:text-text-primary transition-colors p-0.5 rounded-lg hover:bg-black/[0.04] flex-shrink-0"
        aria-label={t('common.close')}
      >
        <X size={14} />
      </button>
    </div>
  );
}
