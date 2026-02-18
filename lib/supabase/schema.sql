-- ============================================================================
-- GapZero — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- 1. Analyses table — stores full analysis results as JSONB
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  target_role text not null,
  current_role text not null,
  country text not null,
  fit_score integer not null check (fit_score between 1 and 10),
  fit_label text not null,
  cv_filename text,
  language text default 'en',
  result jsonb not null,           -- Full AnalysisResult object
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Indexes
create index if not exists analyses_user_id_idx on public.analyses(user_id);
create index if not exists analyses_created_at_idx on public.analyses(created_at desc);

-- 3. Row Level Security — users can only see their own analyses
alter table public.analyses enable row level security;

create policy "Users can view own analyses"
  on public.analyses for select
  using (auth.uid() = user_id);

create policy "Users can insert own analyses"
  on public.analyses for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own analyses"
  on public.analyses for delete
  using (auth.uid() = user_id);

-- 4. Updated_at trigger
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_analyses_updated
  before update on public.analyses
  for each row execute function public.handle_updated_at();

-- 5. Profiles table (optional — for display name / avatar)
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text,
  avatar_url text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- 6. Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture', '')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
