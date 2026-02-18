'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import AuthModal from '@/components/auth/AuthModal';

export default function UserMenu() {
  const { t } = useTranslation();
  const { user, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [authModal, setAuthModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  if (loading) {
    return (
      <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse" />
    );
  }

  // Not signed in — show sign in button
  if (!user) {
    return (
      <>
        <button
          onClick={() => setAuthModal(true)}
          className="text-sm text-text-secondary hover:text-text-primary transition-colors px-3 py-1.5 rounded-lg hover:bg-white/[0.06]"
        >
          {t('auth.signIn')}
        </button>
        <AuthModal isOpen={authModal} onClose={() => setAuthModal(false)} />
      </>
    );
  }

  // Signed in — show avatar + dropdown
  const displayName = user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || 'User';
  const avatarUrl = user.user_metadata?.avatar_url || user.user_metadata?.picture;
  const initials = displayName.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/[0.06] transition-colors"
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
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface/95 backdrop-blur-xl border border-white/[0.12] rounded-xl shadow-xl shadow-black/50 py-1.5 z-50">
          {/* User info */}
          <div className="px-3 py-2.5 border-b border-white/[0.08] mb-1">
            <p className="text-sm font-medium text-text-primary truncate">{displayName}</p>
            <p className="text-xs text-text-tertiary truncate">{user.email}</p>
          </div>

          {/* Dashboard link */}
          <Link
            href="/dashboard"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
            </svg>
            {t('auth.myAnalyses')}
          </Link>

          {/* New analysis */}
          <Link
            href="/analyze"
            onClick={() => setMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-text-primary hover:bg-white/[0.06] transition-colors"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            {t('common.newAnalysis')}
          </Link>

          {/* Divider */}
          <div className="h-px bg-white/[0.08] my-1" />

          {/* Sign out */}
          <button
            onClick={() => { signOut(); setMenuOpen(false); }}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-text-secondary hover:text-danger hover:bg-danger/[0.04] transition-colors"
          >
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
