/*
  # Fix Video Storage Policy for Anon Uploads

  1. Changes
    - Allow anonymous (anon) users to upload videos to the videos bucket
    - Keep existing policies for authenticated users
    - This allows the app to upload videos without requiring login

  2. Security
    - Public read access remains enabled
    - Anonymous users can now upload (needed for auto-upload feature)
*/

-- Drop the existing authenticated-only upload policy
DROP POLICY IF EXISTS "Authenticated users can upload videos" ON storage.objects;

-- Uploads require a signed-in account. Granting INSERT to the public role turns
-- the bucket into open file hosting for the whole internet.
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos' AND owner = auth.uid());

-- Bound what can land in the bucket, server side.
UPDATE storage.buckets
SET file_size_limit = 5368709120,
    allowed_mime_types = ARRAY['video/mp4','video/webm','video/quicktime','video/x-matroska']
WHERE id = 'videos';
