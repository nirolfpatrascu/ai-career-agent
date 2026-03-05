# FINALSPRINT — GapZero Monetization, Profile Hub & Quality Sprint

> **Created:** 2026-03-05
> **Scope:** 11 features across 6 work streams
> **Estimated Commits:** 25–30

---

## Table of Contents

1. [Requirements Map](#1-requirements-map)
2. [Architecture Overview](#2-architecture-overview)
3. [Work Stream A: Profile Hub Dashboard](#3-work-stream-a-profile-hub-dashboard)
4. [Work Stream B: Wizard Flow Integration](#4-work-stream-b-wizard-flow-integration)
5. [Work Stream C: Stripe Monetization & Quotas](#5-work-stream-c-stripe-monetization--quotas)
6. [Work Stream D: Output Tagging for Retraining](#6-work-stream-d-output-tagging-for-retraining)
7. [Work Stream E: CV Generation ATS Fix](#7-work-stream-e-cv-generation-ats-fix)
8. [Work Stream F: Career Coach Removal](#8-work-stream-f-career-coach-removal)
9. [Database Migrations](#9-database-migrations)
10. [i18n Keys](#10-i18n-keys)
11. [Commit Sequence](#11-commit-sequence)
12. [Testing Checklist](#12-testing-checklist)
13. [Security & Privacy Audit Checklist](#13-security--privacy-audit-checklist)

---

## 1. Requirements Map

| # | Requirement | Work Stream |
|---|-------------|-------------|
| 1 | Logged-in user sees Profile Hub Dashboard as landing page | A |
| 2 | Profile Hub holds CV, GitHub, LinkedIn + context textarea with examples | A |
| 3 | Profile Hub shows analysis history | A |
| 4 | No prior analysis → wizard as-is | B |
| 5 | Stripe payment integration | C |
| 6 | Free tier: 1 analysis/week, initial analysis free (doesn't count) | C |
| 7 | Free analysis: 1 CV generation + 1 cover letter generation | C |
| 8 | No AI Career Coach window | F |
| 9 | Paid plan: 10 weekly analyses, 10 CV, 10 cover letter, 10 coach | C |
| 10 | Output token/section tagging for retraining feedback | D |
| 11 | Fix CV generation producing lower ATS scores | E |

---

## 2. Architecture Overview

### Current State

```
Landing (/) → Marketing page
Dashboard (/dashboard) → Tabs: Profile | Analyses | Jobs
Analyze (/analyze) → Wizard → Streaming → Results
```

### Target State

```
Logged-in user:
  / or /dashboard → Profile Hub (merged landing + dashboard)
    ├─ Profile Card (CV, LinkedIn, GitHub, context textarea)
    ├─ Quick Analysis (job description → run with stored profile)
    ├─ Analysis History (list of past analyses with tags)
    └─ Jobs Tab (existing Kanban)

Not logged in:
  / → Marketing landing page (unchanged)

First-time user (logged in, no profile):
  /dashboard → Redirects to /analyze (wizard)

Payments:
  /pricing → Plan comparison + Stripe checkout
  /api/stripe/checkout → Create Stripe session
  /api/stripe/webhook → Handle payment events
  /api/stripe/portal → Customer portal redirect
```

### New Database Tables

```sql
user_quotas          — Tracks weekly usage per user
user_subscriptions   — Stripe subscription state
output_tags          — User-applied tags on analysis tokens/sections
```

---

## 3. Work Stream A: Profile Hub Dashboard

### A1. Redesign ProfileTab → Profile Hub

**File:** `components/dashboard/ProfileTab.tsx`

**Current:** Simple form card with career fields + file upload + quick re-analysis button.

**Target:** Full profile landing page with 4 sections:

#### Section 1: Profile Card
- Display: name (from auth), current role, target role, years of experience, country, work preference
- Files: CV PDF (view/replace/remove), LinkedIn PDF (view/replace/remove)
- GitHub: clickable link, show connected status
- Edit button → inline editing mode
- Visual indicators: green checkmark for uploaded files, gray placeholder for missing

#### Section 2: Additional Context Textarea
New `additional_context` column in `career_profiles` table (TEXT, max 5000 chars).

**UI:**
```
┌─────────────────────────────────────────────────────────────────┐
│ Additional Context                                         ✏️  │
│                                                                 │
│ Help us understand your full story. Write in your own words     │
│ about experiences not captured in your CV or LinkedIn:           │
│                                                                 │
│ ┌─────────────────────────────────────────────────────────────┐ │
│ │                                                             │ │
│ │ [textarea — autosaves on blur]                              │ │
│ │                                                             │ │
│ └─────────────────────────────────────────────────────────────┘ │
│                                                                 │
│ 💡 Examples of useful context:                                  │
│                                                                 │
│ • "Between 2022-2023 I took a career break to complete the      │
│    AWS Solutions Architect certification and built 3 full-stack  │
│    projects: a real-time chat app (React + Node + Socket.io),   │
│    an e-commerce platform (Next.js + Stripe), and a job         │
│    board aggregator using Python scrapers. All are on my        │
│    GitHub."                                                     │
│                                                                 │
│ • "While freelancing on Upwork (2021-2023), I delivered 15+     │
│    projects for clients in fintech and healthcare, including a  │
│    HIPAA-compliant patient portal and a real-time stock         │
│    dashboard. My JSS was 97% with $45k+ earned."               │
│                                                                 │
│ • "I've been contributing to open-source projects including     │
│    React Query (3 merged PRs) and Supabase (documentation      │
│    improvements). I also mentor 2 junior developers through     │
│    ADPList and run a tech blog with 5k monthly readers."        │
│                                                                 │
│ • "After being laid off in 2024, I used the 6-month gap to     │
│    pivot from backend to full-stack: completed the Meta         │
│    Frontend Developer certificate, learned TypeScript +         │
│    React, and built a personal finance tracker used by 200+     │
│    beta users."                                                 │
│                                                                 │
│ • "I have 3 years of hobby game development experience with     │
│    Unity and C# — I've published 2 mobile games with 10k+      │
│    combined downloads. This taught me performance optimization, │
│    event-driven architecture, and user analytics."              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Auto-save:** Debounced PUT to `/api/profile` on 2-second idle after typing.

**Pipeline integration:** Pass `additional_context` to the analysis pipeline as extra context in the skill extraction and gap analysis prompts.

#### Section 3: Quick Analysis Card
- Job description textarea + "Run Analysis" button
- Shows quota status: "2 of 10 analyses used this week" or "Free analysis available"
- If quota exceeded → shows upgrade CTA with pricing link
- On submit → navigate to `/analyze?fromProfile=true` with job description in sessionStorage

#### Section 4: Analysis History
- List of saved analyses (from existing AnalysesTab)
- Each card: target role, fit score badge, date, language flag
- Click → navigate to `/analyze?saved=<id>`
- Delete button with confirmation
- Empty state: "No analyses yet. Run your first analysis above."

### A2. Dashboard Page Updates

**File:** `app/dashboard/page.tsx`

**Changes:**
- Remove the 3-tab switcher for Profile/Analyses (merge into one page)
- Keep Jobs as a separate tab or link
- Smart routing: if no `career_profiles` row exists AND no `analyses` rows → redirect to `/analyze`
- If profile exists → show Profile Hub

### A3. Root Route for Logged-In Users

**File:** `app/page.tsx` or `middleware.ts`

**Logic:**
```typescript
// In middleware or page:
if (user.isAuthenticated) {
  redirect('/dashboard');
} else {
  // Show marketing landing page
}
```

---

## 4. Work Stream B: Wizard Flow Integration

### B1. Wizard Skips Profile Steps for Returning Users

**File:** `app/analyze/page.tsx`

**When `?fromProfile=true`:**
1. Fetch profile from `/api/profile`
2. Download stored CV/LinkedIn from Supabase Storage
3. Read job description from sessionStorage
4. Skip wizard entirely → auto-start streaming analysis

**When no query params (first-time user):**
- Show full wizard as-is (LinkedIn → CV → Target Job → Review)
- On completion, save profile as existing logic does

### B2. Pass Additional Context to Analysis

**File:** `app/api/analyze-stream/route.ts`

**Changes:**
- Accept `additionalContext` field in FormData
- Pass to `buildSkillExtractionPrompt()` and `buildGapAnalysisPrompt()` as supplementary context block:
  ```
  ADDITIONAL CONTEXT FROM CANDIDATE (treat as supplementary background):
  ---
  {additionalContext}
  ---
  ```
- Validate: max 5000 chars, sanitize for prompt injection markers

**Files:** `lib/prompts/skill-extraction.ts`, `lib/prompts/gap-analysis.ts`
- Add optional `additionalContext` parameter
- Insert after CV text block with clear boundary markers

---

## 5. Work Stream C: Stripe Monetization & Quotas

### C1. Pricing Model

| Feature | Free Tier | Pro Plan |
|---------|-----------|----------|
| **Price** | $0 | $9.99/week or $29.99/month |
| **Career analyses** | 1/week | 10/week |
| **Initial analysis** | Free (uncounted) | Free (uncounted) |
| **CV generations** | 1/week | 10/week |
| **Cover letter generations** | 1/week | 10/week |
| **Career coach requests** | 0 | 10/week |
| **Output tagging** | Yes | Yes |
| **Analysis history** | Last 5 | Unlimited |
| **PDF report download** | Yes | Yes |

**Notes on pricing rationale:**
- $9.99/week targets active job seekers (typical job search = 4-8 weeks → $40-$80 total)
- $29.99/month targets longer searches with a discount (~$7.50/week)
- Initial analysis is always free to demonstrate value before paywall
- The "initial analysis" = first-ever analysis for a user (flagged `is_initial = true`)

### C2. Database Schema: `user_quotas`

```sql
create table if not exists public.user_quotas (
  user_id uuid references auth.users(id) on delete cascade primary key,
  plan text not null default 'free' check (plan in ('free', 'pro')),

  -- Weekly counters (reset every Monday 00:00 UTC)
  week_start date not null default (date_trunc('week', now())::date),
  analyses_used integer not null default 0,
  cv_generations_used integer not null default 0,
  cover_letters_used integer not null default 0,
  coach_requests_used integer not null default 0,

  -- Limits (derived from plan, stored for flexibility)
  analyses_limit integer not null default 1,
  cv_limit integer not null default 1,
  cover_letter_limit integer not null default 1,
  coach_limit integer not null default 0,

  -- Initial analysis flag
  has_used_initial_analysis boolean not null default false,

  -- Stripe references
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled', 'trialing', null)),
  subscription_period_end timestamptz,

  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

-- RLS
alter table public.user_quotas enable row level security;
create policy "Users can read own quotas" on public.user_quotas
  for select using (auth.uid() = user_id);
-- No direct user writes — quotas updated by server only

-- Auto-create on first auth
create or replace function public.create_user_quota()
returns trigger as $$
begin
  insert into public.user_quotas (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_quota
  after insert on auth.users
  for each row execute function public.create_user_quota();

-- Weekly reset function (call via Supabase cron or pg_cron)
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
```

### C3. Quota Middleware

**New file:** `lib/quota.ts`

```typescript
export type QuotaType = 'analysis' | 'cv_generation' | 'cover_letter' | 'coach_request';

export interface QuotaCheck {
  allowed: boolean;
  used: number;
  limit: number;
  plan: 'free' | 'pro';
  isInitialAnalysis?: boolean;
  resetAt: string; // next Monday 00:00 UTC
}

export async function checkQuota(client, userId, type: QuotaType): Promise<QuotaCheck>;
export async function incrementQuota(client, userId, type: QuotaType): Promise<void>;
export async function getQuotaStatus(client, userId): Promise<UserQuotaStatus>;
```

**Integration points:**
- `POST /api/analyze-stream` → `checkQuota(client, userId, 'analysis')` before starting
- `POST /api/rewrite-cv` → `checkQuota(client, userId, 'cv_generation')`
- `POST /api/generate-cover-letter` → `checkQuota(client, userId, 'cover_letter')`
- `POST /api/chat` → `checkQuota(client, userId, 'coach_request')`

**Initial analysis logic:**
```typescript
if (type === 'analysis' && !quota.has_used_initial_analysis) {
  // Allow and mark as used, but don't increment analyses_used
  await markInitialAnalysisUsed(client, userId);
  return { allowed: true, isInitialAnalysis: true, ... };
}
```

### C4. Stripe Integration

**New dependencies:** `stripe`, `@stripe/stripe-js`

**New environment variables:**
```env
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_WEEKLY=price_...
STRIPE_PRICE_MONTHLY=price_...
```

**New API routes:**

#### `POST /api/stripe/checkout`
```typescript
// Creates Stripe Checkout session
// Input: { priceId: 'weekly' | 'monthly' }
// Output: { url: string } — redirect URL to Stripe Checkout
// Attaches userId as metadata for webhook matching
```

#### `POST /api/stripe/webhook`
```typescript
// Handles Stripe webhook events:
// - checkout.session.completed → create/update user_quotas with pro limits
// - customer.subscription.updated → update subscription_status
// - customer.subscription.deleted → downgrade to free tier
// - invoice.payment_failed → mark as past_due
//
// CRITICAL: Verify webhook signature using STRIPE_WEBHOOK_SECRET
// Must be idempotent (handle duplicate events gracefully)
```

#### `POST /api/stripe/portal`
```typescript
// Creates Stripe Customer Portal session for subscription management
// Output: { url: string } — redirect URL to Stripe portal
```

#### `GET /api/quota`
```typescript
// Returns current user's quota status
// Output: QuotaCheck for each type + plan info + subscription details
// Used by frontend to show usage bars and upgrade prompts
```

### C5. Pricing Page

**New file:** `app/pricing/page.tsx`

Simple pricing comparison page:
- Free tier card (current features)
- Pro tier card ($9.99/week or $29.99/month toggle)
- Feature comparison table
- "Get Started" → Stripe checkout
- "Current Plan" badge for logged-in users
- FAQ section

### C6. Quota UI Components

**New file:** `components/shared/QuotaBar.tsx`
- Small horizontal bar showing "3 of 10 analyses used"
- Color: green (0-50%), yellow (50-80%), red (80-100%)
- Shows on Profile Hub + before analysis start

**New file:** `components/shared/UpgradePrompt.tsx`
- Shown when quota exceeded
- "You've used your free analysis this week. Upgrade to Pro for 10 weekly analyses."
- CTA button → /pricing

---

## 6. Work Stream D: Output Tagging for Retraining

### D1. Tagging System Design

Allow users to tag **any visible token or section** in the analysis output with quality labels.

**Tag types:**
| Tag | Color | Meaning |
|-----|-------|---------|
| `accurate` | Green | This output is correct and useful |
| `inaccurate` | Red | This output is factually wrong |
| `irrelevant` | Orange | Correct info but not relevant to my situation |
| `missing_context` | Blue | Output would be better with more context |
| `too_generic` | Purple | Not specific enough, feels template-like |

### D2. Database Schema: `output_tags`

```sql
create table if not exists public.output_tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete cascade not null,

  -- What was tagged
  section text not null,              -- 'fitScore', 'strengths', 'gaps', 'actionPlan', 'salary', 'roles', 'ats', 'jobMatch', 'linkedin', 'cv'
  element_index integer,              -- index within array (e.g., gaps[2])
  element_key text,                   -- specific sub-element (e.g., 'skill', 'closing_plan', 'resource')
  tagged_text text,                   -- the actual text that was tagged (for keyword-level tags)

  -- The tag
  tag text not null check (tag in ('accurate', 'inaccurate', 'irrelevant', 'missing_context', 'too_generic')),
  comment text,                       -- optional user comment (max 500 chars)

  created_at timestamptz default now() not null
);

-- RLS
alter table public.output_tags enable row level security;
create policy "Users can CRUD own tags" on public.output_tags
  for all using (auth.uid() = user_id);

-- Index for retraining data export
create index idx_output_tags_section_tag on public.output_tags(section, tag);
create index idx_output_tags_analysis on public.output_tags(analysis_id);
```

### D3. API Route

**New file:** `app/api/tags/route.ts`

```typescript
// POST /api/tags — Create a tag
// Input: { analysisId, section, elementIndex?, elementKey?, taggedText?, tag, comment? }
// Output: { id, tag }

// GET /api/tags?analysisId=<uuid> — Get all tags for an analysis
// Output: { tags: OutputTag[] }

// DELETE /api/tags?id=<uuid> — Remove a tag
// Output: { success: true }
```

### D4. Tagging UI Component

**New file:** `components/shared/TaggableToken.tsx`

Wraps any text span/keyword/section. On click or long-press:
1. Shows a small popover with 5 tag buttons (colored circles)
2. User selects a tag → optional comment input appears
3. On submit → POST to `/api/tags`
4. Token gets a colored underline/dot indicator showing the applied tag
5. Click again to change or remove tag

```tsx
// Usage in result panels:
<TaggableToken
  analysisId={analysisId}
  section="gaps"
  elementIndex={2}
  elementKey="skill"
  text="Large Team Leadership"
>
  Large Team Leadership
</TaggableToken>
```

### D5. Integration Points

Apply `TaggableToken` wrapper to:

| Component | Elements to Wrap |
|-----------|-----------------|
| `FitScore.tsx` | Score label, summary text, each matching/missing skill pill |
| `StrengthsPanel.tsx` | Each strength title, description, relevance text |
| `GapsPanel.tsx` | Each gap skill name, severity badge, closing plan text, each resource |
| `ActionPlan.tsx` | Each action item text, resource link, expected impact |
| `RoleRecommendations.tsx` | Each role title, reasoning, salary range |
| `LinkedInPlan.tsx` | Each headline option, about section, skill suggestion |
| `CVOptimizerPanel.tsx` | Each CV suggestion (current vs suggested), ATS keyword |
| `CoverLetterPanel.tsx` | Generated letter sections |
| `SalaryPanel.tsx` | Salary ranges, percentiles, negotiation tips |

### D6. Retraining Data Export (Admin)

**New file:** `app/api/admin/export-tags/route.ts`

Protected admin-only endpoint that exports all tags in JSONL format for fine-tuning:
```jsonl
{"analysis_id":"...","section":"gaps","element":"skill","text":"Large Team Leadership","tag":"inaccurate","comment":"I manage 20 people","prompt_context":"...","model_output":"..."}
```

---

## 7. Work Stream E: CV Generation ATS Fix

### E1. Root Cause Analysis

The CV rewrite prompt (`lib/prompts/cv-rewriter.ts`) can lower ATS scores because:

1. **Keyword removal:** Suggestions may rephrase exact keyword matches into synonyms that ATS parsers don't recognize
2. **Section restructuring:** Changing section headers from ATS-standard names breaks parser expectations
3. **Over-summarization:** Condensing bullet points can drop required keywords
4. **No feedback loop:** The rewrite happens without checking if the result would score higher or lower on ATS

### E2. Fix: ATS-Aware CV Rewrite Pipeline

**Changes to `lib/prompts/cv-rewriter.ts`:**

Add ATS keyword preservation rules to the system prompt:

```
ATS KEYWORD PRESERVATION (CRITICAL):
- You will receive a list of MATCHED KEYWORDS from the ATS analysis.
- These keywords MUST appear in the rewritten CV. Never remove or replace a matched keyword with a synonym.
- For MISSING keywords: only add them if the candidate genuinely has the skill (evidenced in their CV or additional context).
- For SEMANTIC MATCHES: keep the original phrasing if the ATS matched it; only standardize if the exact industry term would score higher.
- PRESERVE all section headers as ATS-standard names.
- NEVER reduce the number of bullet points under Experience sections — you may rephrase but not remove.
```

**Changes to `app/api/rewrite-cv/route.ts`:**

Add ATS score pre-check and post-check:

```typescript
// Step 1: Score original CV against job posting
const originalAtsScore = await scoreATS(cvText, jobPosting);

// Step 2: Generate CV rewrite suggestions (with matched keywords injected)
const rewrite = await generateRewrite(cvText, targetRole, gaps, jobPosting, {
  matchedKeywords: originalAtsScore.keywords.matched,
  missingKeywords: originalAtsScore.keywords.missing,
});

// Step 3: Apply suggestions to CV text and re-score
const rewrittenText = applyRewriteSuggestions(cvText, rewrite.suggestions);
const newAtsScore = await scoreATS(rewrittenText, jobPosting);

// Step 4: If ATS score dropped, filter out harmful suggestions
if (newAtsScore.keywordScore < originalAtsScore.keywordScore) {
  rewrite.suggestions = filterHarmfulSuggestions(
    rewrite.suggestions, originalAtsScore, newAtsScore
  );
  rewrite.atsWarning = 'Some suggestions were filtered to preserve your ATS score.';
}

// Return with ATS comparison
return {
  ...rewrite,
  atsComparison: {
    before: originalAtsScore.overallScore,
    after: newAtsScore.overallScore,
    keywordsBefore: originalAtsScore.keywordScore,
    keywordsAfter: newAtsScore.keywordScore,
  }
};
```

**Changes to `components/results/CVOptimizerPanel.tsx`:**

Show ATS score comparison:
```
Before: ATS 62/100 → After: ATS 78/100 (+16 points)
Keywords: 45% → 72% (+27%)
```

Warn if any suggestion would lower the score.

### E3. Keyword Injection in Rewrite Prompt

**Update `buildCVRewritePrompt` signature:**

```typescript
export function buildCVRewritePrompt(
  cvText: string,
  targetRole: string,
  gaps: Gap[],
  jobPosting?: string,
  knowledgeContext?: string,
  atsKeywords?: { matched: string[]; missing: string[]; semantic: string[] }
): { system: string; userMessage: string }
```

Add to user message:
```
ATS KEYWORD DATA:
- MATCHED (MUST PRESERVE): ${atsKeywords.matched.join(', ')}
- MISSING (add ONLY if candidate has the skill): ${atsKeywords.missing.join(', ')}
- SEMANTIC MATCHES (keep or standardize): ${atsKeywords.semantic.join(', ')}
```

---

## 8. Work Stream F: Career Coach Removal

### F1. Remove ChatPanel from Results

**File:** `app/analyze/page.tsx`
- Remove ChatPanel import and rendering
- Remove any "Career Coach" tab from results

**File:** `components/results/ChatPanel.tsx`
- Keep file (don't delete) but stop importing it
- Will be re-enabled for Pro users in quota-gated version later

**File:** `app/api/chat/route.ts`
- Add quota check: `if (quota.plan === 'free') return 403`
- Keep endpoint for future Pro access

### F2. Remove Chat References from UI

- Remove chat tab/button from result navigation
- Remove any "Ask the coach" CTAs
- Clean up i18n keys related to chat/coach for free tier messaging

---

## 9. Database Migrations

### Migration 003: `user_quotas` + `output_tags` + `additional_context`

**File:** `lib/supabase/migrations/003_quotas_tags_context.sql`

```sql
-- 1. User Quotas
create table if not exists public.user_quotas (
  user_id uuid references auth.users(id) on delete cascade primary key,
  plan text not null default 'free' check (plan in ('free', 'pro')),
  week_start date not null default (date_trunc('week', now())::date),
  analyses_used integer not null default 0,
  cv_generations_used integer not null default 0,
  cover_letters_used integer not null default 0,
  coach_requests_used integer not null default 0,
  analyses_limit integer not null default 1,
  cv_limit integer not null default 1,
  cover_letter_limit integer not null default 1,
  coach_limit integer not null default 0,
  has_used_initial_analysis boolean not null default false,
  stripe_customer_id text,
  stripe_subscription_id text,
  subscription_status text check (subscription_status in ('active', 'past_due', 'canceled', 'trialing', null)),
  subscription_period_end timestamptz,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.user_quotas enable row level security;
create policy "Users read own quotas" on public.user_quotas for select using (auth.uid() = user_id);

-- Auto-create quotas for new users
create or replace function public.create_user_quota()
returns trigger as $$
begin
  insert into public.user_quotas (user_id) values (new.id) on conflict do nothing;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created_quota
  after insert on auth.users
  for each row execute function public.create_user_quota();

-- Weekly reset (schedule via pg_cron: SELECT cron.schedule('weekly-quota-reset', '0 0 * * 1', 'SELECT reset_weekly_quotas()'))
create or replace function public.reset_weekly_quotas()
returns void as $$
begin
  update public.user_quotas
  set analyses_used = 0, cv_generations_used = 0,
      cover_letters_used = 0, coach_requests_used = 0,
      week_start = date_trunc('week', now())::date,
      updated_at = now()
  where week_start < date_trunc('week', now())::date;
end;
$$ language plpgsql security definer;

-- 2. Output Tags
create table if not exists public.output_tags (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  analysis_id uuid references public.analyses(id) on delete cascade not null,
  section text not null,
  element_index integer,
  element_key text,
  tagged_text text,
  tag text not null check (tag in ('accurate', 'inaccurate', 'irrelevant', 'missing_context', 'too_generic')),
  comment text check (char_length(comment) <= 500),
  created_at timestamptz default now() not null
);

alter table public.output_tags enable row level security;
create policy "Users CRUD own tags" on public.output_tags for all using (auth.uid() = user_id);
create index idx_output_tags_analysis on public.output_tags(analysis_id);
create index idx_output_tags_section_tag on public.output_tags(section, tag);

-- 3. Additional context on career_profiles
alter table public.career_profiles add column if not exists additional_context text;
```

---

## 10. i18n Keys

New keys needed across all 6 language files:

```json
{
  "profile": {
    "additionalContext": {
      "title": "Additional Context",
      "description": "Help us understand your full story...",
      "placeholder": "Write about experiences not in your CV...",
      "examples": {
        "title": "Examples of useful context:",
        "careerBreak": "Between 2022-2023 I took a career break...",
        "freelance": "While freelancing on Upwork (2021-2023)...",
        "openSource": "I've been contributing to open-source...",
        "layoff": "After being laid off in 2024...",
        "hobby": "I have 3 years of hobby game development..."
      }
    }
  },
  "quota": {
    "analysesUsed": "{{used}} of {{limit}} analyses used this week",
    "cvUsed": "{{used}} of {{limit}} CV generations used",
    "coverLetterUsed": "{{used}} of {{limit}} cover letters used",
    "coachUsed": "{{used}} of {{limit}} coach requests used",
    "freeAnalysis": "Free initial analysis available",
    "exceeded": "Weekly limit reached",
    "upgrade": "Upgrade to Pro",
    "upgradePrompt": "You've used your free analysis this week. Upgrade to Pro for 10 weekly analyses.",
    "resetInfo": "Resets every Monday at midnight UTC"
  },
  "pricing": {
    "title": "Simple Pricing",
    "subtitle": "Start free, upgrade when you need more",
    "free": { "name": "Free", "price": "$0", "period": "forever" },
    "pro": { "name": "Pro", "priceWeekly": "$9.99/week", "priceMonthly": "$29.99/month" },
    "features": { ... },
    "cta": { "free": "Get Started", "pro": "Upgrade Now" }
  },
  "tags": {
    "accurate": "Accurate",
    "inaccurate": "Inaccurate",
    "irrelevant": "Irrelevant",
    "missingContext": "Missing Context",
    "tooGeneric": "Too Generic",
    "tagThis": "Tag this output",
    "addComment": "Add a comment (optional)",
    "saved": "Tag saved",
    "removed": "Tag removed"
  },
  "cv": {
    "atsComparison": {
      "before": "Before: ATS {{score}}/100",
      "after": "After: ATS {{score}}/100",
      "improvement": "+{{points}} points",
      "warning": "Some suggestions were filtered to preserve your ATS score"
    }
  }
}
```

---

## 11. Commit Sequence

### Phase 1: Foundation (Commits 1–5)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 1 | `feat: add migration 003 — user_quotas, output_tags, additional_context` | `migrations/003_quotas_tags_context.sql` | — |
| 2 | `feat: add quota types + quota check/increment helpers` | `lib/types.ts`, `lib/quota.ts` | 1 |
| 3 | `feat: add quota API route (GET /api/quota)` | `app/api/quota/route.ts` | 2 |
| 4 | `feat: add output tags types + API route (POST/GET/DELETE)` | `lib/types.ts`, `app/api/tags/route.ts` | 1 |
| 5 | `feat: add additional_context to CareerProfile type + profile API` | `lib/types.ts`, `app/api/profile/route.ts` | 1 |

### Phase 2: Stripe (Commits 6–9)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 6 | `feat: add stripe dependency + env config` | `package.json`, `.env.example` | — |
| 7 | `feat: add Stripe checkout + webhook + portal API routes` | `app/api/stripe/checkout/route.ts`, `app/api/stripe/webhook/route.ts`, `app/api/stripe/portal/route.ts`, `lib/stripe.ts` | 6 |
| 8 | `feat: add pricing page with plan comparison` | `app/pricing/page.tsx` | 7 |
| 9 | `feat: gate analysis/CV/cover-letter endpoints behind quota checks` | `app/api/analyze-stream/route.ts`, `app/api/rewrite-cv/route.ts`, `app/api/generate-cover-letter/route.ts`, `app/api/chat/route.ts` | 2, 7 |

### Phase 3: Profile Hub (Commits 10–14)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 10 | `feat: redesign ProfileTab as Profile Hub with context textarea` | `components/dashboard/ProfileTab.tsx` | 5 |
| 11 | `feat: merge AnalysesTab into Profile Hub` | `components/dashboard/ProfileTab.tsx`, `components/dashboard/AnalysesTab.tsx` | 10 |
| 12 | `feat: add QuotaBar + UpgradePrompt shared components` | `components/shared/QuotaBar.tsx`, `components/shared/UpgradePrompt.tsx` | 3 |
| 13 | `feat: add quota display to Profile Hub + analysis flow` | `components/dashboard/ProfileTab.tsx`, `app/analyze/page.tsx` | 12 |
| 14 | `feat: redirect logged-in users to dashboard, first-time to wizard` | `app/dashboard/page.tsx`, `middleware.ts` | 10 |

### Phase 4: Output Tagging (Commits 15–18)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 15 | `feat: add TaggableToken component with tag popover` | `components/shared/TaggableToken.tsx` | 4 |
| 16 | `feat: wrap FitScore + StrengthsPanel + GapsPanel with tagging` | `components/results/FitScore.tsx`, `components/results/StrengthsPanel.tsx`, `components/results/GapsPanel.tsx` | 15 |
| 17 | `feat: wrap ActionPlan + RoleRecommendations + LinkedInPlan with tagging` | `components/results/ActionPlan.tsx`, `components/results/RoleRecommendations.tsx`, `components/results/LinkedInPlan.tsx` | 15 |
| 18 | `feat: wrap CVOptimizer + CoverLetter + SalaryPanel with tagging` | `components/results/CVOptimizerPanel.tsx`, `components/results/CoverLetterPanel.tsx`, `components/results/SalaryPanel.tsx` | 15 |

### Phase 5: CV ATS Fix (Commits 19–21)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 19 | `fix: add ATS keyword preservation rules to CV rewrite prompt` | `lib/prompts/cv-rewriter.ts` | — |
| 20 | `fix: add pre/post ATS scoring loop to CV rewrite pipeline` | `app/api/rewrite-cv/route.ts` | 19 |
| 21 | `feat: show ATS score comparison in CV optimizer panel` | `components/results/CVOptimizerPanel.tsx` | 20 |

### Phase 6: Coach Removal + Pipeline Context (Commits 22–24)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 22 | `feat: remove Career Coach from free tier results` | `app/analyze/page.tsx`, `components/results/ChatPanel.tsx` | 9 |
| 23 | `feat: pass additional_context through analysis pipeline` | `app/api/analyze-stream/route.ts`, `lib/prompts/skill-extraction.ts`, `lib/prompts/gap-analysis.ts` | 5 |
| 24 | `feat: add i18n keys for profile, quota, pricing, tags, cv across all 6 languages` | `lib/i18n/translations/*.json` (6 files) | all above |

### Phase 7: Verification (Commit 25)

| # | Commit Message | Files | Depends On |
|---|---------------|-------|------------|
| 25 | `chore: clean up unused imports, verify build + types` | various | all above |

---

## 12. Testing Checklist

### Agent Output Quality Tests

- [ ] **FitScore coherence:** Run 5 analyses with same CV + different jobs. Verify:
  - Score 8+ never appears with critical gaps
  - Score 9+ never appears with 3+ moderate gaps
  - Score matches the rubric definitions in `gap-analysis.ts`
- [ ] **Gap severity consistency:** Run same analysis 3 times. Verify:
  - Same skills flagged as gaps each time
  - Severity doesn't flip between critical and minor across runs
  - Gap count stays within ±1 across runs
- [ ] **Strength hallucination check:** Compare extracted strengths against CV text:
  - Every strength title should have a corresponding mention in CV/LinkedIn
  - No fabricated technologies or certifications
- [ ] **Action plan validity:** Verify all resource URLs in 30/90/12-month plans:
  - URLs resolve (HTTP 200)
  - URLs point to relevant learning resources
  - No broken links or placeholder URLs
- [ ] **Role recommendation realism:** Check that:
  - Role titles are real job titles (not fabricated)
  - FitScores are consistent with overall fitScore
  - Salary ranges are market-realistic for the country
- [ ] **CV rewrite ATS check:** For 3 different CVs:
  - Run ATS score on original
  - Apply CV rewrite suggestions
  - Run ATS score on rewritten version
  - Verify rewritten score ≥ original score (NEVER lower)
  - Verify no fabricated skills/experience added
- [ ] **Cover letter factual accuracy:** Generate 3 cover letters:
  - All claims match CV content
  - No hallucinated company names or achievements
  - Tone matches selected option
- [ ] **Salary data accuracy:** Compare against known salary ranges:
  - Test with US/UK/DE/RO markets
  - Verify currency matches country
  - Verify ranges are within ±20% of known benchmarks
- [ ] **LinkedIn plan quality:** Verify:
  - Headline options include relevant keywords
  - About section references actual experience
  - Recommended skills match target role
- [ ] **Translation quality:** Run analysis in all 6 languages:
  - Numeric scores preserved exactly
  - Technical terms not over-translated
  - UI labels correct in each language

### Quota & Payment Tests

- [ ] **Free tier limits:** Verify:
  - First analysis succeeds (initial, uncounted)
  - Second analysis succeeds (1 of 1 weekly)
  - Third analysis blocked with upgrade prompt
  - CV generation: 1 allowed, 2nd blocked
  - Cover letter: 1 allowed, 2nd blocked
  - Career coach: blocked entirely
- [ ] **Pro tier limits:** After Stripe checkout:
  - 10 analyses in one week succeed
  - 11th analysis blocked
  - Same for CV, cover letter, coach
- [ ] **Weekly reset:** Verify quotas reset on Monday 00:00 UTC:
  - Before reset: counters at limit → blocked
  - After reset: counters at 0 → allowed
- [ ] **Stripe checkout flow:** End-to-end:
  - Click upgrade → Stripe Checkout loads
  - Complete payment → redirected back
  - Quotas updated to Pro limits
  - Subscription status shows "active"
- [ ] **Stripe webhook handling:**
  - Payment success → quota upgrade
  - Subscription canceled → downgrade to free
  - Payment failed → mark past_due, still allow existing quota
- [ ] **Stripe portal:** Customer can manage subscription, change plan, cancel

### Output Tagging Tests

- [ ] **Tag creation:** Click token → select tag → verify saved in DB
- [ ] **Tag display:** Refresh page → tags still visible with correct colors
- [ ] **Tag update:** Click tagged token → change tag → verify updated
- [ ] **Tag deletion:** Click tagged token → remove → verify deleted
- [ ] **Tag on all components:** Test tagging works in every result panel
- [ ] **Multi-tag:** Apply different tags to different tokens in same analysis
- [ ] **Comment:** Add comment to tag → verify saved and displayed
- [ ] **Cross-analysis isolation:** Tags from analysis A don't appear in analysis B

### Profile Hub Tests

- [ ] **First-time user:** Logged in, no profile → redirected to wizard
- [ ] **Returning user:** Profile exists → shows Profile Hub
- [ ] **Context textarea:** Type → auto-saves → refresh → content preserved
- [ ] **File management:** Upload CV → shows filename → replace → shows new filename
- [ ] **Quick analysis:** Enter job desc → click Run → analysis starts with stored profile
- [ ] **Analysis history:** Shows past analyses → click → loads results
- [ ] **Quota display:** Shows correct usage numbers

### Build & Integration Tests

- [ ] `npx tsc --noEmit` — zero new errors
- [ ] `npm run build` — clean production build
- [ ] `npx vitest run` — all tests pass
- [ ] Lighthouse score ≥ 80 on dashboard page
- [ ] All API routes return proper error codes (400, 401, 403, 429, 500)
- [ ] No console errors in browser during full user flow

---

## 13. Security & Privacy Audit Checklist

### Authentication & Authorization

- [ ] **All new API routes require auth:** `/api/quota`, `/api/tags`, `/api/stripe/*` (except webhook)
- [ ] **Webhook signature verification:** Stripe webhook validates `stripe-signature` header
- [ ] **RLS on new tables:** `user_quotas` (read-only for users), `output_tags` (full CRUD for owner only)
- [ ] **No cross-user data leakage:** User A cannot read User B's tags, quotas, or analyses
- [ ] **Admin endpoints protected:** `/api/admin/export-tags` requires admin role check
- [ ] **Session token validation:** All authenticated routes call `getAuthenticatedClient(req)`

### Data Privacy

- [ ] **CV/LinkedIn PDFs:** Stored in private Supabase Storage with per-user folder RLS
- [ ] **Additional context:** Stored in `career_profiles` table with existing RLS
- [ ] **No PII in logs:** Verify `logger.*` calls never log CV text, user names, or email addresses
- [ ] **No PII in error responses:** API errors return generic messages, never internal details
- [ ] **Data deletion:** User can delete:
  - [x] Career profile (existing)
  - [x] Individual analyses (existing)
  - [ ] Output tags (new — verify cascade on analysis delete)
  - [ ] Account + all data (GDPR — needs implementation)
- [ ] **Stripe PCI compliance:** Never store card numbers server-side (Stripe Checkout handles this)
- [ ] **Additional context sanitization:** Validate max 5000 chars, strip potential injection markers

### Input Validation & Injection Prevention

- [ ] **Prompt injection:** Additional context is wrapped in boundary markers (`---CONTEXT START---`/`---END---`) with defense instructions
- [ ] **SQL injection:** All DB queries use parameterized Supabase client (never raw SQL)
- [ ] **XSS prevention:** `TaggableToken` renders user text via React (auto-escaped), never `dangerouslySetInnerHTML`
- [ ] **CSRF protection:** Stripe webhook uses signature verification, all other routes use Bearer token
- [ ] **Rate limiting on new endpoints:** `/api/tags` (50/hour), `/api/quota` (100/hour), `/api/stripe/*` (20/hour)

### Payment Security

- [ ] **Stripe secret key:** Only in server-side env (`STRIPE_SECRET_KEY`), never in `NEXT_PUBLIC_*`
- [ ] **Webhook secret:** Stored as `STRIPE_WEBHOOK_SECRET` env var, never logged
- [ ] **Idempotent webhooks:** Same event processed twice produces same result (no double-charge or double-upgrade)
- [ ] **Subscription validation:** Before granting Pro access, verify subscription is `active` (not just `created`)
- [ ] **Downgrade handling:** When subscription canceled, quotas revert to free tier at period end
- [ ] **No free tier bypass:** Guest users (no auth) get rate limiting only, no quota (can't run analysis without account)
- [ ] **Price manipulation:** Stripe Checkout uses server-side price IDs (not client-supplied amounts)

### Infrastructure

- [ ] **Environment variables:** New vars added to Vercel dashboard:
  - `STRIPE_SECRET_KEY`
  - `STRIPE_PUBLISHABLE_KEY`
  - `STRIPE_WEBHOOK_SECRET`
  - `STRIPE_PRICE_WEEKLY`
  - `STRIPE_PRICE_MONTHLY`
- [ ] **Database migration applied:** Run migration 003 on Supabase dashboard
- [ ] **pg_cron scheduled:** Weekly quota reset: `SELECT cron.schedule('weekly-quota-reset', '0 0 * * 1', 'SELECT reset_weekly_quotas()')`
- [ ] **Stripe webhook URL configured:** `https://yourdomain.com/api/stripe/webhook` in Stripe dashboard
- [ ] **`.env.local` in `.gitignore`:** Verified not tracked in git
- [ ] **API key rotation:** Anthropic API key rotated if previously exposed

### Monitoring & Alerting

- [ ] **Stripe webhook failures:** Monitor Stripe dashboard for failed deliveries
- [ ] **Quota abuse detection:** Log when users hit quota limits repeatedly
- [ ] **Error rate monitoring:** Track 500 errors on new endpoints
- [ ] **Payment success rate:** Alert if payment success rate drops below 95%

---

## Appendix: File Inventory

### New Files

```
lib/quota.ts
lib/stripe.ts
lib/supabase/migrations/003_quotas_tags_context.sql
app/api/quota/route.ts
app/api/tags/route.ts
app/api/stripe/checkout/route.ts
app/api/stripe/webhook/route.ts
app/api/stripe/portal/route.ts
app/api/admin/export-tags/route.ts
app/pricing/page.tsx
components/shared/TaggableToken.tsx
components/shared/QuotaBar.tsx
components/shared/UpgradePrompt.tsx
```

### Modified Files

```
lib/types.ts
lib/prompts/cv-rewriter.ts
lib/prompts/skill-extraction.ts
lib/prompts/gap-analysis.ts
app/api/analyze-stream/route.ts
app/api/rewrite-cv/route.ts
app/api/generate-cover-letter/route.ts
app/api/chat/route.ts
app/api/profile/route.ts
app/analyze/page.tsx
app/dashboard/page.tsx
components/dashboard/ProfileTab.tsx
components/dashboard/AnalysesTab.tsx
components/results/FitScore.tsx
components/results/StrengthsPanel.tsx
components/results/GapsPanel.tsx
components/results/ActionPlan.tsx
components/results/RoleRecommendations.tsx
components/results/LinkedInPlan.tsx
components/results/CVOptimizerPanel.tsx
components/results/CoverLetterPanel.tsx
components/results/SalaryPanel.tsx
middleware.ts
package.json
.env.example
lib/i18n/translations/en.json
lib/i18n/translations/ro.json
lib/i18n/translations/de.json
lib/i18n/translations/fr.json
lib/i18n/translations/es.json
lib/i18n/translations/it.json
```
