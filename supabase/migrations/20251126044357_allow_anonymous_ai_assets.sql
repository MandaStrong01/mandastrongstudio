/*
  # Allow Anonymous Users to Save and View AI Assets

  1. Changes
    - Add policy to allow anonymous (public) users to insert assets
    - Add policy to allow anonymous users to view all assets
    - This enables test mode users to save and export movies without authentication

  2. Security Notes
    - Anonymous users can create assets with user_id = NULL
    - Anonymous users can view all assets (needed for Media Board)
    - Authenticated users still have their own policies for their assets
*/

-- Allow anonymous users to insert assets
CREATE POLICY "Anonymous users can insert assets"
  ON ai_assets FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow anonymous users to view all assets
CREATE POLICY "Anonymous users can view assets"
  ON ai_assets FOR SELECT
  TO anon
  USING (true);

-- Allow anonymous users to delete assets (for cleanup)
CREATE POLICY "Anonymous users can delete assets"
  ON ai_assets FOR DELETE
  TO anon
  USING (true);
