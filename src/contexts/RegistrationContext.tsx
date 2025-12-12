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
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
    const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

    const persistLocally = (newRegistration: FormData) => {
        const updatedRegistrations = [...registrations, newRegistration];
        setRegistrations(updatedRegistrations);
        localStorage.setItem('electroblitz-registrations', JSON.stringify(updatedRegistrations));
    };

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

            const shouldAttemptRemote = !!supabaseUrl && !!supabaseKey;
            if (shouldAttemptRemote) {
                console.log('Inserting data via Supabase...');
                const { data, error } = await supabase
                    .from('registrations')
                    .insert(registrationData)
                    .select()
                    .single();

                if (error) {
                    console.error('Supabase insert error:', error);
                    const message = error.message || 'Remote save failed';
                    // Fall back to local persistence so the user can continue
                    const fallbackRegistration = {
                        ...registration,
                        id: crypto.randomUUID(),
                        registrationDate: new Date().toISOString()
                    };
                    persistLocally(fallbackRegistration);
                    return { success: true, error: `Saved locally only: ${message}` };
                }

                console.log('Data inserted successfully:', data);

                const newRegistration = {
                    ...registration,
                    id: (data as any).id,
                    registrationDate: (data as any).created_at
                };
                
                persistLocally(newRegistration);

                console.log('Registration completed successfully');
                return { success: true };
            } else {
                console.warn('Supabase credentials missing; saving locally only.');
                const localOnlyRegistration = {
                    ...registration,
                    id: crypto.randomUUID(),
                    registrationDate: new Date().toISOString()
                };
                persistLocally(localOnlyRegistration);
                return { success: true, error: 'Saved locally (Supabase not configured).' };
            }
        } catch (error) {
            console.error('Registration error:', error);
            const isFetchError = error instanceof Error && error.message.toLowerCase().includes('failed to fetch');
            const fallbackRegistration = {
                ...registration,
                id: crypto.randomUUID(),
                registrationDate: new Date().toISOString()
            };
            persistLocally(fallbackRegistration);
            if (isFetchError) {
                return { success: true, error: 'Saved locally. Network is unreachable.' };
            }
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
