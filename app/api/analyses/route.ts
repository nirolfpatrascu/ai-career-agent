import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';

// GET /api/analyses — List user's saved analyses
export async function GET(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);

  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await client
    .from('analyses')
    .select('id, target_role, current_role, country, fit_score, fit_label, cv_filename, language, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) {
    console.error('[analyses GET]', error);
    return NextResponse.json({ error: 'Failed to fetch analyses' }, { status: 500 });
  }

  return NextResponse.json({ analyses: data });
}

// POST /api/analyses — Save an analysis result
export async function POST(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);

  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { result } = body;

    if (!result || !result.metadata || !result.fitScore) {
      return NextResponse.json({ error: 'Invalid analysis result' }, { status: 400 });
    }

    const { data, error } = await client
      .from('analyses')
      .insert({
        user_id: userId,
        target_role: result.metadata.targetRole,
        current_role: result.metadata.cvFileName ? 'From CV' : 'Unknown',
        country: result.metadata.country,
        fit_score: result.fitScore.score,
        fit_label: result.fitScore.label,
        cv_filename: result.metadata.cvFileName || null,
        language: result.metadata.language || 'en',
        result: result,
      })
      .select('id, created_at')
      .single();

    if (error) {
      console.error('[analyses POST]', error);
      return NextResponse.json({ error: 'Failed to save analysis' }, { status: 500 });
    }

    return NextResponse.json({ id: data.id, created_at: data.created_at });
  } catch (err) {
    console.error('[analyses POST] parse error', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/analyses?id=<uuid> — Delete a specific analysis
export async function DELETE(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);

  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = req.nextUrl.searchParams.get('id');
  if (!id) {
    return NextResponse.json({ error: 'Missing analysis id' }, { status: 400 });
  }

  const { error } = await client
    .from('analyses')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('[analyses DELETE]', error);
    return NextResponse.json({ error: 'Failed to delete analysis' }, { status: 500 });
  }

  return NextResponse.json({ deleted: true });
}
