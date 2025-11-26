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

-- Allow both authenticated and anonymous users to upload videos
CREATE POLICY "Anyone can upload videos"
ON storage.objects
FOR INSERT
TO public
WITH CHECK (bucket_id = 'videos');
