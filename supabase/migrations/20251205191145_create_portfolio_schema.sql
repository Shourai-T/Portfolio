/*
  # Create Portfolio Schema

  ## Overview
  This migration creates the complete database schema for Nguyễn Anh Tuấn's portfolio website.

  ## 1. New Tables

  ### `projects`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Project title
  - `slug` (text, unique) - URL-friendly identifier
  - `description` (text) - Short description
  - `content` (text) - Full project details
  - `image_url` (text) - Main project image
  - `demo_url` (text, optional) - Live demo link
  - `github_url` (text, optional) - GitHub repository link
  - `tags` (text[]) - Technology tags
  - `featured` (boolean) - Whether project is featured
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `blog_posts`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Post title
  - `slug` (text, unique) - URL-friendly identifier
  - `excerpt` (text) - Short preview
  - `content` (text) - Full post content
  - `cover_image` (text, optional) - Cover image URL
  - `tags` (text[]) - Category tags
  - `published` (boolean) - Publication status
  - `views` (integer) - View count
  - `created_at` (timestamptz) - Creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### `photos`
  - `id` (uuid, primary key) - Unique identifier
  - `title` (text) - Photo title
  - `description` (text, optional) - Photo description
  - `image_url` (text) - Photo URL
  - `thumbnail_url` (text, optional) - Thumbnail URL
  - `category` (text) - Photo category
  - `tags` (text[]) - Tags for filtering
  - `featured` (boolean) - Whether photo is featured
  - `order_index` (integer) - Display order
  - `created_at` (timestamptz) - Creation timestamp

  ### `contact_messages`
  - `id` (uuid, primary key) - Unique identifier
  - `name` (text) - Sender name
  - `email` (text) - Sender email
  - `subject` (text) - Message subject
  - `message` (text) - Message content
  - `read` (boolean) - Read status
  - `created_at` (timestamptz) - Submission timestamp

  ## 2. Security
  - Enable RLS on all tables
  - Public read access for projects, blog_posts, and photos
  - Public insert access for contact_messages
  - Authenticated users can manage all content (for admin purposes)

  ## 3. Indexes
  - Add indexes on slug fields for faster lookups
  - Add indexes on featured and published fields for filtering
*/

-- Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL,
  content text NOT NULL,
  image_url text NOT NULL,
  demo_url text,
  github_url text,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  cover_image text,
  tags text[] DEFAULT '{}',
  published boolean DEFAULT false,
  views integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create photos table
CREATE TABLE IF NOT EXISTS photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  image_url text NOT NULL,
  thumbnail_url text,
  category text NOT NULL,
  tags text[] DEFAULT '{}',
  featured boolean DEFAULT false,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Create contact_messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  subject text NOT NULL,
  message text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Projects policies (public read, authenticated write)
CREATE POLICY "Anyone can view projects"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects"
  ON projects FOR DELETE
  TO authenticated
  USING (true);

-- Blog posts policies (public read published posts, authenticated full access)
CREATE POLICY "Anyone can view published blog posts"
  ON blog_posts FOR SELECT
  TO anon, authenticated
  USING (published = true);

CREATE POLICY "Authenticated users can view all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Photos policies (public read, authenticated write)
CREATE POLICY "Anyone can view photos"
  ON photos FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert photos"
  ON photos FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update photos"
  ON photos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete photos"
  ON photos FOR DELETE
  TO authenticated
  USING (true);

-- Contact messages policies (public insert, authenticated read/update)
CREATE POLICY "Anyone can submit contact messages"
  ON contact_messages FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view contact messages"
  ON contact_messages FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update contact messages"
  ON contact_messages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_slug ON projects(slug);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(published);
CREATE INDEX IF NOT EXISTS idx_photos_category ON photos(category);
CREATE INDEX IF NOT EXISTS idx_photos_featured ON photos(featured);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();