-- Policy 1: Allow authenticated users to upload to their own folder in forecast-uploads bucket
CREATE POLICY "Users can upload to their own folder"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'forecast-uploads'
  AND (storage.foldername(name))[1] = 'user_' || auth.uid()::text
);

-- Policy 2: Allow authenticated users to read their own files
CREATE POLICY "Users can read their own files"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'forecast-uploads'
  AND (storage.foldername(name))[1] = 'user_' || auth.uid()::text
);

-- Policy 3: Allow authenticated users to update/delete their own files
CREATE POLICY "Users can manage their own files"
ON storage.objects
FOR ALL
TO authenticated
USING (
  bucket_id = 'forecast-uploads'
  AND (storage.foldername(name))[1] = 'user_' || auth.uid()::text
)
WITH CHECK (
  bucket_id = 'forecast-uploads'
  AND (storage.foldername(name))[1] = 'user_' || auth.uid()::text
);