-- Database optimization to prevent timeout issues
-- Run this in your Supabase SQL Editor

-- 1. Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_registrations_created_at_desc ON registrations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_registrations_category_status ON registrations(category, status);
CREATE INDEX IF NOT EXISTS idx_registrations_email_lookup ON registrations(email);

-- 2. Analyze table statistics for better query planning
ANALYZE registrations;

-- 3. Check current table size and performance
SELECT 
    schemaname,
    tablename,
    attname,
    n_distinct,
    correlation
FROM pg_stats 
WHERE tablename = 'registrations';

-- 4. Show table size
SELECT 
    pg_size_pretty(pg_total_relation_size('registrations')) as table_size,
    COUNT(*) as total_rows
FROM registrations;

-- 5. Check for any long-running queries
SELECT 
    pid,
    now() - pg_stat_activity.query_start AS duration,
    query 
FROM pg_stat_activity 
WHERE (now() - pg_stat_activity.query_start) > interval '5 minutes'
AND query NOT LIKE '%pg_stat_activity%';

-- 6. Optimize the table
VACUUM ANALYZE registrations;
