import { NextRequest, NextResponse } from 'next/server';
import { getAuthenticatedClient, getServiceClient } from '@/lib/supabase/server';

/**
 * DELETE /api/user/delete
 * GDPR: Permanently deletes the authenticated user's account and all associated data.
 * - Cascade deletes all DB rows where user_id matches
 * - Removes all files in Supabase Storage under {userId}/
 * - Deletes the Supabase Auth user record
 */
export async function DELETE(req: NextRequest) {
  const { userId } = await getAuthenticatedClient(req);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const serviceClient = getServiceClient();

    // Cascade delete all user data from tables in parallel
    await Promise.all([
      serviceClient.from('analyses').delete().eq('user_id', userId),
      serviceClient.from('career_profiles').delete().eq('user_id', userId),
      serviceClient.from('user_quotas').delete().eq('user_id', userId),
      serviceClient.from('job_applications').delete().eq('user_id', userId),
      serviceClient.from('feedback').delete().eq('user_id', userId),
    ]);

    // Delete all storage files under userId/
    const { data: files } = await serviceClient.storage
      .from('user-documents')
      .list(userId);

    if (files && files.length > 0) {
      const paths = files.map(f => `${userId}/${f.name}`);
      await serviceClient.storage.from('user-documents').remove(paths);
    }

    // Delete the Supabase Auth user (requires service role)
    const { error: deleteAuthError } = await serviceClient.auth.admin.deleteUser(userId);
    if (deleteAuthError) {
      console.error('[user/delete] Auth user deletion failed:', deleteAuthError.message);
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
    }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error('[user/delete]', err);
    return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 });
  }
}
