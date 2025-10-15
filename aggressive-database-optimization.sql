-- AGGRESSIVE DATABASE OPTIMIZATION
-- This will significantly improve query performance and prevent timeouts

-- 1. Create comprehensive indexes for all common queries
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_created_at_desc 
ON registrations(created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_category_created 
ON registrations(category, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_status_created 
ON registrations(status, created_at DESC);

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_email_hash 
ON registrations USING hash(email);

-- 2. Create partial indexes for better performance
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_registrations_recent 
ON registrations(created_at DESC) 
WHERE created_at > NOW() - INTERVAL '30 days';

-- 3. Optimize table settings
ALTER TABLE registrations SET (
    fillfactor = 90,
    autovacuum_vacuum_scale_factor = 0.1,
    autovacuum_analyze_scale_factor = 0.05
);

-- 4. Update table statistics
ANALYZE registrations;

-- 5. Vacuum and reindex for optimal performance
VACUUM ANALYZE registrations;

-- 6. Check current performance
EXPLAIN (ANALYZE, BUFFERS) 
SELECT id, created_at, category, first_name, last_name, email 
FROM registrations 
ORDER BY created_at DESC 
LIMIT 50;

-- 7. Show table size and index usage
SELECT 
    schemaname,
    tablename,
    indexname,
    idx_scan,
    idx_tup_read,
    idx_tup_fetch
FROM pg_stat_user_indexes 
WHERE tablename = 'registrations'
ORDER BY idx_scan DESC;
