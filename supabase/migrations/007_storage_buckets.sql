-- Create user-documents storage bucket for CV and LinkedIn PDF uploads
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'user-documents',
  'user-documents',
  false,
  10485760, -- 10 MB max file size
  '{application/pdf}'
)
on conflict (id) do nothing;

-- RLS policies for user-documents bucket
-- Users can upload to their own folder only
create policy "Users can upload own documents"
  on storage.objects for insert
  with check (
    bucket_id = 'user-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Users can read their own documents
create policy "Users can read own documents"
  on storage.objects for select
  using (
    bucket_id = 'user-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Users can overwrite (upsert) their own documents
create policy "Users can update own documents"
  on storage.objects for update
  using (
    bucket_id = 'user-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );

-- Users can delete their own documents
create policy "Users can delete own documents"
  on storage.objects for delete
  using (
    bucket_id = 'user-documents'
    and auth.uid()::text = (string_to_array(name, '/'))[1]
  );
