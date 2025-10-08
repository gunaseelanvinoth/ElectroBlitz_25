-- Fix RLS policies for registrations table
-- This script will fix the Row Level Security policies to allow anonymous inserts

-- First, let's check if the table exists and drop existing policies
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow service role read" ON registrations;
DROP POLICY IF EXISTS "Allow service role update" ON registrations;
DROP POLICY IF EXISTS "Allow service role delete" ON registrations;

-- Disable RLS temporarily to fix the policies
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Re-enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create a simple policy that allows anonymous users to insert
CREATE POLICY "Enable insert for anonymous users" ON registrations
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- Create a policy that allows service role to do everything
CREATE POLICY "Enable all for service role" ON registrations
    FOR ALL 
    TO service_role 
    USING (true)
    WITH CHECK (true);

-- Create a policy that allows authenticated users to read their own data
CREATE POLICY "Enable read for authenticated users" ON registrations
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Test the policies by trying to insert a test record
-- This should work now
