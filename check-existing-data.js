// Script to check existing data in the database
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function checkExistingData() {
    console.log('🔍 Checking existing registrations in database...\n');

    try {
        // First, try to count records
        console.log('1. Counting total registrations...');
        const { count, error: countError } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Count failed:', countError.message);
            console.log('This might be due to RLS policies. Let me try a different approach...\n');
            
            // Try to fetch with service role or different method
            console.log('2. Trying to fetch data directly...');
            const { data: directData, error: directError } = await supabase
                .from('registrations')
                .select('*')
                .limit(10);

            if (directError) {
                console.error('❌ Direct fetch failed:', directError.message);
                console.log('\n📋 The issue is likely RLS policies blocking access.');
                console.log('We need to fix the RLS policies to see existing data.');
                return;
            }

            console.log(`✅ Found ${directData.length} registrations (showing first 10)`);
            if (directData.length > 0) {
                console.log('\n📋 Sample registration:');
                console.log(JSON.stringify(directData[0], null, 2));
            }
        } else {
            console.log(`✅ Total registrations found: ${count}`);
            
            if (count > 0) {
                // Fetch all data
                console.log('\n2. Fetching all registrations...');
                const { data: allData, error: allError } = await supabase
                    .from('registrations')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (allError) {
                    console.error('❌ Fetch failed:', allError.message);
                    return;
                }

                console.log(`✅ Successfully fetched ${allData.length} registrations`);
                
                // Show summary
                console.log('\n📊 Registration Summary:');
                const categoryCount = allData.reduce((acc, reg) => {
                    acc[reg.category] = (acc[reg.category] || 0) + 1;
                    return acc;
                }, {});
                
                Object.entries(categoryCount).forEach(([category, count]) => {
                    console.log(`   ${category}: ${count} registrations`);
                });

                // Show recent registrations
                console.log('\n📋 Recent registrations:');
                allData.slice(0, 3).forEach((reg, index) => {
                    console.log(`   ${index + 1}. ${reg.first_name} ${reg.last_name} (${reg.email}) - ${reg.category}`);
                });

                // Check for missing columns
                console.log('\n🔍 Checking for missing columns...');
                const sampleReg = allData[0];
                const requiredColumns = [
                    'uploaded_file_name', 'uploaded_file_url', 'uploaded_file_size', 
                    'uploaded_file_type', 'team_size', 'team_members'
                ];
                
                const missingColumns = requiredColumns.filter(col => !(col in sampleReg));
                if (missingColumns.length > 0) {
                    console.log('❌ Missing columns:', missingColumns.join(', '));
                    console.log('These columns need to be added to the database schema.');
                } else {
                    console.log('✅ All required columns exist');
                }
            } else {
                console.log('\n📋 No registrations found in database');
            }
        }

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// Run the check
checkExistingData();
