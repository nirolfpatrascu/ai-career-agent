-- User quotas table — tracks weekly usage limits per user and Stripe subscription state
create table if not exists user_quotas (
  user_id uuid primary key references auth.users on delete cascade,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  week_start timestamp with time zone not null default date_trunc('week', now()),

  -- Usage counters (reset weekly)
  analyses_used integer not null default 0,
  cv_generations_used integer not null default 0,
  cover_letters_used integer not null default 0,
  coach_requests_used integer not null default 0,

  -- Limits (set by plan, overrideable per-user)
  analyses_limit integer not null default 1,
  cv_limit integer not null default 1,
  cover_letter_limit integer not null default 1,
  coach_limit integer not null default 0,

  -- One-time free initial analysis flag
  has_used_initial_analysis boolean not null default false,

  -- Stripe subscription fields
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled', 'trialing')),
  subscription_period_end timestamp with time zone,

  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table user_quotas enable row level security;

-- Users can read their own quota row
create policy "Users can view own quota"
  on user_quotas for select
  using (auth.uid() = user_id);

-- Users can insert their own quota row (lazy-create on first request)
create policy "Users can insert own quota"
  on user_quotas for insert
  with check (auth.uid() = user_id);

-- Users can update their own quota row
create policy "Users can update own quota"
  on user_quotas for update
  using (auth.uid() = user_id);

-- Index for fast lookup
create index if not exists idx_user_quotas_user_id on user_quotas(user_id);
