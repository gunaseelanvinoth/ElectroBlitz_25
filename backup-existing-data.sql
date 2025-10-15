-- BACKUP SCRIPT FOR EXISTING REGISTRATIONS
-- Run this BEFORE applying any fixes to create a backup

-- Create a backup table with all existing data
CREATE TABLE IF NOT EXISTS registrations_backup AS 
SELECT * FROM registrations;

-- Verify the backup was created
SELECT COUNT(*) as backup_count FROM registrations_backup;

-- Show sample of backed up data
SELECT id, first_name, last_name, email, category, created_at 
FROM registrations_backup 
ORDER BY created_at DESC 
LIMIT 5;
