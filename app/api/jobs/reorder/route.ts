import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import type { JobStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: JobStatus[] = ['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface ReorderItem {
  id: string;
  status: JobStatus;
  sortOrder: number;
}

// POST /api/jobs/reorder — Batch update sort orders
export async function POST(request: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { updates } = body as { updates: ReorderItem[] };

    // Validate updates is an array
    if (!Array.isArray(updates)) {
      return NextResponse.json({ error: 'Updates must be an array' }, { status: 400 });
    }

    // Validate max 100 items
    if (updates.length > 100) {
      return NextResponse.json({ error: 'Maximum 100 updates per request' }, { status: 400 });
    }

    // Validate each item
    for (let i = 0; i < updates.length; i++) {
      const item = updates[i];

      if (!item.id || !UUID_REGEX.test(item.id)) {
        return NextResponse.json({ error: `Invalid id at index ${i}` }, { status: 400 });
      }

      if (!item.status || !VALID_STATUSES.includes(item.status)) {
        return NextResponse.json({ error: `Invalid status at index ${i}. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
      }

      if (item.sortOrder === undefined || item.sortOrder === null || !Number.isInteger(item.sortOrder) || item.sortOrder < 0) {
        return NextResponse.json({ error: `Invalid sortOrder at index ${i}. Must be a non-negative integer` }, { status: 400 });
      }
    }

    // Process each update
    for (const item of updates) {
      const { error } = await client
        .from('job_applications')
        .update({
          status: item.status,
          sort_order: item.sortOrder,
          status_updated_at: new Date().toISOString(),
        })
        .eq('id', item.id);

      if (error) {
        console.error('[jobs reorder] update error:', error);
        return NextResponse.json({ error: 'Failed to update sort order' }, { status: 500 });
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[jobs reorder] error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
