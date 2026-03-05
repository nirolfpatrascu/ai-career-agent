import type { SupabaseClient } from '@supabase/supabase-js';

const BUCKET = 'user-documents';

/**
 * Upload a user document (CV or LinkedIn PDF) to Supabase Storage.
 * Files are stored under {userId}/{type}.pdf
 */
export async function uploadUserDocument(
  client: SupabaseClient,
  userId: string,
  type: 'cv' | 'linkedin',
  file: File | Buffer,
  filename: string
): Promise<string> {
  const path = `${userId}/${type}.pdf`;

  const { error } = await client.storage
    .from(BUCKET)
    .upload(path, file, {
      upsert: true,
      contentType: 'application/pdf',
      // Preserve original filename in metadata
      duplex: 'half',
    } as Record<string, unknown>);

  if (error) throw new Error(`Storage upload failed: ${error.message}`);
  return path;
}

/**
 * Download a user document from Supabase Storage.
 * Returns the file as a Blob.
 */
export async function downloadUserDocument(
  client: SupabaseClient,
  storagePath: string
): Promise<Blob> {
  const { data, error } = await client.storage
    .from(BUCKET)
    .download(storagePath);

  if (error || !data) throw new Error(`Storage download failed: ${error?.message}`);
  return data;
}

/**
 * Delete a user document from Supabase Storage.
 */
export async function deleteUserDocument(
  client: SupabaseClient,
  storagePath: string
): Promise<void> {
  const { error } = await client.storage
    .from(BUCKET)
    .remove([storagePath]);

  if (error) throw new Error(`Storage delete failed: ${error.message}`);
}
