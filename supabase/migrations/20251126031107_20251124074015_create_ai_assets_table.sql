/*
  # Create AI Assets System

  1. New Tables
    - `ai_assets`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `tool_name` (text) - Name of the AI tool used
      - `tool_category` (text) - Category: pre-production, production, post-production, vfx, color, audio
      - `asset_type` (text) - Type: image, video, audio, text, document
      - `asset_url` (text) - URL or path to the generated asset
      - `asset_data` (jsonb) - Additional metadata about the asset
      - `prompt` (text) - User's input prompt or parameters
      - `status` (text) - Status: generating, completed, failed
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `ai_assets` table
    - Add policies for authenticated users to manage their own assets
*/

CREATE TABLE IF NOT EXISTS ai_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_name text NOT NULL,
  tool_category text NOT NULL,
  asset_type text NOT NULL DEFAULT 'image',
  asset_url text,
  asset_data jsonb DEFAULT '{}'::jsonb,
  prompt text,
  status text NOT NULL DEFAULT 'generating',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE ai_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own assets"
  ON ai_assets FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own assets"
  ON ai_assets FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own assets"
  ON ai_assets FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own assets"
  ON ai_assets FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS ai_assets_user_id_idx ON ai_assets(user_id);
CREATE INDEX IF NOT EXISTS ai_assets_status_idx ON ai_assets(status);
CREATE INDEX IF NOT EXISTS ai_assets_created_at_idx ON ai_assets(created_at DESC);
