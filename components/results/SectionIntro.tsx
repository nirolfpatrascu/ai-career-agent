'use client';

import { useTranslation } from '@/lib/i18n';

interface SectionIntroProps {
  messageKey: string;
  variant?: 'encouraging' | 'neutral' | 'celebratory';
}

const VARIANT_STYLES = {
  encouraging: 'bg-primary/[0.04] border-primary/10 text-primary',
  neutral: 'bg-black/[0.03] border-black/[0.06] text-text-secondary',
  celebratory: 'bg-success/[0.04] border-success/10 text-success',
};

const VARIANT_ICONS = {
  encouraging: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/></svg>
  ),
  neutral: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
  ),
  celebratory: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
  ),
};

export default function SectionIntro({ messageKey, variant = 'encouraging' }: SectionIntroProps) {
  const { t } = useTranslation();
  const message = t(messageKey);

  // Don't render if key not found (returns the key itself)
  if (message === messageKey) return null;

  return (
    <div className={`flex items-start gap-3 rounded-xl border px-4 py-3 mb-6 text-sm leading-relaxed ${VARIANT_STYLES[variant]}`}>
      <span className="flex-shrink-0 mt-0.5">{VARIANT_ICONS[variant]}</span>
      <p>{message}</p>
    </div>
  );
}