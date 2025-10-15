// Test script to verify database connection and data retrieval
const { createClient } = require('@supabase/supabase-js');

// Supabase configuration
const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testDatabaseConnection() {
    console.log('🔍 Testing Supabase database connection...\n');

    try {
        // Test 1: Basic connection
        console.log('1. Testing basic connection...');
        const { data: testData, error: testError } = await supabase
            .from('registrations')
            .select('count')
            .limit(1);

        if (testError) {
            console.error('❌ Connection failed:', testError.message);
            return;
        }
        console.log('✅ Connection successful!');

        // Test 2: Check table structure
        console.log('\n2. Checking table structure...');
        const { data: structureData, error: structureError } = await supabase
            .from('registrations')
            .select('*')
            .limit(1);

        if (structureError) {
            console.error('❌ Structure check failed:', structureError.message);
            return;
        }
        console.log('✅ Table structure accessible');

        // Test 3: Count existing records
        console.log('\n3. Counting existing records...');
        const { count, error: countError } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Count failed:', countError.message);
            return;
        }
        console.log(`✅ Found ${count} existing registrations`);

        // Test 4: Fetch all records
        console.log('\n4. Fetching all registrations...');
        const { data: allData, error: allError } = await supabase
            .from('registrations')
            .select('*')
            .order('created_at', { ascending: false });

        if (allError) {
            console.error('❌ Fetch failed:', allError.message);
            return;
        }

        console.log(`✅ Successfully fetched ${allData.length} registrations`);
        
        if (allData.length > 0) {
            console.log('\n📋 Sample registration data:');
            console.log(JSON.stringify(allData[0], null, 2));
        } else {
            console.log('\n📋 No registrations found in database');
        }

        // Test 5: Try to insert a test record
        console.log('\n5. Testing insert functionality...');
        const testRegistration = {
            category: 'tech',
            first_name: 'Test',
            last_name: 'User',
            email: `test-${Date.now()}@example.com`,
            phone: '1234567890',
            college: 'Test College',
            academic_year: '2024',
            department: 'Computer Science',
            section: 'A',
            selected_events: ['hackathon'],
            dietary_requirements: '',
            accommodation_required: false,
            emergency_contact: '',
            emergency_phone: '',
            status: 'pending',
            uploaded_file_name: null,
            uploaded_file_url: null,
            uploaded_file_size: null,
            uploaded_file_type: null,
            team_size: 1,
            team_members: null
        };

        const { data: insertData, error: insertError } = await supabase
            .from('registrations')
            .insert([testRegistration])
            .select()
            .single();

        if (insertError) {
            console.error('❌ Insert test failed:', insertError.message);
            console.error('Error details:', insertError);
            return;
        }

        console.log('✅ Insert test successful!');
        console.log('Created test record with ID:', insertData.id);

        // Clean up test record
        console.log('\n6. Cleaning up test record...');
        const { error: deleteError } = await supabase
            .from('registrations')
            .delete()
            .eq('id', insertData.id);

        if (deleteError) {
            console.error('❌ Cleanup failed:', deleteError.message);
        } else {
            console.log('✅ Test record cleaned up successfully');
        }

        console.log('\n🎉 All tests passed! Database is working correctly.');

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
    }
}

// Run the test
testDatabaseConnection();
