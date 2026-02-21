-- Add Upwork-specific fields to job_applications
alter table job_applications
  add column if not exists source text default 'manual',
  add column if not exists metadata jsonb;

-- Add Upwork profile storage
create table if not exists upwork_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null unique,
  profile_data jsonb not null,
  analysis_data jsonb,
  updated_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

alter table upwork_profiles enable row level security;

create policy "Users can view own Upwork profile"
  on upwork_profiles for select using (auth.uid() = user_id);
create policy "Users can upsert own Upwork profile"
  on upwork_profiles for insert with check (auth.uid() = user_id);
create policy "Users can update own Upwork profile"
  on upwork_profiles for update using (auth.uid() = user_id);
create policy "Users can delete own Upwork profile"
  on upwork_profiles for delete using (auth.uid() = user_id);
