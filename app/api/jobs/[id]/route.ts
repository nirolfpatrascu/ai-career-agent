import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import type { JobApplication, JobSource, JobStatus } from '@/lib/types';

export const dynamic = 'force-dynamic';

const VALID_STATUSES: JobStatus[] = ['saved', 'applied', 'interviewing', 'offer', 'rejected', 'withdrawn'];

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

interface DbJobRow {
  id: string;
  user_id: string;
  company: string;
  role_title: string;
  job_url: string | null;
  job_posting_text: string | null;
  location: string | null;
  work_type: string;
  salary_min: number | null;
  salary_max: number | null;
  currency: string;
  status: string;
  status_updated_at: string;
  applied_at: string | null;
  follow_up_at: string | null;
  analysis_id: string | null;
  match_score: number | null;
  notes: string | null;
  contact_name: string | null;
  contact_email: string | null;
  source: string | null;
  metadata: Record<string, unknown> | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function mapJobRow(row: DbJobRow): JobApplication {
  return {
    id: row.id,
    userId: row.user_id,
    company: row.company,
    roleTitle: row.role_title,
    jobUrl: row.job_url ?? undefined,
    jobPostingText: row.job_posting_text ?? undefined,
    location: row.location ?? undefined,
    workType: row.work_type as JobApplication['workType'],
    salaryMin: row.salary_min ?? undefined,
    salaryMax: row.salary_max ?? undefined,
    currency: row.currency,
    status: row.status as JobStatus,
    statusUpdatedAt: row.status_updated_at,
    appliedAt: row.applied_at ?? undefined,
    followUpAt: row.follow_up_at ?? undefined,
    analysisId: row.analysis_id ?? undefined,
    matchScore: row.match_score ?? undefined,
    notes: row.notes ?? undefined,
    contactName: row.contact_name ?? undefined,
    contactEmail: row.contact_email ?? undefined,
    source: (row.source as JobSource) || 'manual',
    metadata: row.metadata ?? undefined,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// PATCH /api/jobs/[id] — Update a job
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 });
  }

  try {
    const body = await request.json();

    // Validate fields if provided
    if (body.company !== undefined) {
      if (typeof body.company !== 'string' || body.company.trim().length === 0) {
        return NextResponse.json({ error: 'Company cannot be empty' }, { status: 400 });
      }
      if (body.company.length > 200) {
        return NextResponse.json({ error: 'Company must be 200 characters or less' }, { status: 400 });
      }
    }

    if (body.roleTitle !== undefined) {
      if (typeof body.roleTitle !== 'string' || body.roleTitle.trim().length === 0) {
        return NextResponse.json({ error: 'Role title cannot be empty' }, { status: 400 });
      }
      if (body.roleTitle.length > 200) {
        return NextResponse.json({ error: 'Role title must be 200 characters or less' }, { status: 400 });
      }
    }

    if (body.jobUrl !== undefined && body.jobUrl !== null && body.jobUrl !== '') {
      if (!body.jobUrl.startsWith('http://') && !body.jobUrl.startsWith('https://')) {
        return NextResponse.json({ error: 'Job URL must start with http:// or https://' }, { status: 400 });
      }
    }

    if (body.salaryMin !== undefined && body.salaryMin !== null) {
      if (!Number.isInteger(body.salaryMin) || body.salaryMin <= 0) {
        return NextResponse.json({ error: 'Salary min must be a positive integer' }, { status: 400 });
      }
    }

    if (body.salaryMax !== undefined && body.salaryMax !== null) {
      if (!Number.isInteger(body.salaryMax) || body.salaryMax <= 0) {
        return NextResponse.json({ error: 'Salary max must be a positive integer' }, { status: 400 });
      }
    }

    if (body.salaryMin != null && body.salaryMax != null && body.salaryMin > body.salaryMax) {
      return NextResponse.json({ error: 'Salary min must be less than or equal to salary max' }, { status: 400 });
    }

    if (body.currency !== undefined && body.currency !== null && body.currency.length > 3) {
      return NextResponse.json({ error: 'Currency must be 3 characters or less' }, { status: 400 });
    }

    if (body.notes !== undefined && body.notes !== null && body.notes.length > 5000) {
      return NextResponse.json({ error: 'Notes must be 5000 characters or less' }, { status: 400 });
    }

    if (body.status !== undefined && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    // Build the update object with only provided fields (snake_case)
    const updateData: Record<string, unknown> = {};

    if (body.company !== undefined) updateData.company = body.company.trim();
    if (body.roleTitle !== undefined) updateData.role_title = body.roleTitle.trim();
    if (body.jobUrl !== undefined) updateData.job_url = body.jobUrl || null;
    if (body.jobPostingText !== undefined) updateData.job_posting_text = body.jobPostingText || null;
    if (body.location !== undefined) updateData.location = body.location || null;
    if (body.workType !== undefined) updateData.work_type = body.workType;
    if (body.salaryMin !== undefined) updateData.salary_min = body.salaryMin ?? null;
    if (body.salaryMax !== undefined) updateData.salary_max = body.salaryMax ?? null;
    if (body.currency !== undefined) updateData.currency = body.currency;
    if (body.notes !== undefined) updateData.notes = body.notes || null;
    if (body.contactName !== undefined) updateData.contact_name = body.contactName || null;
    if (body.contactEmail !== undefined) updateData.contact_email = body.contactEmail || null;
    if (body.followUpAt !== undefined) updateData.follow_up_at = body.followUpAt || null;
    if (body.appliedAt !== undefined) updateData.applied_at = body.appliedAt || null;
    if (body.metadata !== undefined) updateData.metadata = body.metadata || null;

    if (body.status !== undefined) {
      updateData.status = body.status;
      updateData.status_updated_at = new Date().toISOString();
    }

    // If status changed to 'applied', auto-set applied_at if not provided and not already set
    if (body.status === 'applied' && body.appliedAt === undefined) {
      // Fetch current row to check if applied_at is already set
      const { data: existing } = await client
        .from('job_applications')
        .select('applied_at')
        .eq('id', id)
        .single();

      if (existing && !existing.applied_at) {
        updateData.applied_at = new Date().toISOString();
      }
    }

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    const { data, error } = await client
      .from('job_applications')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single();

    if (error) {
      console.error('[jobs PATCH]', error);
      // Supabase returns error when no rows matched (PGRST116)
      if (error.code === 'PGRST116') {
        return NextResponse.json({ error: 'Job not found' }, { status: 404 });
      }
      return NextResponse.json({ error: 'Failed to update job' }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ job: mapJobRow(data as DbJobRow) });
  } catch (err) {
    console.error('[jobs PATCH] error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}

// DELETE /api/jobs/[id] — Delete a job
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!UUID_REGEX.test(id)) {
    return NextResponse.json({ error: 'Invalid job ID format' }, { status: 400 });
  }

  try {
    const { data, error } = await client
      .from('job_applications')
      .delete()
      .eq('id', id)
      .select('id');

    if (error) {
      console.error('[jobs DELETE]', error);
      return NextResponse.json({ error: 'Failed to delete job' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ error: 'Job not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('[jobs DELETE] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
