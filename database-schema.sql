-- Create registrations table for ElectroBlitz 2025
CREATE TABLE IF NOT EXISTS registrations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Category selection
    category VARCHAR(20) NOT NULL CHECK (category IN ('tech', 'non-tech', 'workshop')),
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    college VARCHAR(255) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    department VARCHAR(100) NOT NULL,
    section VARCHAR(50),
    
    -- Selected events (stored as JSON array)
    selected_events JSONB NOT NULL DEFAULT '[]',
    
    -- Additional information
    dietary_requirements TEXT,
    accommodation_required BOOLEAN DEFAULT FALSE,
    emergency_contact VARCHAR(255),
    emergency_phone VARCHAR(20),
    
    -- Registration metadata
    registration_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_email ON registrations(email);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON registrations(category);
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON registrations(created_at);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at (only if it doesn't exist)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_registrations_updated_at') THEN
        CREATE TRIGGER update_registrations_updated_at 
            BEFORE UPDATE ON registrations 
            FOR EACH ROW 
            EXECUTE FUNCTION update_updated_at_column();
    END IF;
END $$;

-- First, disable RLS to clear any existing policies
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow service role read" ON registrations;
DROP POLICY IF EXISTS "Allow service role update" ON registrations;
DROP POLICY IF EXISTS "Allow service role delete" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON registrations;
DROP POLICY IF EXISTS "Enable all for service role" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON registrations;

-- Keep RLS disabled to allow registrations to work
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;