import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { exportToExcel, exportToCSV, exportEventStatistics, exportCategoryToExcel } from '../utils/exportData';
import { FormData } from './RegistrationPage';
import { useRegistrations } from '../contexts/RegistrationContext';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
`;


const AdminContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const AdminContent = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff, #00d4ff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradientShift 3s ease infinite;

  @keyframes gradientShift {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #aaaaaa;
  margin-bottom: 2rem;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const StatCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 212, 255, 0.2);
  }
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 900;
  color: #00d4ff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1.1rem;
  color: #aaaaaa;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const ControlsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  margin-bottom: 3rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const ControlsTitle = styled.h2`
  font-size: 1.8rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ButtonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
`;

const ActionButton = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' }>`
  padding: 1rem 1.5rem;
  border: none;
  border-radius: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  ${props => {
        switch (props.variant) {
            case 'primary':
                return `
          background: linear-gradient(45deg, #00d4ff, #ff00ff);
          color: #ffffff;
        `;
            case 'secondary':
                return `
          background: rgba(255, 255, 255, 0.1);
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.2);
        `;
            case 'success':
                return `
          background: linear-gradient(45deg, #00ff88, #00d4ff);
          color: #ffffff;
        `;
            case 'warning':
                return `
          background: linear-gradient(45deg, #ffaa00, #ff6600);
          color: #ffffff;
        `;
            default:
                return `
          background: linear-gradient(45deg, #00d4ff, #ff00ff);
          color: #ffffff;
        `;
        }
    }}

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const TableContainer = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 2rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
  overflow-x: auto;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #ffffff;
`;

const TableHeader = styled.th`
  padding: 1rem;
  text-align: left;
  border-bottom: 2px solid #00d4ff;
  color: #00d4ff;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-size: 0.9rem;
`;

const TableCell = styled.td`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.9rem;
`;

const TableRow = styled.tr`
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }

  &::placeholder {
    color: #666666;
  }
`;

const LoadingSpinner = styled.div`
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #ffffff;
  animation: spin 1s ease-in-out infinite;
  margin-right: 0.5rem;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

const AdminDashboard: React.FC = () => {
    const { registrations, clearRegistrations } = useRegistrations();
    const [filteredRegistrations, setFilteredRegistrations] = useState<FormData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Update filtered registrations when registrations or search term changes
    useEffect(() => {
        const filtered = registrations.filter(reg =>
            reg.personalInfo.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.personalInfo.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.personalInfo.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            reg.personalInfo.college.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRegistrations(filtered);
    }, [searchTerm, registrations]);

    const handleExportExcel = () => {
        setIsLoading(true);
        setTimeout(() => {
            exportToExcel(registrations);
            setIsLoading(false);
        }, 1000);
    };

    const handleExportCSV = () => {
        setIsLoading(true);
        setTimeout(() => {
            exportToCSV(registrations);
            setIsLoading(false);
        }, 1000);
    };

    const handleExportEventStats = () => {
        setIsLoading(true);
        setTimeout(() => {
            // Mock event data
            const events = [
                { id: 'hackathon', title: '24-Hour Hackathon', category: 'tech', duration: '24 hours', difficulty: 'Advanced', prize: '₹50,000', participants: 150, fee: 'Free' },
                { id: 'coding-contest', title: 'Algorithm Coding Contest', category: 'tech', duration: '3 hours', difficulty: 'Intermediate', prize: '₹25,000', participants: 200, fee: 'Free' },
                { id: 'blockchain', title: 'Blockchain Workshop', category: 'workshop', duration: '6 hours', difficulty: 'Intermediate', prize: 'Certificate', participants: 75, fee: '₹500' }
            ];
            exportEventStatistics(events);
            setIsLoading(false);
        }, 1000);
    };

    const handleExportByCategory = (category: 'tech' | 'non-tech' | 'workshop') => {
        setIsLoading(true);
        setTimeout(() => {
            exportCategoryToExcel(registrations, category);
            setIsLoading(false);
        }, 500);
    };

    const stats = {
        totalRegistrations: registrations.length,
        techRegistrations: registrations.filter(r => r.category === 'tech').length,
        nonTechRegistrations: registrations.filter(r => r.category === 'non-tech').length,
        workshopRegistrations: registrations.filter(r => r.category === 'workshop').length
    };

    return (
        <AdminContainer>
            <AdminContent>
                <Header>
                    <Title>Admin Dashboard</Title>
                    <Subtitle>Manage ElectroBlitz Registrations</Subtitle>
                </Header>

                <StatsGrid>
                    <StatCard>
                        <StatNumber>{stats.totalRegistrations}</StatNumber>
                        <StatLabel>Total Registrations</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.techRegistrations}</StatNumber>
                        <StatLabel>Technical Events</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.nonTechRegistrations}</StatNumber>
                        <StatLabel>Non-Technical Events</StatLabel>
                    </StatCard>
                    <StatCard>
                        <StatNumber>{stats.workshopRegistrations}</StatNumber>
                        <StatLabel>Workshops</StatLabel>
                    </StatCard>
                </StatsGrid>

                <ControlsSection>
                    <ControlsTitle>Export Data</ControlsTitle>
                    <ButtonGrid>
                        <ActionButton
                            variant="success"
                            onClick={handleExportExcel}
                            disabled={isLoading}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export to Excel
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            onClick={handleExportCSV}
                            disabled={isLoading}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export to CSV
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            onClick={() => handleExportByCategory('tech')}
                            disabled={isLoading || registrations.filter(r => r.category === 'tech').length === 0}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export Technical Only
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            onClick={() => handleExportByCategory('non-tech')}
                            disabled={isLoading || registrations.filter(r => r.category === 'non-tech').length === 0}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export Non‑Technical Only
                        </ActionButton>
                        <ActionButton
                            variant="primary"
                            onClick={() => handleExportByCategory('workshop')}
                            disabled={isLoading || registrations.filter(r => r.category === 'workshop').length === 0}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export Workshops Only
                        </ActionButton>
                        <ActionButton
                            variant="warning"
                            onClick={handleExportEventStats}
                            disabled={isLoading}
                        >
                            {isLoading && <LoadingSpinner />}
                            Export Event Stats
                        </ActionButton>
                        <ActionButton
                            variant="secondary"
                            onClick={() => {
                                if (window.confirm('Are you sure you want to clear all registration data? This action cannot be undone.')) {
                                    clearRegistrations();
                                }
                            }}
                            disabled={registrations.length === 0}
                        >
                            Clear All Data
                        </ActionButton>
                    </ButtonGrid>
                </ControlsSection>

                <TableContainer>
                    <SearchInput
                        type="text"
                        placeholder="Search registrations..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />

                    <Table>
                        <thead>
                            <tr>
                                <TableHeader>Name</TableHeader>
                                <TableHeader>Email</TableHeader>
                                <TableHeader>College</TableHeader>
                                <TableHeader>Category</TableHeader>
                                <TableHeader>Events</TableHeader>
                                <TableHeader>Accommodation</TableHeader>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredRegistrations.map((registration, index) => (
                                <TableRow key={index}>
                                    <TableCell>
                                        {registration.personalInfo.firstName} {registration.personalInfo.lastName}
                                    </TableCell>
                                    <TableCell>{registration.personalInfo.email}</TableCell>
                                    <TableCell>{registration.personalInfo.college}</TableCell>
                                    <TableCell>{registration.category}</TableCell>
                                    <TableCell>{registration.selectedEvents.length} events</TableCell>
                                    <TableCell>{registration.additionalInfo.accommodation ? 'Yes' : 'No'}</TableCell>
                                </TableRow>
                            ))}
                        </tbody>
                    </Table>
                </TableContainer>
            </AdminContent>
        </AdminContainer>
    );
};

export default AdminDashboard;
