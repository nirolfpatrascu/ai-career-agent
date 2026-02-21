-- Job applications tracker
create table if not exists job_applications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,

  -- Job info
  company text not null,
  role_title text not null,
  job_url text,
  job_posting_text text,
  location text,
  work_type text default 'remote',        -- 'remote' | 'hybrid' | 'onsite' | 'flexible'

  -- Salary
  salary_min integer,
  salary_max integer,
  currency text default 'EUR',

  -- Status tracking
  status text default 'saved',             -- 'saved' | 'applied' | 'interviewing' | 'offer' | 'rejected' | 'withdrawn'
  status_updated_at timestamp with time zone default now(),

  -- Dates
  applied_at timestamp with time zone,
  follow_up_at timestamp with time zone,

  -- GapZero integration
  analysis_id uuid references analyses(id) on delete set null,
  match_score integer,                     -- cached ATS/fit match score (0-100)

  -- Notes
  notes text,
  contact_name text,
  contact_email text,

  -- Sort order within status column (for drag-and-drop reordering)
  sort_order integer default 0,

  -- Timestamps
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLS
alter table job_applications enable row level security;

create policy "Users can view own jobs"
  on job_applications for select
  using (auth.uid() = user_id);

create policy "Users can insert own jobs"
  on job_applications for insert
  with check (auth.uid() = user_id);

create policy "Users can update own jobs"
  on job_applications for update
  using (auth.uid() = user_id);

create policy "Users can delete own jobs"
  on job_applications for delete
  using (auth.uid() = user_id);

-- Indexes
create index idx_job_apps_user on job_applications(user_id);
create index idx_job_apps_status on job_applications(user_id, status);
create index idx_job_apps_follow_up on job_applications(user_id, follow_up_at)
  where follow_up_at is not null;

-- Auto-update updated_at
create or replace function update_job_app_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  if new.status != old.status then
    new.status_updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;

create trigger job_app_updated_at
  before update on job_applications
  for each row execute function update_job_app_updated_at();
