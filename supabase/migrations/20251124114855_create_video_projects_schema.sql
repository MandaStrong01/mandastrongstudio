/*
  # Video Projects and Assets Schema

  1. New Tables
    - `video_projects`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `title` (text)
      - `description` (text)
      - `duration` (integer, in seconds)
      - `thumbnail_url` (text)
      - `status` (text: draft, rendering, completed)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `video_clips`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to video_projects)
      - `source_url` (text, video source URL or file path)
      - `timeline_position` (integer, milliseconds from start)
      - `duration` (integer, milliseconds)
      - `trim_start` (integer, milliseconds)
      - `trim_end` (integer, milliseconds)
      - `order_index` (integer)
      - `created_at` (timestamptz)
    
    - `video_text_layers`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to video_projects)
      - `text_content` (text)
      - `timeline_position` (integer, milliseconds)
      - `duration` (integer, milliseconds)
      - `font_family` (text)
      - `font_size` (integer)
      - `color` (text)
      - `position_x` (integer)
      - `position_y` (integer)
      - `animation_type` (text)
      - `created_at` (timestamptz)
    
    - `video_transitions`
      - `id` (uuid, primary key)
      - `project_id` (uuid, foreign key to video_projects)
      - `timeline_position` (integer, milliseconds)
      - `type` (text: fade, dissolve, wipe, etc)
      - `duration` (integer, milliseconds)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own projects
    - Users can only modify their own content
*/

-- Video Projects Table
CREATE TABLE IF NOT EXISTS video_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title text NOT NULL DEFAULT 'Untitled Project',
  description text DEFAULT '',
  duration integer DEFAULT 0,
  thumbnail_url text,
  status text DEFAULT 'draft' CHECK (status IN ('draft', 'rendering', 'completed')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE video_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own projects"
  ON video_projects FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects"
  ON video_projects FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects"
  ON video_projects FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects"
  ON video_projects FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Video Clips Table
CREATE TABLE IF NOT EXISTS video_clips (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES video_projects(id) ON DELETE CASCADE NOT NULL,
  source_url text NOT NULL,
  timeline_position integer DEFAULT 0,
  duration integer DEFAULT 0,
  trim_start integer DEFAULT 0,
  trim_end integer DEFAULT 0,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_clips ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view clips in own projects"
  ON video_clips FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_clips.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create clips in own projects"
  ON video_clips FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_clips.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update clips in own projects"
  ON video_clips FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_clips.project_id
      AND video_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_clips.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete clips in own projects"
  ON video_clips FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_clips.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

-- Video Text Layers Table
CREATE TABLE IF NOT EXISTS video_text_layers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES video_projects(id) ON DELETE CASCADE NOT NULL,
  text_content text NOT NULL DEFAULT '',
  timeline_position integer DEFAULT 0,
  duration integer DEFAULT 3000,
  font_family text DEFAULT 'Arial',
  font_size integer DEFAULT 24,
  color text DEFAULT '#ffffff',
  position_x integer DEFAULT 50,
  position_y integer DEFAULT 50,
  animation_type text DEFAULT 'none',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_text_layers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view text layers in own projects"
  ON video_text_layers FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_text_layers.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create text layers in own projects"
  ON video_text_layers FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_text_layers.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update text layers in own projects"
  ON video_text_layers FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_text_layers.project_id
      AND video_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_text_layers.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete text layers in own projects"
  ON video_text_layers FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_text_layers.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

-- Video Transitions Table
CREATE TABLE IF NOT EXISTS video_transitions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid REFERENCES video_projects(id) ON DELETE CASCADE NOT NULL,
  timeline_position integer DEFAULT 0,
  type text DEFAULT 'fade' CHECK (type IN ('fade', 'dissolve', 'wipe', 'slide', 'zoom')),
  duration integer DEFAULT 1000,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_transitions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transitions in own projects"
  ON video_transitions FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_transitions.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create transitions in own projects"
  ON video_transitions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_transitions.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update transitions in own projects"
  ON video_transitions FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_transitions.project_id
      AND video_projects.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_transitions.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete transitions in own projects"
  ON video_transitions FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM video_projects
      WHERE video_projects.id = video_transitions.project_id
      AND video_projects.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_video_projects_user_id ON video_projects(user_id);
CREATE INDEX IF NOT EXISTS idx_video_clips_project_id ON video_clips(project_id);
CREATE INDEX IF NOT EXISTS idx_video_text_layers_project_id ON video_text_layers(project_id);
CREATE INDEX IF NOT EXISTS idx_video_transitions_project_id ON video_transitions(project_id);