// Simple script to verify the admin dashboard fix works
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://iidtgymrlfuznnccbbyu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpZHRneW1ybGZ1em5uY2NiYnl1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk5MDA1NjcsImV4cCI6MjA3NTQ3NjU2N30.HmDPnu5sYscIwJ1VbDn4oV50A35a1vI0KQZhfswfJFs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function verifyFix() {
    console.log('🔍 Verifying admin dashboard fix...\n');

    try {
        // Test 1: Count registrations
        console.log('1. Counting registrations...');
        const { count, error: countError } = await supabase
            .from('registrations')
            .select('*', { count: 'exact', head: true });

        if (countError) {
            console.error('❌ Still blocked by RLS:', countError.message);
            console.log('\n💡 You need to run the SQL fix in Supabase:');
            console.log('   ALTER TABLE registrations DISABLE ROW LEVEL SECURITY;');
            return;
        }

        console.log(`✅ Found ${count} registrations`);

        // Test 2: Fetch registrations
        console.log('\n2. Fetching registrations...');
        const { data, error } = await supabase
            .from('registrations')
            .select('id, first_name, last_name, email, category, created_at')
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) {
            console.error('❌ Fetch failed:', error.message);
            return;
        }

        console.log(`✅ Successfully fetched ${data.length} registrations`);
        
        if (data.length > 0) {
            console.log('\n📋 Recent registrations:');
            data.forEach((reg, index) => {
                console.log(`   ${index + 1}. ${reg.first_name} ${reg.last_name} (${reg.email}) - ${reg.category}`);
            });
        }

        // Test 3: Test insert
        console.log('\n3. Testing new registration...');
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
            console.error('❌ Insert still blocked:', insertError.message);
            return;
        }

        console.log('✅ New registration works!');
        
        // Clean up
        await supabase.from('registrations').delete().eq('id', insertData.id);
        console.log('✅ Test registration cleaned up');

        console.log('\n🎉 Admin dashboard fix is working!');
        console.log('   - Registrations are visible');
        console.log('   - New registrations can be saved');
        console.log('   - Admin dashboard should now show data');

    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

verifyFix();
