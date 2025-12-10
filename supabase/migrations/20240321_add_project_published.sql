-- Add published column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS published boolean DEFAULT false;

-- Create index for published column
CREATE INDEX IF NOT EXISTS idx_projects_published ON projects(published);

-- Update RLS policy to allow public to view only published projects
DROP POLICY IF EXISTS "Anyone can view projects" ON projects;
CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  USING (published = true OR auth.role() = 'authenticated');
