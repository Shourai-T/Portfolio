-- Seed Project Tags
INSERT INTO tags (name, type) VALUES
  ('React', 'project'),
  ('TypeScript', 'project'),
  ('Next.js', 'project'),
  ('TailwindCSS', 'project'),
  ('Supabase', 'project'),
  ('Node.js', 'project'),
  ('Python', 'project'),
  ('AI', 'project'),
  ('PostgreSQL', 'project'),
  ('Full Stack', 'project')
ON CONFLICT (name, type) DO NOTHING;

-- Seed Blog Tags
INSERT INTO tags (name, type) VALUES
  ('Tutorial', 'blog'),
  ('Career', 'blog'),
  ('Life', 'blog'),
  ('Tech', 'blog'),
  ('Guide', 'blog'),
  ('Thoughts', 'blog'),
  ('Productivity', 'blog')
ON CONFLICT (name, type) DO NOTHING;

-- Seed Photo Tags
INSERT INTO tags (name, type) VALUES
  ('Nature', 'photo'),
  ('Travel', 'photo'),
  ('Portrait', 'photo'),
  ('Tech Setup', 'photo'),
  ('Urban', 'photo'),
  ('Macro', 'photo'),
  ('Life', 'photo')
ON CONFLICT (name, type) DO NOTHING;
