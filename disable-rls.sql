-- Temporarily disable RLS to allow registrations to work
-- This is a quick fix for testing purposes

-- Disable Row Level Security on the registrations table
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- This will allow anonymous users to insert data without any restrictions
-- WARNING: This removes all security restrictions on the table
-- Only use this for testing or if you don't need RLS
