// Test optimized database query to prevent timeout
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testOptimizedQuery() {
    console.log('🔍 Testing optimized database query...\n');

    try {
        // Test 1: Get total count (fast)
        console.log('1. Getting total count...');
        const startTime1 = Date.now();
        const { count, error: countError } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Count failed:', countError.message);
            return;
        }

        const countTime = Date.now() - startTime1;
        console.log(`✅ Found ${count} registrations in ${countTime}ms`);

        // Test 2: Optimized query with specific columns and limit
        console.log('\n2. Testing optimized query...');
        const startTime2 = Date.now();
        const { data, error } = await supabase
            .from('registrations')
            .select(`
                id,
                created_at,
                category,
                first_name,
                last_name,
                email,
                phone,
                college,
                academic_year,
                department,
                section,
                selected_events,
                dietary_requirements,
                accommodation_required,
                emergency_contact,
                emergency_phone,
                uploaded_file_name,
                uploaded_file_url,
                uploaded_file_size,
                uploaded_file_type,
                team_size,
                team_members,
                status
            `)
            .order('created_at', { ascending: false })
            .limit(50); // Limit to 50 records

        if (error) {
            console.error('❌ Query failed:', error.message);
            return;
        }

        const queryTime = Date.now() - startTime2;
        console.log(`✅ Fetched ${data.length} registrations in ${queryTime}ms`);

        // Test 3: Check if query is fast enough
        if (queryTime > 5000) {
            console.log('⚠️  Query is still slow. Consider database optimization.');
        } else {
            console.log('✅ Query is fast enough for admin dashboard.');
        }

        // Test 4: Show sample data
        if (data.length > 0) {
            console.log('\n📋 Sample registration:');
            console.log(`   Name: ${data[0].first_name} ${data[0].last_name}`);
            console.log(`   Email: ${data[0].email}`);
            console.log(`   Category: ${data[0].category}`);
            console.log(`   Created: ${data[0].created_at}`);
        }

        console.log('\n🎉 Optimized query test completed!');
        console.log(`   Total registrations: ${count}`);
        console.log(`   Query time: ${queryTime}ms`);
        console.log(`   Records fetched: ${data.length}`);

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

testOptimizedQuery();
