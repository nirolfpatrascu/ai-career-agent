-- Feedback table for per-section ratings
create table if not exists feedback (
  id uuid primary key default gen_random_uuid(),
  analysis_id uuid references analyses(id) on delete cascade,
  user_id uuid references auth.users on delete set null,
  section text not null,
  rating boolean not null,
  comment text,
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table feedback enable row level security;

-- Policies: users can create feedback (even anonymous for non-logged-in users)
create policy "Anyone can insert feedback"
  on feedback for insert
  with check (true);

-- Users can view own feedback
create policy "Users can view own feedback"
  on feedback for select
  using (auth.uid() = user_id);

-- Index for lookup
create index idx_feedback_analysis on feedback(analysis_id);
create index idx_feedback_section on feedback(section);
