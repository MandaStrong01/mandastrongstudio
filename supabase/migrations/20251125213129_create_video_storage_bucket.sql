/*
  # Create Video Storage Bucket

  1. Storage Setup
    - Create a public bucket named 'videos' for storing video files
    - Configure bucket to allow public access for video playback
    - Set up storage policies for authenticated uploads

  2. Security
    - Allow public READ access for video playback
    - Restrict uploads to authenticated users only
    - Users can only delete their own uploads
*/

-- Create the videos storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('videos', 'videos', true)
ON CONFLICT (id) DO NOTHING;

-- Allow authenticated users to upload videos
CREATE POLICY "Authenticated users can upload videos"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'videos');

-- Allow public read access to videos
CREATE POLICY "Public can view videos"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'videos');

-- Allow users to delete their own videos
CREATE POLICY "Users can delete own videos"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'videos' AND auth.uid() = owner::uuid);

-- Allow users to update their own videos
CREATE POLICY "Users can update own videos"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'videos' AND auth.uid() = owner::uuid);