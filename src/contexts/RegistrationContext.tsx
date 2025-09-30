import React, { createContext, useContext, useState, useEffect } from 'react';
import { FormData } from '../components/RegistrationPage';

interface RegistrationContextType {
    registrations: FormData[];
    addRegistration: (registration: FormData) => void;
    getRegistrations: () => FormData[];
    clearRegistrations: () => void;
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

    // Load registrations from localStorage on mount
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

    // Save registrations to localStorage whenever registrations change
    useEffect(() => {
    localStorage.setItem('electroblitz-registrations', JSON.stringify(registrations));
    }, [registrations]);

    const addRegistration = (registration: FormData) => {
        const newRegistration = {
            ...registration,
            id: Date.now().toString(), // Add unique ID
            registrationDate: new Date().toISOString()
        };
        setRegistrations(prev => [...prev, newRegistration]);
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
        clearRegistrations
    };

    return (
        <RegistrationContext.Provider value={value}>
            {children}
        </RegistrationContext.Provider>
    );
};
