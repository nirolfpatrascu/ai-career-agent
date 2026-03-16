// ============================================================================
// GapZero — Weekly Quota Reset Cron
// Invoked every Monday at 00:00 UTC via Vercel Cron.
// Vercel automatically sends: Authorization: Bearer <CRON_SECRET>
//
// Required environment variables (set in Vercel project settings):
//   CRON_SECRET              — shared secret that Vercel sends in the header
//   SUPABASE_SERVICE_ROLE_KEY — service role key; bypasses RLS for bulk update
// ============================================================================

import { NextRequest } from 'next/server';
import { getServiceClient } from '@/lib/supabase/server';
import { logger } from '@/lib/logger';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  // --- Verify Vercel Cron secret ---
  const authHeader = request.headers.get('Authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const client = getServiceClient();

    // Zero all weekly counters and update week_start for every row.
    // The service client bypasses RLS so this touches all users.
    const { data, error } = await client
      .from('user_quotas')
      .update({
        analyses_used: 0,
        cv_generations_used: 0,
        cover_letters_used: 0,
        coach_requests_used: 0,
        week_start: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      // Match all rows — Supabase requires at least one filter, so use a
      // tautology on the primary key column to update every row.
      .gte('analyses_used', 0)
      .select('user_id');

    if (error) {
      logger.error('cron.reset_quotas.failed', { error: error.message });
      return new Response(
        JSON.stringify({ error: 'Database update failed', detail: error.message }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const count = data?.length ?? 0;
    logger.info('cron.reset_quotas.complete', { count });

    return new Response(JSON.stringify({ reset: true, count }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e);
    logger.error('cron.reset_quotas.exception', { error: message });
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
