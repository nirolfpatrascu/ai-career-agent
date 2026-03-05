import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { getQuotaStatus } from '@/lib/quota';

/**
 * GET /api/quota — Returns the current user's quota status.
 */
export async function GET(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const status = await getQuotaStatus(client, userId);
    return NextResponse.json(status);
  } catch (error) {
    console.error('[quota GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch quota status' },
      { status: 500 }
    );
  }
}
