-- ============================================================================
-- GapZero — Supabase Database Schema
-- Run this in Supabase SQL Editor (Dashboard → SQL Editor → New Query)
-- ============================================================================

-- 1. Analyses table — stores full analysis results as JSONB
create table if not exists public.analyses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  target_role text not null,
  "current_role" text not null,
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
  terms_accepted_at timestamptz,          -- when the user explicitly accepted the T&C
  terms_version text,                     -- version string, e.g. '2026-03'
  created_at timestamptz default now() not null
);

create index if not exists profiles_terms_version_idx on public.profiles(terms_version);

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

-- 7. Career Profiles table — persistent user career settings
create table if not exists public.career_profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  "current_role" text,
  target_role text,
  years_experience integer,
  country text,
  work_preference text,                  -- 'remote' | 'hybrid' | 'onsite'
  github_url text,
  cv_storage_path text,
  linkedin_storage_path text,
  cv_filename text,
  linkedin_filename text,
  extracted_profile jsonb,
  additional_context text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.career_profiles enable row level security;

create policy "Users can view own career profile"
  on public.career_profiles for select
  using (auth.uid() = user_id);

create policy "Users can insert own career profile"
  on public.career_profiles for insert
  with check (auth.uid() = user_id);

create policy "Users can update own career profile"
  on public.career_profiles for update
  using (auth.uid() = user_id);

create policy "Users can delete own career profile"
  on public.career_profiles for delete
  using (auth.uid() = user_id);

create trigger on_career_profiles_updated
  before update on public.career_profiles
  for each row execute function public.handle_updated_at();

-- 8. Output Tags table — user-applied tags on analysis output items
create table if not exists public.output_tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete cascade not null,
  section text not null,
  element_index integer,
  element_key text,
  tagged_text text,
  tag text not null,                     -- 'accurate' | 'inaccurate' | 'irrelevant' | 'missing_context' | 'too_generic'
  comment text,
  created_at timestamptz default now() not null
);

create index if not exists output_tags_analysis_id_idx on public.output_tags(analysis_id);
create index if not exists output_tags_user_id_idx on public.output_tags(user_id);

alter table public.output_tags enable row level security;

create policy "Users can view own tags"
  on public.output_tags for select
  using (auth.uid() = user_id);

create policy "Users can insert own tags"
  on public.output_tags for insert
  with check (auth.uid() = user_id);

create policy "Users can delete own tags"
  on public.output_tags for delete
  using (auth.uid() = user_id);

-- 9. Feedback table — thumbs up/down ratings per output section
create table if not exists public.feedback (
  id uuid default gen_random_uuid() primary key,
  analysis_id uuid references public.analyses(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  section text not null,          -- e.g. 'fitScore', 'gap-2', 'actionPlan-thirtyDays-0'
  rating boolean not null,        -- true = helpful, false = not helpful
  comment text,                   -- optional free-text (thumbs down only)
  created_at timestamptz default now() not null
);

create index if not exists feedback_analysis_id_idx on public.feedback(analysis_id);
create index if not exists feedback_section_idx on public.feedback(section);
create index if not exists feedback_rating_idx on public.feedback(rating);
create index if not exists feedback_created_at_idx on public.feedback(created_at desc);

-- No RLS on feedback — allow anonymous inserts (rate-limited at API level)
alter table public.feedback enable row level security;

create policy "Anyone can insert feedback"
  on public.feedback for insert
  with check (true);

create policy "Admins can read all feedback"
  on public.feedback for select
  using (auth.role() = 'service_role');

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
