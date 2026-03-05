-- ============================================================================
-- GapZero — Quotas, Output Tags & Additional Context Migration
-- Run this in Supabase SQL Editor after 002 (career_profiles).
-- ============================================================================

-- ============================================================================
-- 1. User Quotas — tracks weekly usage + Stripe subscription state
-- ============================================================================

create table if not exists public.user_quotas (
  user_id uuid references auth.users(id) on delete cascade primary key,
  plan text not null default 'free' check (plan in ('free', 'pro')),

  -- Weekly counters (reset every Monday 00:00 UTC)
  week_start date not null default (date_trunc('week', now())::date),
  analyses_used integer not null default 0,
  cv_generations_used integer not null default 0,
  cover_letters_used integer not null default 0,
  coach_requests_used integer not null default 0,

  -- Limits (derived from plan, stored for override flexibility)
  analyses_limit integer not null default 1,
  cv_limit integer not null default 1,
  cover_letter_limit integer not null default 1,
  coach_limit integer not null default 0,

  -- Initial analysis tracking
  has_used_initial_analysis boolean not null default false,

  -- Stripe references
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled', 'trialing', null)),
  subscription_period_end timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS: users can read own quotas, but cannot write (server-only writes)
alter table public.user_quotas enable row level security;

create policy "Users can read own quotas"
  on public.user_quotas for select
  using (auth.uid() = user_id);

-- Auto-create quota row for new users
create or replace function public.create_user_quota()
returns trigger as $$
begin
  insert into public.user_quotas (user_id)
  values (new.id)
  on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_quota
  after insert on auth.users
  for each row execute function public.create_user_quota();

-- Updated_at trigger
create trigger on_user_quotas_updated
  before update on public.user_quotas
  for each row execute function public.handle_updated_at();

-- Weekly reset function
-- Schedule via pg_cron: SELECT cron.schedule('weekly-quota-reset', '0 0 * * 1', 'SELECT public.reset_weekly_quotas()');
create or replace function public.reset_weekly_quotas()
returns void as $$
begin
  update public.user_quotas
  set analyses_used = 0,
      cv_generations_used = 0,
      cover_letters_used = 0,
      coach_requests_used = 0,
      week_start = date_trunc('week', now())::date,
      updated_at = now()
  where week_start < date_trunc('week', now())::date;
end;
$$ language plpgsql security definer;

-- ============================================================================
-- 2. Output Tags — user-applied quality labels on analysis tokens/sections
-- ============================================================================

create table if not exists public.output_tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete cascade not null,

  -- What was tagged
  section text not null,
  element_index integer,
  element_key text,
  tagged_text text,

  -- The tag
  tag text not null check (tag in ('accurate', 'inaccurate', 'irrelevant', 'missing_context', 'too_generic')),
  comment text check (char_length(comment) <= 500),

  created_at timestamptz default now() not null
);

alter table public.output_tags enable row level security;

create policy "Users can read own tags"
  on public.output_tags for select
  using (auth.uid() = user_id);

create policy "Users can insert own tags"
  on public.output_tags for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own tags"
  on public.output_tags for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_output_tags_analysis on public.output_tags(analysis_id);
create index idx_output_tags_section_tag on public.output_tags(section, tag);
create index idx_output_tags_user on public.output_tags(user_id);

-- ============================================================================
-- 3. Additional context column on career_profiles
-- ============================================================================

alter table public.career_profiles
  add column if not exists additional_context text;
