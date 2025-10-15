// Test simplified database query
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSimpleQuery() {
    console.log('🔍 Testing simplified database query...\n');

    try {
        // Test simplified query
        console.log('Testing simplified query...');
        const startTime = Date.now();
        const { data, error } = await supabase
            .from('registrations')
            .select('id, created_at, category, first_name, last_name, email, college, academic_year, department, section, selected_events, accommodation_required, uploaded_file_name, team_size, team_members, status')
            .order('created_at', { ascending: false })
            .limit(100);

        if (error) {
            console.error('❌ Query failed:', error.message);
            return;
        }

        const queryTime = Date.now() - startTime;
        console.log(`✅ Fetched ${data.length} registrations in ${queryTime}ms`);

        if (queryTime < 3000) {
            console.log('✅ Query is fast enough for admin dashboard!');
        } else {
            console.log('⚠️  Query is still slow. Database optimization needed.');
        }

        // Show sample data
        if (data.length > 0) {
            console.log('\n📋 Sample registrations:');
            data.slice(0, 3).forEach((reg, index) => {
                console.log(`   ${index + 1}. ${reg.first_name} ${reg.last_name} (${reg.email}) - ${reg.category}`);
            });
        }

        console.log(`\n🎉 Test completed! Query time: ${queryTime}ms`);

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

testSimpleQuery();
