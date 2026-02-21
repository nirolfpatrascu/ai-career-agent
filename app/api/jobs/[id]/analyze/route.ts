import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

// POST /api/jobs/[id]/analyze — Get job posting text for analysis
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 });
  }

  try {
    const { data, error } = await client
      .from('job_applications')
      .select('id, company, role_title, job_posting_text, job_url')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.error('[jobs analyze]', error);
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    if (data.job_posting_text) {
      return NextResponse.json({
        jobPostingText: data.job_posting_text,
        company: data.company,
        roleTitle: data.role_title,
      });
    }

    if (data.job_url) {
      return NextResponse.json(
        { error: 'No job posting text available. Add the job description to run analysis.' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { error: 'No job posting available to analyze' },
      { status: 400 }
    );
  } catch (err) {
    console.error('[jobs analyze] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
