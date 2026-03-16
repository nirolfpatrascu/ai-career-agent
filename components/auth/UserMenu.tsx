'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/lib/auth/context';
import { useTranslation } from '@/lib/i18n';
import AuthForm from './AuthForm';

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
            <AuthForm onSuccess={() => setMenuOpen(false)} />
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
          <Image src={avatarUrl} alt="" width={28} height={28} className="w-7 h-7 rounded-full object-cover" referrerPolicy="no-referrer" unoptimized />
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
