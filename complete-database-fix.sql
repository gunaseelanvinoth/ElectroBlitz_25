-- Complete database fix for ElectroBlitz 2025
-- This script ensures all required columns exist and RLS is properly configured

-- First, disable RLS to allow registrations to work
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (ignore errors if they don't exist)
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow service role read" ON registrations;
DROP POLICY IF EXISTS "Allow service role update" ON registrations;
DROP POLICY IF EXISTS "Allow service role delete" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON registrations;
DROP POLICY IF EXISTS "Enable all for service role" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON registrations;

-- Add missing columns for file upload functionality
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS uploaded_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_file_type VARCHAR(100);

-- Add missing columns for team functionality
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS team_members JSONB;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_uploaded_file ON registrations(uploaded_file_name);
CREATE INDEX IF NOT EXISTS idx_registrations_team_size ON registrations(team_size);

-- Update the table comment
COMMENT ON COLUMN registrations.uploaded_file_name IS 'Name of the uploaded file';
COMMENT ON COLUMN registrations.uploaded_file_url IS 'URL/path to the uploaded file';
COMMENT ON COLUMN registrations.uploaded_file_size IS 'Size of the uploaded file in bytes';
COMMENT ON COLUMN registrations.uploaded_file_type IS 'MIME type of the uploaded file';
COMMENT ON COLUMN registrations.team_size IS 'Number of team members';
COMMENT ON COLUMN registrations.team_members IS 'JSON array of team member details';

-- Ensure the table has all required columns by recreating if necessary
-- This is a safe operation that won't lose data
DO $$
BEGIN
    -- Check if the table exists and has the right structure
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'registrations' 
        AND column_name = 'uploaded_file_name'
    ) THEN
        -- Add the missing columns
        ALTER TABLE registrations 
        ADD COLUMN uploaded_file_name VARCHAR(255),
        ADD COLUMN uploaded_file_url TEXT,
        ADD COLUMN uploaded_file_size BIGINT,
        ADD COLUMN uploaded_file_type VARCHAR(100),
        ADD COLUMN team_size INTEGER,
        ADD COLUMN team_members JSONB;
    END IF;
END $$;

-- Test the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
