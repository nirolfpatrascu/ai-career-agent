-- ============================================================================
-- GapZero — Career Profiles Migration
-- Stores persistent user profile data so the wizard only runs once.
-- Run this in Supabase SQL Editor after 001 (schema.sql).
-- ============================================================================

-- 1. Career profiles table
create table if not exists public.career_profiles (
  user_id uuid references auth.users(id) on delete cascade primary key,
  current_role text,
  target_role text,
  years_experience integer,
  country text,
  work_preference text check (work_preference in ('remote','hybrid','onsite','flexible')),
  github_url text,
  cv_storage_path text,        -- Supabase Storage path: {user_id}/cv.pdf
  linkedin_storage_path text,  -- Supabase Storage path: {user_id}/linkedin.pdf
  cv_filename text,
  linkedin_filename text,
  extracted_profile jsonb,     -- Cached ExtractedProfile from last analysis
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- 2. Row Level Security
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

-- 3. Updated_at trigger (reuses handle_updated_at from schema.sql)
create trigger on_career_profiles_updated
  before update on public.career_profiles
  for each row execute function public.handle_updated_at();

-- 4. Storage bucket for user documents
-- Run this via Supabase Dashboard → Storage → Create bucket:
--   Name: user-documents
--   Public: false
--   File size limit: 5MB
--   Allowed MIME types: application/pdf

-- Storage RLS policies (run in SQL Editor):
-- Users can upload to their own folder
create policy "Users can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can read their own documents
create policy "Users can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can update their own documents
create policy "Users can update own documents"
  on storage.objects for update
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own documents
create policy "Users can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'user-documents'
    and (storage.foldername(name))[1] = auth.uid()::text
  );
