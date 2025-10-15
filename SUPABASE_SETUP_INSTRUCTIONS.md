# Supabase Database Setup Instructions

## Issue Identified
The admin dashboard is empty because:
1. Row Level Security (RLS) is enabled on the `registrations` table
2. No RLS policies are configured to allow anonymous inserts
3. This prevents new registrations from being saved to the database

## Solution
You need to run the following SQL commands in your Supabase SQL Editor:

### Step 1: Disable RLS and Add Missing Columns
```sql
-- Disable Row Level Security to allow registrations
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Drop any existing policies
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
```

### Step 2: Verify the Fix
After running the above SQL, test the connection by:
1. Going to your admin dashboard
2. Clicking the "Test Connection" button in the SupabaseTest component
3. The test should now pass and show "All tests passed!"

## Alternative: Enable RLS with Proper Policies
If you prefer to keep RLS enabled for security, use this instead:

```sql
-- Enable RLS
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies for anonymous users
CREATE POLICY "Enable insert for anonymous users" ON registrations
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

CREATE POLICY "Enable read for authenticated users" ON registrations
    FOR SELECT 
    TO authenticated 
    USING (true);

-- Create policies for service role (admin operations)
CREATE POLICY "Enable all for service role" ON registrations
    FOR ALL 
    TO service_role 
    USING (true)
    WITH CHECK (true);
```

## Files to Apply
1. Run the SQL from `complete-database-fix.sql` in your Supabase SQL Editor
2. The admin dashboard should now show registrations properly

## Testing
After applying the fix:
1. Try registering a new user through the registration form
2. Check the admin dashboard - it should now show the registration
3. Use the "Test Connection" button to verify everything is working
