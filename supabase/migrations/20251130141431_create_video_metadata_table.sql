/*
  # Create Video Metadata Table

  1. New Tables
    - `video_metadata`
      - `id` (uuid, primary key)
      - `user_id` (uuid, nullable - for anonymous uploads)
      - `file_name` (text)
      - `file_path` (text)
      - `public_url` (text)
      - `duration` (numeric - in seconds)
      - `width` (integer - video width in pixels)
      - `height` (integer - video height in pixels)
      - `file_size` (bigint - in bytes)
      - `format` (text - MIME type)
      - `fps` (numeric - frames per second, nullable)
      - `bitrate` (integer - in kbps, nullable)
      - `codec` (text, nullable)
      - `aspect_ratio` (text, nullable)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `video_metadata` table
    - Add policy for users to read all video metadata
    - Add policy for authenticated users to insert their own metadata
    - Add policy for anonymous users to insert metadata (for demo purposes)
    - Add policy for users to update their own metadata

  3. Indexes
    - Index on user_id for fast queries
    - Index on file_path for fast lookups
    - Index on created_at for sorting
*/

CREATE TABLE IF NOT EXISTS video_metadata (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_path text NOT NULL UNIQUE,
  public_url text NOT NULL,
  duration numeric NOT NULL DEFAULT 0,
  width integer NOT NULL DEFAULT 0,
  height integer NOT NULL DEFAULT 0,
  file_size bigint NOT NULL DEFAULT 0,
  format text NOT NULL DEFAULT 'video/mp4',
  fps numeric,
  bitrate integer,
  codec text,
  aspect_ratio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_metadata ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read video metadata"
  ON video_metadata
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert their own metadata"
  ON video_metadata
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can insert metadata"
  ON video_metadata
  FOR INSERT
  TO anon
  WITH CHECK (user_id IS NULL);

CREATE POLICY "Users can update their own metadata"
  ON video_metadata
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Anonymous users can update their metadata"
  ON video_metadata
  FOR UPDATE
  TO anon
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);

CREATE INDEX IF NOT EXISTS idx_video_metadata_user_id ON video_metadata(user_id);
CREATE INDEX IF NOT EXISTS idx_video_metadata_file_path ON video_metadata(file_path);
CREATE INDEX IF NOT EXISTS idx_video_metadata_created_at ON video_metadata(created_at DESC);
