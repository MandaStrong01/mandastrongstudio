/*
  # Allow Anonymous Video Upserts

  1. Changes
    - Add UPDATE policy to allow anonymous users to overwrite videos (upsert)
    - This fixes the 403 error when trying to upload videos with upsert: true

  2. Security
    - Anonymous users can INSERT and UPDATE videos in the videos bucket
    - Public read access remains enabled
*/

-- Drop existing update policy that requires authentication
DROP POLICY IF EXISTS "Users can update own videos" ON storage.objects;

-- Allow anonymous users to update videos (needed for upsert)
CREATE POLICY "Anyone can update videos"
ON storage.objects
FOR UPDATE
TO public
USING (bucket_id = 'videos')
WITH CHECK (bucket_id = 'videos');
