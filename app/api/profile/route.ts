import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient } from '@/lib/supabase/server';
import { uploadUserDocument } from '@/lib/supabase/storage';
import type { CareerProfile, CareerProfileInput } from '@/lib/types';

/** Map DB snake_case row to camelCase CareerProfile */
function mapRow(row: Record<string, unknown>): CareerProfile {
  return {
    userId: row.user_id as string,
    currentRole: row.current_role as string | null,
    targetRole: row.target_role as string | null,
    yearsExperience: row.years_experience as number | null,
    country: row.country as string | null,
    workPreference: row.work_preference as CareerProfile['workPreference'],
    githubUrl: row.github_url as string | null,
    cvStoragePath: row.cv_storage_path as string | null,
    linkedinStoragePath: row.linkedin_storage_path as string | null,
    cvFilename: row.cv_filename as string | null,
    linkedinFilename: row.linkedin_filename as string | null,
    extractedProfile: row.extracted_profile as CareerProfile['extractedProfile'],
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

/**
 * GET /api/profile — Returns the current user's career profile (or null).
 */
export async function GET(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { data, error } = await client
    .from('career_profiles')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    // PGRST116 = no rows found — that's fine, return null
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data ? mapRow(data) : null });
}

/**
 * PUT /api/profile — Upsert career profile.
 * Accepts multipart FormData with:
 *   - profile: JSON string of CareerProfileInput
 *   - cv: (optional) PDF file
 *   - linkedin: (optional) PDF file
 */
export async function PUT(req: NextRequest) {
  const { client, userId } = await getAuthenticatedClient(req);
  if (!client || !userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const formData = await req.formData();
  const profileRaw = formData.get('profile') as string | null;

  if (!profileRaw) {
    return NextResponse.json({ error: 'Missing profile data' }, { status: 400 });
  }

  let input: CareerProfileInput;
  try {
    input = JSON.parse(profileRaw);
  } catch {
    return NextResponse.json({ error: 'Invalid profile JSON' }, { status: 400 });
  }

  // Build the DB row
  const dbRow: Record<string, unknown> = {
    user_id: userId,
    current_role: input.currentRole ?? null,
    target_role: input.targetRole ?? null,
    years_experience: input.yearsExperience ?? null,
    country: input.country ?? null,
    work_preference: input.workPreference ?? null,
    github_url: input.githubUrl ?? null,
    cv_filename: input.cvFilename ?? null,
    linkedin_filename: input.linkedinFilename ?? null,
    extracted_profile: input.extractedProfile ?? null,
  };

  // Upload CV if provided
  const cvFile = formData.get('cv') as File | null;
  if (cvFile && cvFile.size > 0) {
    try {
      const path = await uploadUserDocument(client, userId, 'cv', cvFile, cvFile.name);
      dbRow.cv_storage_path = path;
      dbRow.cv_filename = cvFile.name;
    } catch (e) {
      console.error('CV upload failed:', e);
    }
  }

  // Upload LinkedIn PDF if provided
  const linkedinFile = formData.get('linkedin') as File | null;
  if (linkedinFile && linkedinFile.size > 0) {
    try {
      const path = await uploadUserDocument(client, userId, 'linkedin', linkedinFile, linkedinFile.name);
      dbRow.linkedin_storage_path = path;
      dbRow.linkedin_filename = linkedinFile.name;
    } catch (e) {
      console.error('LinkedIn upload failed:', e);
    }
  }

  // Upsert
  const { data, error } = await client
    .from('career_profiles')
    .upsert(dbRow, { onConflict: 'user_id' })
    .select('*')
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: mapRow(data) });
}
