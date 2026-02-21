'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';

function AuthDropdown({ onClose }: { onClose: () => void }) {
  const { t } = useTranslation();
  const { signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleEmailSubmit = useCallback(async () => {
    if (!email || !password) { setError(t('auth.fillAllFields')); return; }
    if (mode === 'signup' && !fullName) { setError(t('auth.fillAllFields')); return; }
    setLoading(true);
    setError('');
    const result = mode === 'signin'
      ? await signInWithEmail(email, password)
      : await signUpWithEmail(email, password, fullName);
    setLoading(false);
    if (result.error) { setError(result.error); }
    else if (mode === 'signup') { setEmailSent(true); }
    else { onClose(); }
  }, [email, password, fullName, mode, signInWithEmail, signUpWithEmail, onClose, t]);

  if (emailSent) {
    return (
      <div className="text-center py-4">
        <div className="w-10 h-10 rounded-full bg-success/10 border border-success/20 flex items-center justify-center mx-auto mb-3">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <p className="text-sm font-medium text-text-primary mb-1">{t('auth.checkEmail')}</p>
        <p className="text-xs text-text-tertiary">{t('auth.confirmationSent')}</p>
      </div>
    );
  }

  return (
    <>
      <p className="text-center text-sm font-semibold text-text-primary mb-1">
        {mode === 'signin' ? t('auth.signIn') : t('auth.signUp')}
      </p>
      <p className="text-center text-xs text-text-tertiary mb-4">
        {mode === 'signin' ? t('auth.signInSubtitle') : t('auth.signUpSubtitle')}
      </p>

      {/* OAuth */}
      <div className="space-y-2 mb-3">
        <button
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-2.5 bg-black/[0.04] hover:bg-black/[0.06] border border-black/[0.08] rounded-lg px-3 py-2.5 text-xs font-medium text-text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {t('auth.continueGoogle')}
        </button>
        <button
          onClick={signInWithGitHub}
          className="w-full flex items-center justify-center gap-2.5 bg-black/[0.04] hover:bg-black/[0.06] border border-black/[0.08] rounded-lg px-3 py-2.5 text-xs font-medium text-text-primary transition-colors"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          {t('auth.continueGitHub')}
        </button>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-px bg-black/[0.05]" />
        <span className="text-[10px] text-text-tertiary">{t('auth.orEmail')}</span>
        <div className="flex-1 h-px bg-black/[0.05]" />
      </div>

      {/* Email form */}
      <div className="space-y-2">
        {mode === 'signup' && (
          <input type="text" placeholder={t('auth.fullName')} value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full bg-black/[0.04] border border-black/[0.08] rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/30"
            autoComplete="name" />
        )}
        <input type="email" placeholder={t('auth.email')} value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-black/[0.04] border border-black/[0.08] rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/30"
          autoComplete="email" />
        <input type="password" placeholder={t('auth.password')} value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-black/[0.04] border border-black/[0.08] rounded-lg px-3 py-2 text-sm text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-1 focus:ring-primary/30"
          autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
          onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()} />

        {error && (
          <p className="text-xs text-danger bg-danger/[0.06] border border-danger/10 rounded-lg px-2.5 py-1.5">{error}</p>
        )}

        <button onClick={handleEmailSubmit} disabled={loading}
          className="btn-primary w-full text-xs !py-2.5 disabled:opacity-50">
          {loading ? t('auth.loading') : mode === 'signin' ? t('auth.signIn') : t('auth.createAccount')}
        </button>
      </div>

      <p className="text-center text-xs text-text-tertiary mt-3">
        {mode === 'signin' ? t('auth.noAccount') : t('auth.haveAccount')}{' '}
        <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}
          className="text-primary font-medium hover:text-primary-light transition-colors">
          {mode === 'signin' ? t('auth.signUp') : t('auth.signIn')}
        </button>
      </p>
    </>
  );
}

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    if (menuOpen) document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  if (loading) {
    return <div className="w-8 h-8 rounded-full bg-black/[0.04] animate-pulse" />;
  }

  // Not signed in — dropdown auth form
  if (!user) {
    return (
      <div ref={menuRef} className="relative">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-black/[0.04]"
        >
          {t('auth.signIn')}
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-lg shadow-black/[0.06] p-4 z-50">
            <AuthDropdown onClose={() => setMenuOpen(false)} />
          </div>
        )}
      </div>
    );
  }

  // Signed in — avatar dropdown
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-black/[0.04] transition-colors"
      >
        {avatarUrl ? (
          <img src={avatarUrl} alt="" className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" />
        ) : (
          <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
            <span className="text-[11px] font-bold text-primary">{initials}</span>
          </div>
        )}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className={`text-text-tertiary transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {menuOpen && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-xl shadow-lg shadow-black/[0.06] py-1.5 z-50">
          <div className="px-3 py-2.5 border-b border-black/[0.06] mb-1">
            <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>
          <Link href="/dashboard" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            {t('auth.myAnalyses')}
          </Link>
          <Link href="/dashboard/jobs" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
            </svg>
            {t('nav.jobTracker')}
          </Link>
          <Link href="/analyze" onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-black/[0.04] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t('common.newAnalysis')}
          </Link>
          <div className="h-px bg-black/[0.05] my-1" />
          <button onClick={() => { signOut(); setMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-danger hover:bg-danger/[0.04] transition-colors">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
            {t('auth.signOut')}
          </button>
        </div>
      )}
    </div>
  );
}
