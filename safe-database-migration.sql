-- SAFE DATABASE MIGRATION FOR EXISTING REGISTRATIONS
-- This script preserves all 142 existing registrations while fixing the admin dashboard

-- IMPORTANT: This script is designed to be safe and preserve all existing data
-- It only adds missing columns and fixes RLS policies

-- Step 1: First, let's check what columns already exist
-- (This is just for reference - you can run this separately to see the current structure)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;

-- Step 2: Add missing columns safely (IF NOT EXISTS prevents errors if columns already exist)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS uploaded_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_file_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS team_members JSONB;

-- Step 3: Create indexes for better performance (IF NOT EXISTS prevents errors)
CREATE INDEX IF NOT EXISTS idx_registrations_uploaded_file ON registrations(uploaded_file_name);
CREATE INDEX IF NOT EXISTS idx_registrations_team_size ON registrations(team_size);

-- Step 4: Fix RLS policies to allow admin dashboard to read data
-- First, disable RLS temporarily to fix the policies
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Drop any existing problematic policies
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow service role read" ON registrations;
DROP POLICY IF EXISTS "Allow service role update" ON registrations;
DROP POLICY IF EXISTS "Allow service role delete" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON registrations;
DROP POLICY IF EXISTS "Enable all for service role" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON registrations;

-- Step 5: Create proper RLS policies that allow:
-- 1. Anonymous users to insert new registrations
-- 2. Service role to read all data (for admin dashboard)
-- 3. Service role to perform admin operations

-- Enable RLS with proper policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow anonymous users to insert new registrations
CREATE POLICY "Enable insert for anonymous users" ON registrations
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Policy 2: Allow service role to read all data (for admin dashboard)
CREATE POLICY "Enable read for service role" ON registrations
    FOR SELECT 
    TO service_role 
    USING (true);

-- Policy 3: Allow service role to update data (for admin operations)
CREATE POLICY "Enable update for service role" ON registrations
    FOR UPDATE 
    TO service_role 
    USING (true)
    WITH CHECK (true);

-- Policy 4: Allow service role to delete data (for admin operations)
CREATE POLICY "Enable delete for service role" ON registrations
    FOR DELETE 
    TO service_role 
    USING (true);

-- Step 6: Verify the migration worked
-- Count total registrations (should still be 142)
SELECT COUNT(*) as total_registrations FROM registrations;

-- Check if we can read the data
SELECT id, first_name, last_name, email, category, created_at 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 5;

-- Check the table structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'registrations' 
ORDER BY ordinal_position;
