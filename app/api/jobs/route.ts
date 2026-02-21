import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { checkRateLimit } from '@/lib/rate-limit';
import type { JobApplication, JobApplicationInput, JobStatus, JobTrackerStats } from '@/lib/types';

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
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function calculateStats(jobs: JobApplication[]): JobTrackerStats {
  const byStatus: Record<JobStatus, number> = {
    saved: 0,
    applied: 0,
    interviewing: 0,
    offer: 0,
    rejected: 0,
    withdrawn: 0,
  };

  for (const job of jobs) {
    if (byStatus[job.status] !== undefined) {
      byStatus[job.status]++;
    }
  }

  const scoresWithValues = jobs
    .map((j) => j.matchScore)
    .filter((s): s is number => s != null);
  const avgMatchScore =
    scoresWithValues.length > 0
      ? Math.round((scoresWithValues.reduce((a, b) => a + b, 0) / scoresWithValues.length) * 10) / 10
      : null;

  const now = new Date();

  const followUpsDue = jobs.filter((j) => {
    if (!j.followUpAt) return false;
    if (['rejected', 'withdrawn', 'offer'].includes(j.status)) return false;
    return new Date(j.followUpAt) <= now;
  }).length;

  // Start of current week (Monday)
  const startOfWeek = new Date(now);
  const dayOfWeek = startOfWeek.getDay();
  const diffToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
  startOfWeek.setDate(startOfWeek.getDate() - diffToMonday);
  startOfWeek.setHours(0, 0, 0, 0);

  // Start of current month
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  startOfMonth.setHours(0, 0, 0, 0);

  const appliedThisWeek = jobs.filter((j) => {
    if (j.status === 'saved') return false;
    if (!j.appliedAt) return false;
    return new Date(j.appliedAt) >= startOfWeek;
  }).length;

  const appliedThisMonth = jobs.filter((j) => {
    if (j.status === 'saved') return false;
    if (!j.appliedAt) return false;
    return new Date(j.appliedAt) >= startOfMonth;
  }).length;

  return {
    total: jobs.length,
    byStatus,
    avgMatchScore,
    followUpsDue,
    appliedThisWeek,
    appliedThisMonth,
  };
}

// GET /api/jobs — List user's tracked jobs
export async function GET(request: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Parse optional status filter
    const statusParam = request.nextUrl.searchParams.get('status');
    let statusFilter: JobStatus[] | null = null;
    if (statusParam) {
      const parts = statusParam.split(',').map((s) => s.trim()).filter(Boolean);
      const valid = parts.every((s) => VALID_STATUSES.includes(s as JobStatus));
      if (!valid) {
        return NextResponse.json({ error: 'Invalid status filter' }, { status: 400 });
      }
      statusFilter = parts as JobStatus[];
    }

    let query = client
      .from('job_applications')
      .select('*')
      .eq('user_id', userId);

    if (statusFilter && statusFilter.length > 0) {
      query = query.in('status', statusFilter);
    }

    query = query.order('sort_order', { ascending: true }).order('updated_at', { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error('[jobs GET]', error);
      return NextResponse.json({ error: 'Failed to fetch jobs' }, { status: 500 });
    }

    const jobs = ((data || []) as DbJobRow[]).map(mapJobRow);

    // For stats, we need ALL jobs (not filtered), so fetch all if we had a filter
    let allJobs: JobApplication[];
    if (statusFilter) {
      const { data: allData, error: allError } = await client
        .from('job_applications')
        .select('*')
        .eq('user_id', userId);

      if (allError) {
        console.error('[jobs GET stats]', allError);
        // Fall back to calculating stats from filtered jobs
        allJobs = jobs;
      } else {
        allJobs = ((allData || []) as DbJobRow[]).map(mapJobRow);
      }
    } else {
      allJobs = jobs;
    }

    const stats = calculateStats(allJobs);

    return NextResponse.json({ jobs, stats });
  } catch (err) {
    console.error('[jobs GET] error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/jobs — Create a new tracked job
export async function POST(request: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(request);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const ip = request.headers.get('x-forwarded-for') || 'unknown';
  const { allowed } = checkRateLimit(ip);
  if (!allowed) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
  }

  try {
    const body: JobApplicationInput = await request.json();

    // Validate required fields
    if (!body.company || typeof body.company !== 'string' || body.company.trim().length === 0) {
      return NextResponse.json({ error: 'Company is required' }, { status: 400 });
    }
    if (body.company.length > 200) {
      return NextResponse.json({ error: 'Company must be 200 characters or less' }, { status: 400 });
    }

    if (!body.roleTitle || typeof body.roleTitle !== 'string' || body.roleTitle.trim().length === 0) {
      return NextResponse.json({ error: 'Role title is required' }, { status: 400 });
    }
    if (body.roleTitle.length > 200) {
      return NextResponse.json({ error: 'Role title must be 200 characters or less' }, { status: 400 });
    }

    // Validate optional fields
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

    if (
      body.salaryMin != null &&
      body.salaryMax != null &&
      body.salaryMin > body.salaryMax
    ) {
      return NextResponse.json({ error: 'Salary min must be less than or equal to salary max' }, { status: 400 });
    }

    if (body.currency !== undefined && body.currency !== null && body.currency.length > 3) {
      return NextResponse.json({ error: 'Currency must be 3 characters or less' }, { status: 400 });
    }

    if (body.notes !== undefined && body.notes !== null && body.notes.length > 5000) {
      return NextResponse.json({ error: 'Notes must be 5000 characters or less' }, { status: 400 });
    }

    const status: JobStatus = body.status && VALID_STATUSES.includes(body.status) ? body.status : 'saved';
    if (body.status && !VALID_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}` }, { status: 400 });
    }

    // Calculate sort_order: max for this user+status + 1
    const { data: maxOrderData } = await client
      .from('job_applications')
      .select('sort_order')
      .eq('user_id', userId)
      .eq('status', status)
      .order('sort_order', { ascending: false })
      .limit(1);

    const sortOrder = maxOrderData && maxOrderData.length > 0 ? maxOrderData[0].sort_order + 1 : 0;

    // Auto-set applied_at if status is 'applied' and not provided
    const appliedAt = status === 'applied' && !body.appliedAt ? new Date().toISOString() : (body.appliedAt || null);

    const insertData = {
      user_id: userId,
      company: body.company.trim(),
      role_title: body.roleTitle.trim(),
      job_url: body.jobUrl || null,
      job_posting_text: body.jobPostingText || null,
      location: body.location || null,
      work_type: body.workType || 'remote',
      salary_min: body.salaryMin ?? null,
      salary_max: body.salaryMax ?? null,
      currency: body.currency || 'USD',
      status,
      status_updated_at: new Date().toISOString(),
      applied_at: appliedAt,
      follow_up_at: body.followUpAt || null,
      notes: body.notes || null,
      contact_name: body.contactName || null,
      contact_email: body.contactEmail || null,
      sort_order: sortOrder,
    };

    const { data, error } = await client
      .from('job_applications')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('[jobs POST]', error);
      return NextResponse.json({ error: 'Failed to create job' }, { status: 500 });
    }

    return NextResponse.json({ job: mapJobRow(data as DbJobRow) }, { status: 201 });
  } catch (err) {
    console.error('[jobs POST] error:', err);
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }
}
