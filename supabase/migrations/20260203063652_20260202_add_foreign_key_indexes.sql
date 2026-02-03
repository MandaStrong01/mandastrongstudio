/*
  # Add Indexes for Foreign Keys

  1. **Added Indexes**
     - `ai_assets.user_id` - for auth.users foreign key
     - `video_projects.user_id` - for auth.users foreign key
     - `video_clips.project_id` - for video_projects foreign key
     - `video_text_layers.project_id` - for video_projects foreign key
     - `video_transitions.project_id` - for video_projects foreign key

  These indexes improve query performance for foreign key lookups and prevent sequential scans.
*/

CREATE INDEX IF NOT EXISTS ai_assets_user_id_idx ON public.ai_assets(user_id);
CREATE INDEX IF NOT EXISTS video_projects_user_id_idx ON public.video_projects(user_id);
CREATE INDEX IF NOT EXISTS video_clips_project_id_idx ON public.video_clips(project_id);
CREATE INDEX IF NOT EXISTS video_text_layers_project_id_idx ON public.video_text_layers(project_id);
CREATE INDEX IF NOT EXISTS video_transitions_project_id_idx ON public.video_transitions(project_id);
