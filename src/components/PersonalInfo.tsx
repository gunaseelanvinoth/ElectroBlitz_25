import React from 'react';
import styled, { keyframes, css } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;

const shake = keyframes`
  0%, 100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-5px);
  }
  75% {
    transform: translateX(5px);
  }
`;

const FormContainer = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
  color: #ffffff;
  text-align: center;
`;

const Description = styled.p`
  color: #aaaaaa;
  margin-bottom: 2rem;
  text-align: center;
  font-size: 1.1rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 1.5rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div<{ fullWidth?: boolean }>`
  ${props => props.fullWidth && 'grid-column: 1 / -1;'}
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  color: #cccccc;
  font-weight: 500;
  font-size: 0.9rem;
`;

const Input = styled.input<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.hasError ? '#ff4444' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  animation: ${fadeInUp} 0.6s ease-out;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #666666;
  }

  ${props => props.hasError && css`
    animation: ${shake} 0.5s ease-in-out;
  `}
`;

const Select = styled.select<{ hasError?: boolean }>`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid ${props => props.hasError ? '#ff4444' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;
  animation: ${fadeInUp} 0.6s ease-out;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  option {
    background: #1a1a2e;
    color: #ffffff;
  }

  ${props => props.hasError && css`
    animation: ${shake} 0.5s ease-in-out;
  `}
`;

const ErrorMessage = styled.div`
  color: #ff4444;
  font-size: 0.8rem;
  margin-top: 0.25rem;
  animation: ${fadeInUp} 0.3s ease-out;
`;

const FullWidthGroup = styled(FormGroup)`
  grid-column: 1 / -1;
`;

interface PersonalInfoData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    college: string;
    year: string;
    department: string;
}

interface PersonalInfoProps {
    data: PersonalInfoData;
    onUpdate: (data: PersonalInfoData) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onUpdate }) => {
    const [errors, setErrors] = React.useState<Partial<PersonalInfoData>>({});

    const validateField = (name: keyof PersonalInfoData, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!value.trim()) {
                    newErrors[name] = 'This field is required';
                } else if (value.trim().length < 2) {
                    newErrors[name] = 'Must be at least 2 characters';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value.trim()) {
                    newErrors[name] = 'Email is required';
                } else if (!emailRegex.test(value)) {
                    newErrors[name] = 'Please enter a valid email';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'phone':
                const phoneRegex = /^[0-9]{10}$/;
                if (!value.trim()) {
                    newErrors[name] = 'Phone number is required';
                } else if (!phoneRegex.test(value.replace(/\D/g, ''))) {
                    newErrors[name] = 'Please enter a valid 10-digit phone number';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'college':
            case 'year':
            case 'department':
                if (!value.trim()) {
                    newErrors[name] = 'This field is required';
                } else {
                    delete newErrors[name];
                }
                break;
        }

        setErrors(newErrors);
    };

    const handleChange = (name: keyof PersonalInfoData, value: string) => {
        const newData = { ...data, [name]: value };
        onUpdate(newData);
        validateField(name, value);
    };

    const yearOptions = [
        '1st Year',
        '2nd Year',
        '3rd Year',
        '4th Year',
        // '5th Year (Dual Degree)',
        // 'Post Graduate',
        // 'Other'
    ];

    const departmentOptions = [
        'ECE',
        'EXE',
        'EVD'
    ];

    return (
        <FormContainer>
            <Title>Personal Information</Title>
            <Description>
                Please provide your personal details for registration
            </Description>

            <FormGrid>
                <FormGroup>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input
                        id="firstName"
                        type="text"
                        value={data.firstName}
                        onChange={(e) => handleChange('firstName', e.target.value)}
                        placeholder="Enter your first name"
                        hasError={!!errors.firstName}
                    />
                    {errors.firstName && <ErrorMessage>{errors.firstName}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                        id="lastName"
                        type="text"
                        value={data.lastName}
                        onChange={(e) => handleChange('lastName', e.target.value)}
                        placeholder="Enter your last name"
                        hasError={!!errors.lastName}
                    />
                    {errors.lastName && <ErrorMessage>{errors.lastName}</ErrorMessage>}
                </FormGroup>

                <FullWidthGroup>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => handleChange('email', e.target.value)}
                        placeholder="Enter your email address"
                        hasError={!!errors.email}
                    />
                    {errors.email && <ErrorMessage>{errors.email}</ErrorMessage>}
                </FullWidthGroup>

                <FormGroup>
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                        id="phone"
                        type="tel"
                        value={data.phone}
                        onChange={(e) => handleChange('phone', e.target.value)}
                        placeholder="10-digit phone number"
                        hasError={!!errors.phone}
                    />
                    {errors.phone && <ErrorMessage>{errors.phone}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="college">College/University *</Label>
                    <Input
                        id="college"
                        type="text"
                        value={data.college}
                        onChange={(e) => handleChange('college', e.target.value)}
                        placeholder="Enter your college name"
                        hasError={!!errors.college}
                    />
                    {errors.college && <ErrorMessage>{errors.college}</ErrorMessage>}
                </FormGroup>

                <FormGroup>
                    <Label htmlFor="year">Academic Year *</Label>
                    <Select
                        id="year"
                        value={data.year}
                        onChange={(e) => handleChange('year', e.target.value)}
                        hasError={!!errors.year}
                    >
                        <option value="">Select your year</option>
                        {yearOptions.map((year) => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </Select>
                    {errors.year && <ErrorMessage>{errors.year}</ErrorMessage>}
                </FormGroup>

                <FullWidthGroup>
                    <Label htmlFor="department">Department *</Label>
                    <Select
                        id="department"
                        value={data.department}
                        onChange={(e) => handleChange('department', e.target.value)}
                        hasError={!!errors.department}
                    >
                        <option value="">Select your department</option>
                        {departmentOptions.map((dept) => (
                            <option key={dept} value={dept}>{dept}</option>
                        ))}
                    </Select>
                    {errors.department && <ErrorMessage>{errors.department}</ErrorMessage>}
                </FullWidthGroup>
            </FormGrid>
        </FormContainer>
    );
};

export default PersonalInfo;

