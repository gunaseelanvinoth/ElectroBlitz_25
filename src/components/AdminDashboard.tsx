import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { exportToExcel, exportToCSV, exportEventStatistics, exportCategoryToExcel } from '../utils/exportData';
import { FormData } from './RegistrationPage';
import { supabase } from '../utils/supabase';
import SupabaseTest from './SupabaseTest';

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

const LoginContainer = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const LoginCard = styled.div`
  width: 100%;
  max-width: 420px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 2rem;
  color: #fff;
  box-shadow: 0 10px 30px rgba(0,0,0,0.35);
  animation: ${fadeInUp} 0.6s ease-out;
`;

const LoginTitle = styled.h2`
  margin: 0 0 0.5rem 0;
  font-size: 1.6rem;
  font-weight: 800;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const LoginSubtitle = styled.p`
  margin: 0 0 1.25rem 0;
  color: #aaaaaa;
`;

const LoginInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 2px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.05);
  color: #ffffff;
  font-size: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  &:focus {
    outline: none;
    border-color: #00d4ff;
    box-shadow: 0 0 0 3px rgba(0, 212, 255, 0.1);
  }
`;

const LoginButton = styled.button`
  width: 100%;
  padding: 0.8rem 1rem;
  border-radius: 10px;
  border: none;
  font-weight: 700;
  cursor: pointer;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #fff;
`;

const LoginError = styled.div`
  color: #ff6b6b;
  font-size: 0.9rem;
  margin-bottom: 0.75rem;
`;


// Interface for the optimized query result (with only selected columns)
interface OptimizedRegistration {
    id: string;
    created_at: string;
    category: string;
    first_name: string;
    last_name: string;
    email: string;
    college: string;
    academic_year: string;
    department: string;
    section: string;
    selected_events: string[];
    accommodation_required: boolean;
    uploaded_file_name: string | null;
    uploaded_file_url: string | null;
    uploaded_file_size: number | null;
    uploaded_file_type: string | null;
    team_size: number | null;
    team_members: any | null;
    status: string;
}

const AdminDashboard: React.FC = () => {
  const [isAuthed, setIsAuthed] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');
    const [registrations, setRegistrations] = useState<FormData[]>([]);
    const [filteredRegistrations, setFilteredRegistrations] = useState<FormData[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const itemsPerPage = 50;
    const [pageSize, setPageSize] = useState(100); // for manual load more
    const [categoryCounts, setCategoryCounts] = useState<{ tech: number; nonTech: number; workshop: number }>({ tech: 0, nonTech: 0, workshop: 0 });

  useEffect(() => {
    const authed = typeof window !== 'undefined' && sessionStorage.getItem('eb_admin_authed') === 'true';
    if (authed) setIsAuthed(true);
  }, []);

  const getExpectedPassword = () => {
    const envPass = process.env.REACT_APP_ADMIN_PASSWORD;
    return envPass && envPass.length > 0 ? envPass : 'ECE@SCT';
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    if (password === getExpectedPassword()) {
      setIsAuthed(true);
      sessionStorage.setItem('eb_admin_authed', 'true');
    } else {
      setAuthError('Incorrect password');
    }
  };

  const handleLogout = () => {
    setIsAuthed(false);
    sessionStorage.removeItem('eb_admin_authed');
  };

    const downloadFile = (fileData: { name: string; url: string; type: string }) => {
        const link = document.createElement('a');
        link.href = fileData.url;
        link.download = fileData.name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Helper: fetch registrations in safe batches to avoid timeouts
    const fetchRegistrationsPaged = async () => {
        try {
            setIsFetching(true);
            console.log('Fetching registrations (paged)...');
            // Clear search so filtering doesn't hide results during refresh
            setSearchTerm('');

            // cheaper count to avoid heavy exact counts
            const { count } = await supabase
                .from('registrations')
                .select('id', { count: 'estimated', head: true });
            setTotalCount(count || 0);

            // also fetch category breakdown (compatible with older supabase-js: no group())
            try {
                const [techRes, nonTechRes, workshopRes] = await Promise.all([
                    supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('category', 'tech'),
                    supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('category', 'non-tech'),
                    supabase.from('registrations').select('id', { count: 'exact', head: true }).eq('category', 'workshop')
                ]);
                setCategoryCounts({
                    tech: techRes.count || 0,
                    nonTech: nonTechRes.count || 0,
                    workshop: workshopRes.count || 0
                });
            } catch (e) {
                console.warn('Category counts fetch skipped:', e);
            }

            let pageSize = 150;            // initial batch size
            const minPageSize = 10;        // do not go below
            const hardCap = 20000;         // absolute safety cap
            const merged: OptimizedRegistration[] = [];
            let from = 0;

            // Progressive load with backoff on timeout; keep merged data
            while (from < hardCap) {
                const to = Math.min(from + pageSize - 1, hardCap - 1);
                const { data, error } = await supabase
                    .from('registrations')
                    .select('id, created_at, category, first_name, last_name, email, college, academic_year, department, section, selected_events, accommodation_required, uploaded_file_name, uploaded_file_url, uploaded_file_size, uploaded_file_type, team_size, team_members, status')
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) {
                    const msg = error.message || '';
                    console.warn('Fetch batch error:', msg, 'from=', from, 'to=', to, 'pageSize=', pageSize);
                    if ((msg.includes('statement timeout') || msg.includes('canceling statement')) && pageSize > minPageSize) {
                        pageSize = Math.max(minPageSize, Math.floor(pageSize / 2));
                        // retry same range with smaller pageSize next loop
                        continue;
                    }
                    // non-timeout or min size reached: stop further loading but keep any merged data
                    break;
                }

                if (!data || data.length === 0) break;
                merged.push(...(data as any));
                if (data.length < pageSize) break; // no more rows
                from += pageSize;
            }

            console.log(`Fetched ${merged.length} registrations (merged)`);

            const convertedRegistrations: FormData[] = merged.map((reg: OptimizedRegistration) => ({
                id: reg.id,
                registrationDate: reg.created_at,
                category: reg.category as 'tech' | 'non-tech' | 'workshop',
                personalInfo: {
                    firstName: reg.first_name,
                    lastName: reg.last_name,
                    email: reg.email,
                    phone: '',
                    college: reg.college,
                    year: reg.academic_year,
                    department: reg.department,
                    section: reg.section
                },
                selectedEvents: reg.selected_events,
                additionalInfo: {
                    dietaryRequirements: '',
                    accommodation: reg.accommodation_required,
                    emergencyContact: '',
                    emergencyPhone: ''
                },
                uploadedFile: reg.uploaded_file_name ? {
                    name: reg.uploaded_file_name || '',
                    url: reg.uploaded_file_url || '',
                    size: reg.uploaded_file_size || 0,
                    type: reg.uploaded_file_type || ''
                } : undefined,
                teamSize: reg.team_size || undefined,
                teamMembers: Array.isArray(reg.team_members) ? reg.team_members : undefined
            }));

            if (convertedRegistrations.length > 0) {
                setRegistrations(convertedRegistrations);
            } else {
                console.warn('No registrations loaded; preserving previous list to avoid empty UI.');
            }
        } catch (error) {
            console.error('Error fetching registrations:', error);
        } finally {
            setIsFetching(false);
        }
    };

    // Helper used by exports: fetch all rows reliably in batches, independent of UI list
    const fetchAllForExport = async (): Promise<FormData[]> => {
        let size = 200;
        const minSize = 25;
        const maxTotal = 50000;
        const merged: OptimizedRegistration[] = [];
        let from = 0;

        while (from < maxTotal) {
            const to = from + size - 1;
            const { data, error } = await supabase
                .from('registrations')
                .select('id, created_at, category, first_name, last_name, email, college, academic_year, department, section, selected_events, accommodation_required, uploaded_file_name, uploaded_file_url, uploaded_file_size, uploaded_file_type, team_size, team_members, status')
                .order('created_at', { ascending: false })
                .range(from, to);

            if (error) {
                const msg = error.message || '';
                if ((msg.includes('statement timeout') || msg.includes('canceling statement')) && size > minSize) {
                    size = Math.max(minSize, Math.floor(size / 2));
                    continue; // retry same offset with smaller size
                }
                break; // other error, stop
            }

            if (!data || data.length === 0) break;
            merged.push(...(data as any));
            if (data.length < size) break;
            from += size;
        }

        return (merged as any).map((reg: OptimizedRegistration) => ({
            id: reg.id,
            registrationDate: reg.created_at,
            category: reg.category as 'tech' | 'non-tech' | 'workshop',
            personalInfo: {
                firstName: reg.first_name,
                lastName: reg.last_name,
                email: reg.email,
                phone: '',
                college: reg.college,
                year: reg.academic_year,
                department: reg.department,
                section: reg.section
            },
            selectedEvents: reg.selected_events,
            additionalInfo: {
                dietaryRequirements: '',
                accommodation: reg.accommodation_required,
                emergencyContact: '',
                emergencyPhone: ''
            },
            uploadedFile: reg.uploaded_file_name ? {
                name: reg.uploaded_file_name || '',
                url: reg.uploaded_file_url || '',
                size: reg.uploaded_file_size || 0,
                type: reg.uploaded_file_type || ''
            } : undefined,
            teamSize: reg.team_size || undefined,
            teamMembers: Array.isArray(reg.team_members) ? reg.team_members : undefined
        }));
    };

    // Load more: append one batch starting from current length
    const loadMoreRegistrations = async () => {
        if (isFetching) return;
        try {
            setIsFetching(true);
            const from = registrations.length;
            let size = pageSize;
            const minSize = 10;

            for (;;) {
                const to = from + size - 1;
                const { data, error } = await supabase
                    .from('registrations')
                    .select('id, created_at, category, first_name, last_name, email, college, academic_year, department, section, selected_events, accommodation_required, uploaded_file_name, uploaded_file_url, uploaded_file_size, uploaded_file_type, team_size, team_members, status')
                    .order('created_at', { ascending: false })
                    .range(from, to);

                if (error) {
                    const msg = error.message || '';
                    console.warn('Load more error:', msg, 'from=', from, 'to=', to, 'size=', size);
                    if ((msg.includes('statement timeout') || msg.includes('canceling statement')) && size > minSize) {
                        size = Math.max(minSize, Math.floor(size / 2));
                        setPageSize(size);
                        continue; // retry same range smaller
                    }
                    break;
                }

                if (!data || data.length === 0) break;

                const appended: FormData[] = (data as any).map((reg: OptimizedRegistration) => ({
                    id: reg.id,
                    registrationDate: reg.created_at,
                    category: reg.category as 'tech' | 'non-tech' | 'workshop',
                    personalInfo: {
                        firstName: reg.first_name,
                        lastName: reg.last_name,
                        email: reg.email,
                        phone: '',
                        college: reg.college,
                        year: reg.academic_year,
                        department: reg.department,
                        section: reg.section
                    },
                    selectedEvents: reg.selected_events,
                    additionalInfo: {
                        dietaryRequirements: '',
                        accommodation: reg.accommodation_required,
                        emergencyContact: '',
                        emergencyPhone: ''
                    },
                    uploadedFile: reg.uploaded_file_name ? {
                        name: reg.uploaded_file_name || '',
                        url: reg.uploaded_file_url || '',
                        size: reg.uploaded_file_size || 0,
                        type: reg.uploaded_file_type || ''
                    } : undefined,
                    teamSize: reg.team_size || undefined,
                    teamMembers: Array.isArray(reg.team_members) ? reg.team_members : undefined
                }));

                setRegistrations(prev => [...prev, ...appended]);
                if ((data as any).length < size) break; // no more
                break; // load only one batch per click
            }
        } catch (e) {
            console.error('Load more failed:', e);
        } finally {
            setIsFetching(false);
        }
    };

    // Fetch registrations on mount
    useEffect(() => {
        fetchRegistrationsPaged();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        exportToExcel(registrations);
        setIsLoading(false);
    };

    const handleExportCSV = () => {
        setIsLoading(true);
        exportToCSV(registrations);
        setIsLoading(false);
    };

    const handleExportEventStats = () => {
        setIsLoading(true);
        // Mock event data
        const events = [
            { id: 'hackathon', title: '24-Hour Hackathon', category: 'tech', duration: '24 hours', difficulty: 'Advanced', prize: '₹50,000', participants: 150, fee: 'Free' },
            { id: 'coding-contest', title: 'Algorithm Coding Contest', category: 'tech', duration: '3 hours', difficulty: 'Intermediate', prize: '₹25,000', participants: 200, fee: 'Free' },
            { id: 'blockchain', title: 'Blockchain Workshop', category: 'workshop', duration: '6 hours', difficulty: 'Intermediate', prize: 'Certificate', participants: 75, fee: '₹500' }
        ];
        exportEventStatistics(events);
        setIsLoading(false);
    };

    const handleExportByCategory = (category: 'tech' | 'non-tech' | 'workshop') => {
        setIsLoading(true);
        exportCategoryToExcel(registrations, category);
        setIsLoading(false);
    };

  const stats = {
        totalRegistrations: totalCount, // Use total count from database
        techRegistrations: registrations.filter(r => r.category === 'tech').length,
        nonTechRegistrations: registrations.filter(r => r.category === 'non-tech').length,
        workshopRegistrations: registrations.filter(r => r.category === 'workshop').length
    };

  if (!isAuthed) {
    return (
      <LoginContainer>
        <LoginCard>
          <LoginTitle>Admin Access</LoginTitle>
          <LoginSubtitle>Enter the admin password to continue</LoginSubtitle>
          {authError && <LoginError>{authError}</LoginError>}
          <form onSubmit={handleLogin}>
            <LoginInput
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <LoginButton type="submit">Enter Dashboard</LoginButton>
          </form>
        </LoginCard>
      </LoginContainer>
    );
  }

  return (
        <AdminContainer>
            <AdminContent>
                <Header>
                    <Title>Admin Dashboard</Title>
                    <Subtitle>Manage ElectroBlitz Registrations</Subtitle>
                </Header>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <SupabaseTest />
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button 
              onClick={() => { fetchRegistrationsPaged(); }} 
              style={{ 
                background: 'linear-gradient(45deg, #00d4ff, #ff00ff)', 
                color: '#ffffff', 
                border: 'none', 
                padding: '0.5rem 1rem', 
                borderRadius: 8, 
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🔄 Refresh Data
            </button>
            <button onClick={handleLogout} style={{ background: 'transparent', color: '#aaaaaa', border: '1px solid rgba(255,255,255,0.2)', padding: '0.5rem 0.9rem', borderRadius: 8, cursor: 'pointer' }}>Logout</button>
          </div>
        </div>

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
                            onClick={loadMoreRegistrations}
                            disabled={isFetching}
                        >
                            {isFetching && <LoadingSpinner />}
                            Load more (+{pageSize})
                        </ActionButton>
                        <ActionButton
                            variant="secondary"
                            onClick={async () => {
                                if (window.confirm('Are you sure you want to clear all registration data? This action cannot be undone.')) {
                                    try {
                                        setIsLoading(true);
                                        const { error } = await supabase
                                            .from('registrations')
                                            .delete()
                                            .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all records
                                        
                                        if (error) {
                                            console.error('Error clearing registrations:', error);
                                            alert('Failed to clear registrations. Please try again.');
                                        } else {
                                            setRegistrations([]);
                                            setFilteredRegistrations([]);
                                            alert('All registrations have been cleared successfully.');
                                        }
                                    } catch (error) {
                                        console.error('Error clearing registrations:', error);
                                        alert('Failed to clear registrations. Please try again.');
                                    } finally {
                                        setIsLoading(false);
                                    }
                                }
                            }}
                            disabled={registrations.length === 0 || isLoading}
                        >
                            {isLoading && <LoadingSpinner />}
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

                    {isFetching ? (
                        <div style={{ textAlign: 'center', padding: '2rem', color: '#aaaaaa' }}>
                            <LoadingSpinner />
                            <div style={{ marginTop: '1rem' }}>Loading registrations from database...</div>
                            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666666' }}>
                                Found {registrations.length} registrations so far...
                            </div>
                        </div>
                    ) : (
                        <Table>
                            <thead>
                                <tr>
                                    <TableHeader>Name</TableHeader>
                                    <TableHeader>Email</TableHeader>
                                    <TableHeader>College</TableHeader>
                                    <TableHeader>Section</TableHeader>
                                    <TableHeader>Category</TableHeader>
                                    <TableHeader>Events</TableHeader>
                                    <TableHeader>Team</TableHeader>
                                    <TableHeader>File</TableHeader>
                                    <TableHeader>Accommodation</TableHeader>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRegistrations.length === 0 ? (
                                    <tr>
                                        <TableCell colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: '#aaaaaa' }}>
                                            {searchTerm ? 'No registrations found matching your search.' : 'No registrations found.'}
                                        </TableCell>
                                    </tr>
                                ) : (
                                    filteredRegistrations.map((registration, index) => (
                                        <TableRow key={registration.id || index}>
                                            <TableCell>
                                                {registration.personalInfo.firstName} {registration.personalInfo.lastName}
                                            </TableCell>
                                            <TableCell>{registration.personalInfo.email}</TableCell>
                                            <TableCell>{registration.personalInfo.college}</TableCell>
                                            <TableCell>{registration.personalInfo.section}</TableCell>
                                            <TableCell>{registration.category}</TableCell>
                                            <TableCell>
                                                {(registration.category === 'tech' || registration.category === 'non-tech') ? (
                                                    <div style={{ color: '#e8e8e8', fontSize: '0.9rem' }}>
                                                        Size: {registration.teamSize || 1}
                                                        {!!(registration.teamMembers && registration.teamMembers.length) && (
                                                            <div style={{ color: '#aaaaaa', marginTop: '0.25rem' }}>
                                                                {registration.teamMembers.map((m, i) => (
                                                                    <div key={i}>M{ i + 2 }: {m.name || '-'} ({m.email || '-'})</div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <span>-</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{registration.selectedEvents.length} events</TableCell>
                                            <TableCell>
                                                {registration.uploadedFile ? (
                                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                                        <div style={{ color: '#00ff88', fontSize: '0.9rem', fontWeight: '600' }}>
                                                            {registration.uploadedFile.name}
                                                        </div>
                                                        <div style={{ color: '#aaaaaa', fontSize: '0.8rem' }}>
                                                            {formatFileSize(registration.uploadedFile.size)}
                                                        </div>
                                                        <button
                                                            onClick={() => downloadFile(registration.uploadedFile!)}
                                                            style={{
                                                                background: 'linear-gradient(45deg, #00d4ff, #ff00ff)',
                                                                color: '#ffffff',
                                                                border: 'none',
                                                                padding: '0.25rem 0.5rem',
                                                                borderRadius: '4px',
                                                                cursor: 'pointer',
                                                                fontSize: '0.8rem',
                                                                fontWeight: '600'
                                                            }}
                                                        >
                                                            Download
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <span style={{ color: '#666666' }}>No file</span>
                                                )}
                                            </TableCell>
                                            <TableCell>{registration.additionalInfo.accommodation ? 'Yes' : 'No'}</TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </TableContainer>
            </AdminContent>
        </AdminContainer>
    );
};

export default AdminDashboard;
