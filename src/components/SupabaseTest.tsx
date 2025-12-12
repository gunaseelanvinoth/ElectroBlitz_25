import React, { useState } from 'react';
import { supabase } from '../utils/supabase';

const SupabaseTest: React.FC = () => {
    const [testResult, setTestResult] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);

    const testConnection = async () => {
        setIsLoading(true);
        setTestResult('Testing connection...');
        
        try {
            const { data, error } = await supabase
                .from('registrations')
                .select('count')
                .limit(1);

            if (error) {
                setTestResult(`❌ Connection failed: ${error.message}`);
                return;
            }

            setTestResult('✅ Connection successful! Database is accessible.');
            
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
                setTestResult(`❌ Insert test failed: ${insertError.message}`);
                return;
            }

            setTestResult(`✅ All tests passed! Test record created with ID: ${insertData.id}`);
            
            await supabase
                .from('registrations')
                .delete()
                .eq('id', insertData.id);

        } catch (error) {
            setTestResult(`❌ Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ 
            padding: '20px', 
            margin: '20px', 
            border: '1px solid #ccc', 
            borderRadius: '8px',
            backgroundColor: '#f9f9f9'
        }}>
            <h3>Supabase Connection Test</h3>
            <button 
                onClick={testConnection} 
                disabled={isLoading}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? 'Testing...' : 'Test Connection'}
            </button>
            <div style={{ marginTop: '10px', fontFamily: 'monospace' }}>
                {testResult}
            </div>
        </div>
    );
};

export default SupabaseTest;
