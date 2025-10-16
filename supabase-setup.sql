-- ElectroBlitz Supabase Setup Script
-- Run this in your Supabase SQL Editor

-- 1. Create the registrations table
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS public.registrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  registration_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Core fields
  category TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  college TEXT,
  academic_year TEXT,
  department TEXT,
  section TEXT,
  
  -- Selections
  selected_events JSONB NOT NULL DEFAULT '[]'::jsonb,
  
  -- Additional info
  dietary_requirements TEXT,
  accommodation_required BOOLEAN DEFAULT FALSE,
  emergency_contact TEXT,
  emergency_phone TEXT,
  
  -- File upload
  uploaded_file_name TEXT,
  uploaded_file_url TEXT,
  uploaded_file_size BIGINT,
  uploaded_file_type TEXT,
  
  -- Team info
  team_size INTEGER,
  team_members JSONB DEFAULT '[]'::jsonb,
  
  -- Status
  status TEXT NOT NULL DEFAULT 'pending'
);

-- 2. Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at ON public.registrations (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_category ON public.registrations (category);
CREATE INDEX IF NOT EXISTS idx_registrations_email ON public.registrations (email);

-- 3. Enable Row Level Security
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- 4. Create policies for anonymous access
DROP POLICY IF EXISTS "allow_public_insert" ON public.registrations;
CREATE POLICY "allow_public_insert"
ON public.registrations
FOR INSERT
TO anon
WITH CHECK (true);

DROP POLICY IF EXISTS "allow_public_select" ON public.registrations;
CREATE POLICY "allow_public_select"
ON public.registrations
FOR SELECT
TO anon
USING (true);

DROP POLICY IF EXISTS "allow_public_delete" ON public.registrations;
CREATE POLICY "allow_public_delete"
ON public.registrations
FOR DELETE
TO anon
USING (true);

-- 5. Create function to update updated_at automatically
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 6. Create trigger for updated_at
DROP TRIGGER IF EXISTS trg_registrations_set_updated_at ON public.registrations;
CREATE TRIGGER trg_registrations_set_updated_at
BEFORE UPDATE ON public.registrations
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 7. Insert some test data
INSERT INTO public.registrations (
  category, first_name, last_name, email, phone, college, academic_year, 
  department, section, selected_events, accommodation_required, status
) VALUES 
('tech', 'John', 'Doe', 'john.doe@example.com', '1234567890', 'Test University', '2024', 'Computer Science', 'A', '["hackathon", "coding-contest"]'::jsonb, false, 'pending'),
('non-tech', 'Jane', 'Smith', 'jane.smith@example.com', '0987654321', 'Test College', '2024', 'Electronics', 'B', '["quiz", "debate"]'::jsonb, true, 'pending'),
('workshop', 'Bob', 'Johnson', 'bob.johnson@example.com', '1122334455', 'Tech Institute', '2024', 'IT', 'C', '["blockchain", "iot"]'::jsonb, false, 'pending')
ON CONFLICT (id) DO NOTHING;

-- 8. Verify the data
SELECT COUNT(*) as total_registrations FROM public.registrations;
SELECT category, COUNT(*) as count FROM public.registrations GROUP BY category;
