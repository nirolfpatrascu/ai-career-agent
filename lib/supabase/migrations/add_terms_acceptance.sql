-- ============================================================================
-- Migration: add terms acceptance tracking to profiles
-- Run in Supabase Dashboard → SQL Editor
-- ============================================================================

alter table public.profiles
  add column if not exists terms_accepted_at timestamptz,
  add column if not exists terms_version text;

-- Index for fast "which users haven't accepted current terms" queries
create index if not exists profiles_terms_version_idx on public.profiles(terms_version);
