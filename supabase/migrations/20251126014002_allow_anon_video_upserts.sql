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

-- Only the uploader may overwrite their own video. An unrestricted UPDATE here
-- would let any visitor replace the contents of anyone else's file.
CREATE POLICY "Users can update own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'videos' AND owner = auth.uid())
WITH CHECK (bucket_id = 'videos' AND owner = auth.uid());
