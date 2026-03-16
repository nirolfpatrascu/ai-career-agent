// ============================================================================
// GapZero — Quota Check & Increment Helpers
// Server-side only. Used by API routes to enforce usage limits.
// ============================================================================

import type { SupabaseClient } from '@supabase/supabase-js';
import type { QuotaType, QuotaCheck, UserQuotaStatus, UserQuotaRow } from './types';

/** Column mapping from QuotaType to DB column names */
const USED_COLUMN: Record<QuotaType, keyof UserQuotaRow> = {
  analysis: 'analyses_used',
  cv_generation: 'cv_generations_used',
  cover_letter: 'cover_letters_used',
  coach_request: 'coach_requests_used',
};

const LIMIT_COLUMN: Record<QuotaType, keyof UserQuotaRow> = {
  analysis: 'analyses_limit',
  cv_generation: 'cv_limit',
  cover_letter: 'cover_letter_limit',
  coach_request: 'coach_limit',
};

/** Pro plan limits */
const PRO_LIMITS = {
  analyses_limit: 50,
  cv_limit: 50,
  cover_letter_limit: 50,
  coach_limit: 50,
} as const;

/** Free plan limits */
const FREE_LIMITS = {
  analyses_limit: 1,
  cv_limit: 1,
  cover_letter_limit: 1,
  coach_limit: 0,
} as const;

/** Get next Monday 00:00 UTC as ISO string */
function getNextMonday(): string {
  const now = new Date();
  const dayOfWeek = now.getUTCDay(); // 0 = Sunday
  const daysUntilMonday = dayOfWeek === 0 ? 1 : 8 - dayOfWeek;
  const nextMonday = new Date(now);
  nextMonday.setUTCDate(now.getUTCDate() + daysUntilMonday);
  nextMonday.setUTCHours(0, 0, 0, 0);
  return nextMonday.toISOString();
}

/** Ensure quota row exists (lazy-create for users created before migration) */
async function ensureQuotaRow(
  client: SupabaseClient,
  userId: string
): Promise<UserQuotaRow> {
  const { data, error } = await client
    .from('user_quotas')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (data) return data as UserQuotaRow;

  // Row doesn't exist — create it (handles users from before migration)
  if (error?.code === 'PGRST116') {
    const { data: inserted, error: insertErr } = await client
      .from('user_quotas')
      .insert({ user_id: userId })
      .select('*')
      .single();

    if (insertErr) throw new Error(`Failed to create quota row: ${insertErr.message}`);
    return inserted as UserQuotaRow;
  }

  throw new Error(`Failed to fetch quota: ${error?.message}`);
}

/**
 * Check whether the user has quota remaining for the given type.
 * Does NOT increment — call incrementQuota() after the action succeeds.
 */
export async function checkQuota(
  client: SupabaseClient,
  userId: string,
  type: QuotaType
): Promise<QuotaCheck> {
  const row = await ensureQuotaRow(client, userId);

  const used = row[USED_COLUMN[type]] as number;
  const limit = row[LIMIT_COLUMN[type]] as number;
  const resetAt = getNextMonday();

  // Special case: first-ever analysis is free (doesn't count toward limit)
  if (type === 'analysis' && !row.has_used_initial_analysis) {
    return {
      allowed: true,
      used,
      limit,
      plan: row.plan,
      isInitialAnalysis: true,
      resetAt,
    };
  }

  return {
    allowed: used < limit,
    used,
    limit,
    plan: row.plan,
    resetAt,
  };
}

/**
 * Increment the usage counter after a successful action.
 * For initial analysis, marks the flag instead of incrementing.
 */
export async function incrementQuota(
  client: SupabaseClient,
  userId: string,
  type: QuotaType,
  isInitialAnalysis = false
): Promise<void> {
  if (type === 'analysis' && isInitialAnalysis) {
    const { error } = await client
      .from('user_quotas')
      .update({ has_used_initial_analysis: true, updated_at: new Date().toISOString() })
      .eq('user_id', userId);
    if (error) throw new Error(`Failed to mark initial analysis used: ${error.message}`);
    return;
  }

  const col = USED_COLUMN[type];

  // Fetch current value and increment (no RPC needed for simple +1)
  const row = await ensureQuotaRow(client, userId);
  const currentVal = row[col] as number;

  const { error } = await client
    .from('user_quotas')
    .update({ [col]: currentVal + 1, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to increment quota for ${type}: ${error.message}`);
}

/**
 * Mark a user's initial analysis as used (without incrementing weekly counter).
 */
export async function markInitialAnalysisUsed(
  client: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await client
    .from('user_quotas')
    .update({ has_used_initial_analysis: true, updated_at: new Date().toISOString() })
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to mark initial analysis used: ${error.message}`);
}

/**
 * Get full quota status for a user (used by GET /api/quota).
 */
export async function getQuotaStatus(
  client: SupabaseClient,
  userId: string
): Promise<UserQuotaStatus> {
  const row = await ensureQuotaRow(client, userId);

  return {
    plan: row.plan,
    weekStart: row.week_start,
    resetAt: getNextMonday(),
    analysis: { used: row.analyses_used, limit: row.analyses_limit },
    cvGeneration: { used: row.cv_generations_used, limit: row.cv_limit },
    coverLetter: { used: row.cover_letters_used, limit: row.cover_letter_limit },
    coachRequest: { used: row.coach_requests_used, limit: row.coach_limit },
    hasUsedInitialAnalysis: row.has_used_initial_analysis,
    subscription: row.stripe_subscription_id
      ? {
          status: row.subscription_status,
          periodEnd: row.subscription_period_end,
        }
      : null,
  };
}

/**
 * Upgrade a user to Pro plan (called from Stripe webhook).
 */
export async function upgradeToPro(
  client: SupabaseClient,
  userId: string,
  stripeCustomerId: string,
  stripeSubscriptionId: string,
  periodEnd: string
): Promise<void> {
  const { error } = await client
    .from('user_quotas')
    .update({
      plan: 'pro',
      ...PRO_LIMITS,
      stripe_customer_id: stripeCustomerId,
      stripe_subscription_id: stripeSubscriptionId,
      subscription_status: 'active',
      subscription_period_end: periodEnd,
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to upgrade user to Pro: ${error.message}`);
}

/**
 * Downgrade a user to Free plan (called from Stripe webhook on cancel).
 */
export async function downgradeToFree(
  client: SupabaseClient,
  userId: string
): Promise<void> {
  const { error } = await client
    .from('user_quotas')
    .update({
      plan: 'free',
      ...FREE_LIMITS,
      subscription_status: 'canceled',
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to downgrade user to Free: ${error.message}`);
}

/**
 * Update subscription status (called from Stripe webhook).
 */
export async function updateSubscriptionStatus(
  client: SupabaseClient,
  userId: string,
  status: 'active' | 'past_due' | 'canceled' | 'trialing',
  periodEnd?: string
): Promise<void> {
  const update: Record<string, unknown> = {
    subscription_status: status,
    updated_at: new Date().toISOString(),
  };
  if (periodEnd) update.subscription_period_end = periodEnd;

  const { error } = await client
    .from('user_quotas')
    .update(update)
    .eq('user_id', userId);
  if (error) throw new Error(`Failed to update subscription status: ${error.message}`);
}
