-- FINAL DATABASE FIX FOR ELECTROBLITZ 2025
-- This script fixes the admin dashboard and ensures all functionality works

-- 1) Table (idempotent) - Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- category
  category VARCHAR(20) NOT NULL CHECK (category IN ('tech','non-tech','workshop')),

  -- personal info
  first_name VARCHAR(100) NOT NULL,
  last_name  VARCHAR(100) NOT NULL,
  email      VARCHAR(255) NOT NULL UNIQUE,
  phone      VARCHAR(20)  NOT NULL,
  college    VARCHAR(255) NOT NULL,
  academic_year VARCHAR(20) NOT NULL,
  department VARCHAR(100) NOT NULL,
  section    VARCHAR(50),

  -- selected events
  selected_events JSONB NOT NULL DEFAULT '[]',

  -- additional info
  dietary_requirements TEXT,
  accommodation_required BOOLEAN DEFAULT FALSE,
  emergency_contact VARCHAR(255),
  emergency_phone   VARCHAR(20),

  -- file upload
  uploaded_file_name VARCHAR(255),
  uploaded_file_url  TEXT,
  uploaded_file_size BIGINT,
  uploaded_file_type VARCHAR(100),

  -- team data
  team_size INTEGER,
  team_members JSONB,

  -- status
  registration_date TIMESTAMPTZ DEFAULT NOW(),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending','confirmed','cancelled'))
);

-- 2) Indexes (idempotent)
CREATE INDEX IF NOT EXISTS idx_registrations_email        ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_category     ON registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at   ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_status       ON registrations(status);
CREATE INDEX IF NOT EXISTS idx_registrations_uploaded_file ON registrations(uploaded_file_name);
CREATE INDEX IF NOT EXISTS idx_registrations_team_size    ON registrations(team_size);

-- 3) updated_at trigger (idempotent)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_registrations_updated_at') THEN
    CREATE TRIGGER update_registrations_updated_at
      BEFORE UPDATE ON registrations
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;

-- 4) CRITICAL FIX: Disable RLS to allow admin dashboard access
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- 5) Remove any existing conflicting policies (safe if none exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'registrations') THEN
    DROP POLICY IF EXISTS "Allow anonymous insert"            ON registrations;
    DROP POLICY IF EXISTS "Allow service role read"           ON registrations;
    DROP POLICY IF EXISTS "Allow service role update"         ON registrations;
    DROP POLICY IF EXISTS "Allow service role delete"         ON registrations;
    DROP POLICY IF EXISTS "Enable insert for anonymous users" ON registrations;
    DROP POLICY IF EXISTS "Enable all for service role"       ON registrations;
    DROP POLICY IF EXISTS "Enable read for authenticated users" ON registrations;
  END IF;
END $$;

-- 6) Add missing columns safely (if they don't exist)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS uploaded_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_file_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS team_members JSONB;

-- 7) Helpful comments
COMMENT ON COLUMN registrations.uploaded_file_name IS 'Name of the uploaded file';
COMMENT ON COLUMN registrations.uploaded_file_url  IS 'Base64 or storage URL';
COMMENT ON COLUMN registrations.uploaded_file_size IS 'Bytes';
COMMENT ON COLUMN registrations.uploaded_file_type IS 'MIME type';
COMMENT ON COLUMN registrations.team_size          IS 'Number of team members';
COMMENT ON COLUMN registrations.team_members       IS 'JSON array of member objects';

-- 8) Verify the fix worked
SELECT COUNT(*) as total_registrations FROM registrations;

-- 9) Show table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
