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
    section: string;
}

interface PersonalInfoProps {
    data: PersonalInfoData;
    onUpdate: (data: PersonalInfoData) => void;
    category?: 'tech' | 'non-tech' | 'workshop' | '';
    teamSize?: number;
    onTeamSizeChange?: (size: number) => void;
    teamMembers?: { name: string; email: string; phone: string }[];
    onTeamMembersChange?: (members: { name: string; email: string; phone: string }[]) => void;
}

const PersonalInfo: React.FC<PersonalInfoProps> = ({ data, onUpdate, category = '', teamSize = 1, onTeamSizeChange, teamMembers = [], onTeamMembersChange }) => {
    const [errors, setErrors] = React.useState<Partial<PersonalInfoData>>({});

    const validateField = (name: keyof PersonalInfoData, value: string) => {
        const newErrors = { ...errors };

        switch (name) {
            case 'firstName':
                if (!value.trim()) {
                    newErrors[name] = 'This field is required';
                } else if (value.trim().length < 2) {
                    newErrors[name] = 'Must be at least 2 characters';
                } else {
                    delete newErrors[name];
                }
                break;

            case 'lastName':
                if (!value.trim()) {
                    newErrors[name] = 'This field is required';
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
            case 'section':
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

    const renderTeamControls = () => {
        const isTeamCategory = category === 'tech' || category === 'non-tech';
        if (!isTeamCategory) return null;

        const clampedSize = Math.max(1, Math.min(4, teamSize));
        const handleSizeChange = (value: number) => {
            const size = Math.max(1, Math.min(4, value));
            onTeamSizeChange && onTeamSizeChange(size);
            if (onTeamMembersChange) {
                const needed = Math.max(0, size - 1);
                const next = [...teamMembers];
                next.length = needed;
                for (let i = 0; i < needed; i++) {
                    next[i] = next[i] || { name: '', email: '', phone: '' };
                }
                onTeamMembersChange(next);
            }
        };

        const handleMemberChange = (idx: number, field: 'name'|'email'|'phone', value: string) => {
            if (!onTeamMembersChange) return;
            const next = [...teamMembers];
            next[idx] = { ...(next[idx] || { name: '', email: '', phone: '' }), [field]: value };
            onTeamMembersChange(next);
        };

        return (
            <>
                <FullWidthGroup>
                    <Label>Team Size (1–4)</Label>
                    <Select
                        value={clampedSize}
                        onChange={(e) => handleSizeChange(Number(e.target.value))}
                    >
                        <option value={1}>1</option>
                        <option value={2}>2</option>
                        <option value={3}>3</option>
                        <option value={4}>4</option>
                    </Select>
                </FullWidthGroup>

                {Array.from({ length: Math.max(0, clampedSize - 1) }).map((_, i) => (
                    <>
                        <FullWidthGroup key={`member-${i}`}>
                            <Label>Member {i + 2} Name</Label>
                            <Input
                                type="text"
                                value={teamMembers[i]?.name || ''}
                                onChange={(e) => handleMemberChange(i, 'name', e.target.value)}
                                placeholder={`Member ${i + 2} full name`}
                            />
                        </FullWidthGroup>
                        <FormGroup>
                            <Label>Member {i + 2} Email</Label>
                            <Input
                                type="email"
                                value={teamMembers[i]?.email || ''}
                                onChange={(e) => handleMemberChange(i, 'email', e.target.value)}
                                placeholder="email@example.com"
                            />
                        </FormGroup>
                        <FormGroup>
                            <Label>Member {i + 2} Phone</Label>
                            <Input
                                type="tel"
                                value={teamMembers[i]?.phone || ''}
                                onChange={(e) => handleMemberChange(i, 'phone', e.target.value)}
                                placeholder="10-digit phone"
                            />
                        </FormGroup>
                    </>
                ))}
            </>
        );
    };

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

                <FullWidthGroup>
                    <Label htmlFor="section">Section *</Label>
                    <Select
                        id="section"
                        value={data.section}
                        onChange={(e) => handleChange('section', e.target.value)}
                        hasError={!!errors.section}
                    >
                        <option value="">Select your section</option>
                        <option value="A">Section A</option>
                        <option value="B">Section B</option>
                        <option value="C">Section C</option>
                        <option value="D">Section D</option>
                    </Select>
                    {errors.section && <ErrorMessage>{errors.section}</ErrorMessage>}
                </FullWidthGroup>
            </FormGrid>

            {renderTeamControls()}
        </FormContainer>
    );
};

export default PersonalInfo;

