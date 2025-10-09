import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';
import CategorySelection from './CategorySelection';
import PersonalInfo from './PersonalInfo';
import EventSelection from './EventSelection';
import ReviewAndSubmit from './ReviewAndSubmit';

const slideIn = keyframes`
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
`;

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const RegistrationContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

const RegistrationCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 3rem;
  max-width: 600px;
  width: 100%;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  animation: ${slideIn} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  text-align: center;
  color: #aaaaaa;
  margin-bottom: 3rem;
  font-size: 1.1rem;
`;

const ProgressContainer = styled.div`
  margin-bottom: 3rem;
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 1rem;
`;

const ProgressFill = styled.div<{ progress: number }>`
  height: 100%;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  width: ${props => props.progress}%;
  transition: width 0.3s ease;
  border-radius: 2px;
`;

const ProgressText = styled.div`
  text-align: center;
  color: #cccccc;
  font-size: 0.9rem;
`;

const StepContainer = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
`;

const NavigationButtons = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 2rem;
  gap: 1rem;
`;

const NavButton = styled.button<{ variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 2rem;
  border-radius: 25px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => props.variant === 'primary'
        ? `
      background: linear-gradient(45deg, #00d4ff, #ff00ff);
      color: #ffffff;
      
      &:hover {
        transform: translateY(-2px);
        box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
      }
    `
        : `
      background: transparent;
      color: #aaaaaa;
      border: 1px solid rgba(255, 255, 255, 0.2);
      
      &:hover {
        color: #ffffff;
        border-color: #00d4ff;
        background: rgba(0, 212, 255, 0.1);
      }
    `
    }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export interface FormData {
    id?: string;
    registrationDate?: string;
    category: 'tech' | 'non-tech' | 'workshop' | '';
    personalInfo: {
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        college: string;
        year: string;
        department: string;
        section: string;
    };
    selectedEvents: string[];
    additionalInfo: {
        dietaryRequirements: string;
        accommodation: boolean;
        emergencyContact: string;
        emergencyPhone: string;
    };
    uploadedFile?: {
        name: string;
        url: string;
        size: number;
        type: string;
    };
    teamSize?: number; // applies to tech/non-tech only
    teamMembers?: { name: string; email: string; phone: string }[]; // members beyond personalInfo (Member 2..n)
}

const RegistrationPage: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState<FormData>({
        category: '',
        personalInfo: {
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            college: '',
            year: '',
            department: '',
            section: ''
        },
        selectedEvents: [],
        additionalInfo: {
            dietaryRequirements: '',
            accommodation: false,
            emergencyContact: '',
            emergencyPhone: ''
        },
        uploadedFile: undefined,
        teamSize: 1,
        teamMembers: []
    });
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);

    const totalSteps = 4;
    const progress = (currentStep / totalSteps) * 100;

    const nextStep = () => {
        if (currentStep < totalSteps) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const handleFileUpload = (file: File | null) => {
        setUploadedFile(file);
        if (file) {
            // Convert file to base64 for storage
            const reader = new FileReader();
            reader.onload = () => {
                const base64String = reader.result as string;
                updateFormData({
                    uploadedFile: {
                        name: file.name,
                        url: base64String,
                        size: file.size,
                        type: file.type
                    }
                });
            };
            reader.readAsDataURL(file);
        } else {
            updateFormData({ uploadedFile: undefined });
        }
    };

    const renderStep = () => {
        switch (currentStep) {
            case 1:
                return (
                    <CategorySelection
                        selectedCategory={formData.category}
                        onCategorySelect={(category: 'tech' | 'non-tech' | 'workshop') => updateFormData({ category })}
                    />
                );
            case 2:
                return (
                    <PersonalInfo
                        data={formData.personalInfo}
                        onUpdate={(personalInfo: {
                            firstName: string;
                            lastName: string;
                            email: string;
                            phone: string;
                            college: string;
                            year: string;
                            department: string;
                            section: string;
                        }) => updateFormData({ personalInfo })}
                        category={formData.category}
                        teamSize={formData.teamSize}
                        onTeamSizeChange={(size) => updateFormData({ teamSize: size })}
                        teamMembers={formData.teamMembers}
                        onTeamMembersChange={(members) => updateFormData({ teamMembers: members })}
                    />
                );
            case 3:
                return (
                    <EventSelection
                        category={formData.category}
                        selectedEvents={formData.selectedEvents}
                        onEventsChange={(selectedEvents: string[]) => updateFormData({ selectedEvents })}
                        onFileUpload={handleFileUpload}
                        uploadedFile={uploadedFile}
                    />
                );
            case 4:
                return (
                    <ReviewAndSubmit
                        formData={formData}
                        onUpdate={updateFormData}
                    />
                );
            default:
                return null;
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return formData.category !== '';
            case 2:
                return formData.personalInfo.firstName &&
                    formData.personalInfo.lastName &&
                    formData.personalInfo.email &&
                    formData.personalInfo.phone &&
                    formData.personalInfo.college &&
                    formData.personalInfo.year &&
                    formData.personalInfo.department;
            case 3:
                const hasEvents = formData.selectedEvents.length > 0;
                // For workshop events, file upload is mandatory
                const hasWorkshopEvents = formData.selectedEvents.some(eventId => 
                    ['frontend', 'pcb-assembling', 'eda-tools'].includes(eventId)
                );
                const hasFileUpload = formData.uploadedFile !== undefined;
                
                return hasEvents && (!hasWorkshopEvents || hasFileUpload);
            case 4:
                return true;
            default:
                return false;
        }
    };

    return (
        <RegistrationContainer>
            <RegistrationCard>
                <Title>Registration</Title>
                <Subtitle>Join ElectroBlitz 2025</Subtitle>

                <ProgressContainer>
                    <ProgressBar>
                        <ProgressFill progress={progress} />
                    </ProgressBar>
                    <ProgressText>
                        Step {currentStep} of {totalSteps}
                    </ProgressText>
                </ProgressContainer>

                <StepContainer>
                    {renderStep()}
                </StepContainer>

                <NavigationButtons>
                    <NavButton
                        variant="secondary"
                        onClick={prevStep}
                        disabled={currentStep === 1}
                    >
                        Previous
                    </NavButton>

                    {currentStep < totalSteps ? (
                        <NavButton
                            variant="primary"
                            onClick={nextStep}
                            disabled={!canProceed()}
                        >
                            Next
                        </NavButton>
                    ) : (
                        <NavButton
                            variant="primary"
                            disabled={!canProceed()}
                        >
                            Submit Registration
                        </NavButton>
                    )}
                </NavigationButtons>
            </RegistrationCard>
        </RegistrationContainer>
    );
};

export default RegistrationPage;
