import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';

// GET /api/analyses/[id] — Fetch a single saved analysis
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { client, userId } = await getAuthenticatedClient(req);

  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await client
    .from('analyses')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', userId)
    .single();

  if (error || !data) {
    return NextResponse.json({ error: 'Analysis not found' }, { status: 404 });
  }

  return NextResponse.json({ analysis: data });
}
