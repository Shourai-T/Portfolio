-- Create profile table (Singleton)
CREATE TABLE IF NOT EXISTS profile (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    role TEXT NOT NULL,
    short_bio TEXT,
    about_content TEXT,
    social_links JSONB DEFAULT '{}'::JSONB,
    resume_url TEXT,
    avatar_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies for profile
ALTER TABLE profile ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read profile" ON profile;
CREATE POLICY "Public read profile" ON profile FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated update profile" ON profile;
CREATE POLICY "Authenticated update profile" ON profile FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated insert profile" ON profile;
CREATE POLICY "Authenticated insert profile" ON profile FOR INSERT TO authenticated WITH CHECK (true);


-- Create educations table
CREATE TABLE IF NOT EXISTS educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    school TEXT NOT NULL,
    major TEXT,
    degree TEXT,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies for educations
ALTER TABLE educations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read educations" ON educations;
CREATE POLICY "Public read educations" ON educations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert educations" ON educations;
CREATE POLICY "Authenticated insert educations" ON educations FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated update educations" ON educations;
CREATE POLICY "Authenticated update educations" ON educations FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated delete educations" ON educations;
CREATE POLICY "Authenticated delete educations" ON educations FOR DELETE TO authenticated USING (true);


-- Create experiences table
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    start_date TEXT,
    end_date TEXT,
    description TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies for experiences
ALTER TABLE experiences ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read experiences" ON experiences;
CREATE POLICY "Public read experiences" ON experiences FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert experiences" ON experiences;
CREATE POLICY "Authenticated insert experiences" ON experiences FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated update experiences" ON experiences;
CREATE POLICY "Authenticated update experiences" ON experiences FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated delete experiences" ON experiences;
CREATE POLICY "Authenticated delete experiences" ON experiences FOR DELETE TO authenticated USING (true);


-- Create technical_skills table
CREATE TABLE IF NOT EXISTS technical_skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- 'Frontend', 'Backend', 'Tools', etc.
    proficiency INTEGER DEFAULT 100, -- 0-100
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Policies for technical_skills
ALTER TABLE technical_skills ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read skills" ON technical_skills;
CREATE POLICY "Public read skills" ON technical_skills FOR SELECT USING (true);

DROP POLICY IF EXISTS "Authenticated insert skills" ON technical_skills;
CREATE POLICY "Authenticated insert skills" ON technical_skills FOR INSERT TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated update skills" ON technical_skills;
CREATE POLICY "Authenticated update skills" ON technical_skills FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated delete skills" ON technical_skills;
CREATE POLICY "Authenticated delete skills" ON technical_skills FOR DELETE TO authenticated USING (true);
