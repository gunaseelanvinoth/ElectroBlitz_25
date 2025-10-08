import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormData } from '../components/RegistrationPage';
import { supabase } from '../utils/supabase';

interface RegistrationContextType {
    registrations: FormData[];
    addRegistration: (registration: FormData) => Promise<{ success: boolean; error?: string }>;
    getRegistrations: () => FormData[];
    clearRegistrations: () => void;
    isLoading: boolean;
}

const RegistrationContext = createContext<RegistrationContextType | undefined>(undefined);

export const useRegistrations = () => {
    const context = useContext(RegistrationContext);
    if (!context) {
        throw new Error('useRegistrations must be used within a RegistrationProvider');
    }
    return context;
};

export const RegistrationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [registrations, setRegistrations] = useState<FormData[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    // Load registrations from localStorage on mount (for offline support)
    useEffect(() => {
        const savedRegistrations = localStorage.getItem('electroblitz-registrations');
        if (savedRegistrations) {
            try {
                setRegistrations(JSON.parse(savedRegistrations));
            } catch (error) {
                console.error('Error loading registrations from localStorage:', error);
            }
        }
    }, []);

    const addRegistration = async (registration: FormData): Promise<{ success: boolean; error?: string }> => {
        setIsLoading(true);
        
        try {
            console.log('Starting registration process...');
            console.log('Registration data:', registration);

            // Test Supabase connection first
            console.log('Testing Supabase connection...');
            const { data: testData, error: testError } = await supabase
                .from('registrations')
                .select('count')
                .limit(1);

            if (testError) {
                console.error('Supabase connection test failed:', testError);
                return { success: false, error: `Database connection failed: ${testError.message}` };
            }

            console.log('Supabase connection successful');

            // Prepare data for Supabase
            const registrationData = {
                category: registration.category,
                first_name: registration.personalInfo.firstName,
                last_name: registration.personalInfo.lastName,
                email: registration.personalInfo.email,
                phone: registration.personalInfo.phone,
                college: registration.personalInfo.college,
                academic_year: registration.personalInfo.year,
                department: registration.personalInfo.department,
                section: registration.personalInfo.section,
                selected_events: registration.selectedEvents,
                dietary_requirements: registration.additionalInfo.dietaryRequirements,
                accommodation_required: registration.additionalInfo.accommodation,
                emergency_contact: registration.additionalInfo.emergencyContact,
                emergency_phone: registration.additionalInfo.emergencyPhone,
                uploaded_file_name: registration.uploadedFile?.name || null,
                uploaded_file_url: registration.uploadedFile?.url || null,
                uploaded_file_size: registration.uploadedFile?.size || null,
                uploaded_file_type: registration.uploadedFile?.type || null,
                team_size: (registration.category === 'tech' || registration.category === 'non-tech')
                    ? (registration.teamSize || 1)
                    : null,
                team_members: (registration.category === 'tech' || registration.category === 'non-tech')
                    ? (registration.teamMembers || [])
                    : null,
                status: 'pending'
            };

            console.log('Prepared registration data:', registrationData);

            // Insert into Supabase
            console.log('Inserting data into Supabase...');
            const { data, error } = await supabase
                .from('registrations')
                .insert([registrationData])
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
                console.error('Error details:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                });
                return { success: false, error: `Database error: ${error.message}` };
            }

            console.log('Data inserted successfully:', data);

            // Add to local state with the returned ID
            const newRegistration = {
                ...registration,
                id: data.id,
                registrationDate: data.created_at
            };
            
            setRegistrations(prev => [...prev, newRegistration]);
            
            // Also save to localStorage for offline support
            const updatedRegistrations = [...registrations, newRegistration];
            localStorage.setItem('electroblitz-registrations', JSON.stringify(updatedRegistrations));

            console.log('Registration completed successfully');
            return { success: true };
        } catch (error) {
            console.error('Registration error:', error);
            return { success: false, error: `Unexpected error: ${error instanceof Error ? error.message : 'Unknown error'}` };
        } finally {
            setIsLoading(false);
        }
    };

    const getRegistrations = () => {
        return registrations;
    };

    const clearRegistrations = () => {
        setRegistrations([]);
        localStorage.removeItem('electroblitz-registrations');
    };

    const value: RegistrationContextType = {
        registrations,
        addRegistration,
        getRegistrations,
        clearRegistrations,
        isLoading
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
};
