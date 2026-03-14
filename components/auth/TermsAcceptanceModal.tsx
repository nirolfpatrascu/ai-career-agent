'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  onAccept: () => Promise<void>;
  onSignOut: () => Promise<void>;
}

export function TermsAcceptanceModal({ onAccept, onSignOut }: Props) {
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  // Don't block the legal pages themselves — let users read them
  if (pathname === '/terms' || pathname === '/privacy') return null;

  const handleAccept = async () => {
    if (!checked || loading) return;
    setLoading(true);
    await onAccept();
    setLoading(false);
  };

  const handleSignOut = async () => {
    setLoading(true);
    await onSignOut();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 sm:p-8 animate-panelEnter">

        {/* Icon */}
        <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-5">
          <svg className="w-6 h-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
          </svg>
        </div>

        {/* Heading */}
        <h2 className="text-xl font-bold text-text-primary font-display text-center mb-1">
          We&apos;ve updated our Terms
        </h2>
        <p className="text-sm text-text-secondary text-center mb-6">
          Please review and accept our Terms &amp; Conditions and Privacy Policy to continue using GapZero.
        </p>

        {/* Summary bullets */}
        <div className="rounded-xl border border-black/[0.08] bg-black/[0.02] p-4 mb-5 space-y-2.5">
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#E8890A] mt-1.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">AI outputs are guidance only</strong> — fit scores, salary estimates, CV suggestions, and career plans are best-effort AI estimates, not professional advice or guarantees.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">Your CV data stays private</strong> — it&apos;s sent to Anthropic&apos;s API for analysis only and is never used to train AI models.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full bg-success mt-1.5 flex-shrink-0" />
            <p className="text-sm text-text-secondary">
              <strong className="text-text-primary">You&apos;re in control</strong> — delete your account and all your data at any time from your dashboard.
            </p>
          </div>
        </div>

        {/* Checkbox */}
        <label className="flex items-start gap-3 mb-5 cursor-pointer group">
          <div className="relative flex-shrink-0 mt-0.5">
            <input
              type="checkbox"
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
              className="sr-only"
            />
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
              checked
                ? 'bg-primary border-primary'
                : 'border-black/20 bg-white group-hover:border-primary/50'
            }`}>
              {checked && (
                <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          </div>
          <span className="text-sm text-text-secondary leading-relaxed">
            I have read and agree to the{' '}
            <Link href="/terms" target="_blank" className="text-primary hover:underline font-medium">
              Terms &amp; Conditions
            </Link>
            {' '}and{' '}
            <Link href="/privacy" target="_blank" className="text-primary hover:underline font-medium">
              Privacy Policy
            </Link>
            , including the AI disclaimer regarding best-effort guidance.
          </span>
        </label>

        {/* Accept button */}
        <button
          onClick={handleAccept}
          disabled={!checked || loading}
          className="btn-primary w-full disabled:opacity-40 disabled:cursor-not-allowed mb-3"
        >
          {loading ? 'Saving...' : 'Accept & Continue'}
        </button>

        {/* Sign out escape hatch */}
        <button
          onClick={handleSignOut}
          disabled={loading}
          className="w-full text-sm text-text-tertiary hover:text-text-secondary transition-colors py-1.5"
        >
          Sign out instead
        </button>
      </div>
    </div>
  );
}
