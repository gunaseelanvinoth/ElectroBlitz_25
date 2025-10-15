# Instructions to Fix Admin Dashboard While Preserving All 142 Existing Registrations

## Current Situation
- ✅ You have **142 existing registrations** in your database
- ❌ Admin dashboard shows empty because of RLS (Row Level Security) policies
- ❌ New registrations can't be saved due to RLS blocking inserts

## Solution: Safe Migration (No Data Loss)

### Step 1: Create Backup (Optional but Recommended)
Run this in your Supabase SQL Editor first:
```sql
-- Create backup of all existing data
CREATE TABLE IF NOT EXISTS registrations_backup AS 
SELECT * FROM registrations;

-- Verify backup
SELECT COUNT(*) as backup_count FROM registrations_backup;
```

### Step 2: Apply the Fix
Run this SQL in your Supabase SQL Editor:
```sql
-- Disable RLS temporarily
ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;

-- Drop problematic policies
DROP POLICY IF EXISTS "Allow anonymous insert" ON registrations;
DROP POLICY IF EXISTS "Allow service role read" ON registrations;
DROP POLICY IF EXISTS "Allow service role update" ON registrations;
DROP POLICY IF EXISTS "Allow service role delete" ON registrations;
DROP POLICY IF EXISTS "Enable insert for anonymous users" ON registrations;
DROP POLICY IF EXISTS "Enable all for service role" ON registrations;
DROP POLICY IF EXISTS "Enable read for authenticated users" ON registrations;

-- Add missing columns (safe - won't affect existing data)
ALTER TABLE registrations 
ADD COLUMN IF NOT EXISTS uploaded_file_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS uploaded_file_url TEXT,
ADD COLUMN IF NOT EXISTS uploaded_file_size BIGINT,
ADD COLUMN IF NOT EXISTS uploaded_file_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS team_size INTEGER,
ADD COLUMN IF NOT EXISTS team_members JSONB;

-- Enable RLS with proper policies
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Create policies that allow:
-- 1. Anonymous users to insert new registrations
CREATE POLICY "Enable insert for anonymous users" ON registrations
    FOR INSERT 
    TO anon 
    WITH CHECK (true);

-- 2. Service role to read all data (for admin dashboard)
CREATE POLICY "Enable read for service role" ON registrations
    FOR SELECT 
    TO service_role 
    USING (true);

-- 3. Service role to update data (for admin operations)
CREATE POLICY "Enable update for service role" ON registrations
    FOR UPDATE 
    TO service_role 
    USING (true)
    WITH CHECK (true);

-- 4. Service role to delete data (for admin operations)
CREATE POLICY "Enable delete for service role" ON registrations
    FOR DELETE 
    TO service_role 
    USING (true);

-- Verify all 142 registrations are still there
SELECT COUNT(*) as total_registrations FROM registrations;
```

### Step 3: Test the Fix
1. Go to your admin dashboard
2. Click "Test Connection" - it should show "All tests passed!"
3. You should now see all 142 registrations in the dashboard
4. Try registering a new user - it should work and appear in the dashboard

## What This Fix Does
- ✅ **Preserves all 142 existing registrations** (no data loss)
- ✅ **Fixes RLS policies** so admin dashboard can read data
- ✅ **Allows new registrations** to be saved
- ✅ **Adds missing columns** for file uploads and team functionality
- ✅ **Maintains data integrity** and security

## Files Created
- `minimal-fix-preserve-data.sql` - The main fix script
- `backup-existing-data.sql` - Backup script (optional)
- `safe-database-migration.sql` - Detailed migration with verification steps

## If Something Goes Wrong
If you need to restore from backup:
```sql
-- Restore from backup (only if needed)
DELETE FROM registrations;
INSERT INTO registrations SELECT * FROM registrations_backup;
```

## Expected Result
After applying the fix:
- Admin dashboard will show all 142 existing registrations
- New registrations will be saved successfully
- All export functions will work properly
- No data will be lost
