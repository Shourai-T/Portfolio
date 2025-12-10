-- Add type column to tags table
ALTER TABLE tags ADD COLUMN type text NOT NULL DEFAULT 'project';

-- Add check constraint for allowed types
ALTER TABLE tags ADD CONSTRAINT tags_type_check CHECK (type IN ('project', 'blog', 'photo'));

-- Drop old unique constraint on name
ALTER TABLE tags DROP CONSTRAINT IF EXISTS tags_name_key;

-- Add new unique constraint on name and type
ALTER TABLE tags ADD CONSTRAINT tags_name_type_key UNIQUE (name, type);
