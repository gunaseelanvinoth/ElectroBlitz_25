// Simple test script to check Supabase connection
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testSupabase() {
    console.log('Testing Supabase connection...');
    
    try {
        // Test 1: Check if table exists
        console.log('1. Testing table access...');
        const { data, error } = await supabase
            .from('registrations')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Table access failed:', error);
            return;
        }
        console.log('✅ Table access successful');

        // Test 2: Try to insert a test record
        console.log('2. Testing insert operation...');
        const testData = {
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
            status: 'pending'
        };

        const { data: insertData, error: insertError } = await supabase
            .from('registrations')
            .insert([testData])
            .select()
            .single();

        if (insertError) {
            console.error('❌ Insert failed:', insertError);
            console.error('Error details:', {
                message: insertError.message,
                details: insertError.details,
                hint: insertError.hint,
                code: insertError.code
            });
            return;
        }

        console.log('✅ Insert successful! Record ID:', insertData.id);

        // Test 3: Clean up test record
        console.log('3. Cleaning up test record...');
        const { error: deleteError } = await supabase
            .from('registrations')
            .delete()
            .eq('id', insertData.id);

        if (deleteError) {
            console.error('❌ Delete failed:', deleteError);
        } else {
            console.log('✅ Delete successful');
        }

        console.log('🎉 All tests passed! Supabase is working correctly.');

    } catch (error) {
        console.error('❌ Unexpected error:', error);
    }
}

testSupabase();
