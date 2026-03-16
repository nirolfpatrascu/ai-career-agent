import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient, getServiceClient } from '@/lib/supabase/server';
import { CURRENT_TERMS_VERSION } from '@/lib/auth/context';

/**
 * POST /api/accept-terms
 *
 * Records terms acceptance for the authenticated user using the service role
 * client so the write bypasses RLS entirely and is guaranteed to succeed if
 * the DB is reachable.
 *
 * The client must send the user's JWT in the Authorization header:
 *   Authorization: Bearer <access_token>
 *
 * Returns:
 *   200 { ok: true }          — write succeeded
 *   401 { error: string }     — no valid JWT
 *   500 { error: string }     — DB write failed (generic, no internals exposed)
 */
export async function POST(req: NextRequest) {
  // 1. Verify the JWT and extract userId — uses anon key + user token (no RLS bypass)
  const { userId } = await getAuthenticatedClient(req);
  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Write using the service role client — bypasses RLS entirely
  try {
    const serviceClient = getServiceClient();
    const { error } = await serviceClient.from('profiles').upsert({
      id: userId,
      terms_accepted_at: new Date().toISOString(),
      terms_version: CURRENT_TERMS_VERSION,
    });

    if (error) {
      console.error('[accept-terms] DB upsert failed:', error.message);
      return NextResponse.json({ error: 'Failed to record terms acceptance' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[accept-terms] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to record terms acceptance' }, { status: 500 });
  }
}
