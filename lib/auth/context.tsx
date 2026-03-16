'use client';

import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { TermsAcceptanceModal } from '@/components/auth/TermsAcceptanceModal';
import type { User, Session } from '@supabase/supabase-js';

// Bump this string whenever you publish a material update to T&C or Privacy Policy.
// All signed-in users with a different (or null) terms_version will see the acceptance modal.
export const CURRENT_TERMS_VERSION = '2026-03';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithGitHub: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<{ error: string | null }>;
  signUpWithEmail: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  acceptTerms: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsTermsAcceptance, setNeedsTermsAcceptance] = useState(false);
  // Tracks the userId whose terms we've already confirmed this session.
  // Prevents re-querying the DB (and re-showing the modal) on every tab focus,
  // because Supabase fires SIGNED_IN on each session refresh, not only on login.
  const termsConfirmedForRef = useRef<string | null>(null);

  useEffect(() => {
    // Check whether a signed-in user has accepted the current terms version.
    // Skips the DB call if we already confirmed acceptance for this user.
    const checkTerms = async (u: User) => {
      if (termsConfirmedForRef.current === u.id) return;
      const { data } = await supabase
        .from('profiles')
        .select('terms_version')
        .eq('id', u.id)
        .single();
      if (!data?.terms_version || data.terms_version !== CURRENT_TERMS_VERSION) {
        setNeedsTermsAcceptance(true);
      } else {
        // Mark as confirmed so tab-focus SIGNED_IN events don't re-check
        termsConfirmedForRef.current = u.id;
      }
    };

    // Restore existing session on mount
    supabase.auth.getSession().then(({ data: { session: s } }) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      if (s?.user) checkTerms(s.user);
    });

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, s) => {
      setSession(s);
      setUser(s?.user ?? null);
      setLoading(false);
      // Check terms on fresh sign-in (not on token refresh — avoids unnecessary DB reads)
      if (event === 'SIGNED_IN' && s?.user) checkTerms(s.user);
      // Clear the gate when the user signs out
      if (!s?.user) {
        setNeedsTermsAcceptance(false);
        termsConfirmedForRef.current = null;
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signInWithGoogle = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/analyze` },
    });
  }, []);

  const signInWithGitHub = useCallback(async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: { redirectTo: `${window.location.origin}/analyze` },
    });
  }, []);

  const signInWithEmail = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error?.message ?? null };
  }, []);

  const signUpWithEmail = useCallback(async (email: string, password: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    });
    // Record terms acceptance immediately at signup — the user checked the box to submit this form
    if (!error && data.user) {
      await supabase.from('profiles').upsert({
        id: data.user.id,
        terms_accepted_at: new Date().toISOString(),
        terms_version: CURRENT_TERMS_VERSION,
      });
    }
    return { error: error?.message ?? null };
  }, []);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  // Called by TermsAcceptanceModal when the user accepts
  const acceptTerms = useCallback(async () => {
    if (!user) return;
    await supabase.from('profiles').upsert({
      id: user.id,
      terms_accepted_at: new Date().toISOString(),
      terms_version: CURRENT_TERMS_VERSION,
    });
    termsConfirmedForRef.current = user.id;
    setNeedsTermsAcceptance(false);
  }, [user]);

  return (
    <AuthContext.Provider value={{
      user, session, loading,
      signInWithGoogle, signInWithGitHub, signInWithEmail, signUpWithEmail,
      signOut, acceptTerms,
    }}>
      {children}
      {needsTermsAcceptance && (
        <TermsAcceptanceModal onAccept={acceptTerms} onSignOut={signOut} />
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
