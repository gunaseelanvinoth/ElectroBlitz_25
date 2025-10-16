import React, { useState } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { Link } from 'react-router-dom';

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
`;

const EventsContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const EventsContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  text-align: center;
  margin-bottom: 4rem;
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

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.3rem;
  color: #aaaaaa;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 0.8s ease-out 0.2s both;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #cccccc;
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const FilterTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
  flex-wrap: wrap;
  animation: ${fadeInUp} 0.8s ease-out 0.6s both;
`;

const FilterTab = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 1.5rem;
  border: 2px solid ${props => props.isActive ? '#00d4ff' : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 25px;
  background: ${props => props.isActive
        ? 'linear-gradient(45deg, #00d4ff, #ff00ff)'
        : 'transparent'};
  color: ${props => props.isActive ? '#ffffff' : '#cccccc'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    border-color: #00d4ff;
    color: #ffffff;
    transform: translateY(-2px);
  }

  ${props => props.isActive && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const EventCard = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.8s ease-out;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 212, 255, 0.2);
    border-color: #00d4ff;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
`;

const EventTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  flex: 1;
`;

const EventIcon = styled.div`
  font-size: 2rem;
  opacity: 0.8;
  margin-left: 1rem;
`;

const EventDescription = styled.p`
  color: #cccccc;
  font-size: 1rem;
  line-height: 1.6;
  margin-bottom: 1.5rem;
`;

// const EventDetails = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   margin-bottom: 1.5rem;
//   flex-wrap: wrap;
//   gap: 0.5rem;
// `;

// const EventDetail = styled.div<{ type: 'duration' | 'difficulty' | 'prize' }>`
//   padding: 0.5rem 1rem;
//   border-radius: 15px;
//   font-size: 0.9rem;
//   font-weight: 600;
//   background: ${props => {
//         switch (props.type) {
//             case 'duration': return 'rgba(0, 212, 255, 0.2)';
//             case 'difficulty': return 'rgba(255, 0, 255, 0.2)';
//             case 'prize': return 'rgba(255, 170, 0, 0.2)';
//             default: return 'rgba(255, 255, 255, 0.1)';
//         }
//     }};
//   color: ${props => {
//         switch (props.type) {
//             case 'duration': return '#00d4ff';
//             case 'difficulty': return '#ff00ff';
//             case 'prize': return '#ffaa00';
//             default: return '#ffffff';
//         }
//     }};
// `;

const EventRules = styled.div`
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1.5rem;
`;

const RulesTitle = styled.h4`
  color: #00d4ff;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const RulesList = styled.ul`
  color: #aaaaaa;
  font-size: 0.9rem;
  line-height: 1.5;
  margin: 0;
  padding-left: 1rem;
`;

const RegisterButton = styled(Link)`
  width: 100%;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  text-align: center;
  border-radius: 25px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  margin-top: 4rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 3rem;
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

interface Event {
    id: string;
    title: string;
    description: string;
    // duration: string;
    // difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
    // prize: string;
    icon: string;
    category: 'tech' | 'non-tech' | 'workshop';
    rules: string[];
}

const EventsPage: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'all' | 'tech' | 'non-tech' | 'workshop'>(() => {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'tech' || hash === 'non-tech' || hash === 'workshop') return hash as any;
        return 'all';
    });

    // Update filter when hash changes to support navigation anchors
    React.useEffect(() => {
        const onHashChange = () => {
            const hash = window.location.hash.replace('#', '');
            if (hash === 'tech' || hash === 'non-tech' || hash === 'workshop' || hash === 'all') {
                setActiveFilter(hash as any);
            }
        };
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, []);

    const events: Event[] = [
        // Technical Events
        {
            id: 'idea-presentation',
            title: 'Idea Presentation',
            description: 'Present innovative ideas. Venue: Microprocessor Lab. Team of 2 members.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: '—',
            icon: '💡',
            category: 'tech',
            rules: [
                'Venue: Microprocessor Lab',
                'Team size: 2 members'
            ]
        },
        {
            id: 'tech-debate',
            title: 'Tech Debate',
            description: 'Debate current tech topics. Venue: Communication Lab.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: '—',
            icon: '🗣️',
            category: 'tech',
            rules: [
                'Venue: Communication Lab'
            ]
        },
        {
            id: 'circuit-debugging',
            title: 'Circuit Debugging',
            description: 'Find and fix circuit issues. Venues: Hall No 915, Electronics Lab. Team of 2.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: '—',
            icon: '🔧',
            category: 'tech',
            rules: [
                'Venues: Hall No 915 and Electronics Lab',
                'Team size: 2 members'
            ]
        },
        {
            id: 'code-debugging',
            title: 'Code Debugging',
            description: 'Debug code efficiently. Venues: Hall No 914, DSP Lab.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: '—',
            icon: '🐞',
            category: 'tech',
            rules: [
                'Venues: Hall No 914 and DSP Lab'
            ]
        },
        {
            id: 'electrathon',
            title: 'Electrathon',
            description: 'Team challenge in electronics. Venue: Project Corridor. Team of 3-4.',
            // duration: '—',
            // difficulty: 'Advanced',
            // prize: '—',
            icon: '⚡',
            category: 'tech',
            rules: [
                'Venue: Project Corridor',
                'Team size: 3 to 4 members'
            ]
        },

        // Non-Technical Events
        {
            id: 'dugout-deals',
            title: 'The Dugout Deals',
            description: 'Fun team event. Venue: 916 or APJ Hall. Team of 3-4.',
            // duration: '—',
            // difficulty: 'Beginner',
            // prize: '—',
            icon: '🤝',
            category: 'non-tech',
            rules: [
                'Venue: 916 or APJ Hall',
                'Team size: 3 to 4 members'
            ]
        },
        {
            id: 'connections',
            title: 'Connections',
            description: 'Classic connections game. Venues: Hall No 922 and 923. Team of 2.',
            // duration: '—',
            // difficulty: 'Beginner',
            // prize: '—',
            icon: '🔗',
            category: 'non-tech',
            rules: [
                'Venues: Hall No 922 and 923',
                'Team size: 2 members'
            ]
        },
        {
            id: 'case-study',
            title: 'Case Study',
            description: 'Analyze and present solutions. Venues: Hall No 925 and 923. Team of 2.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: '—',
            icon: '📊',
            category: 'non-tech',
            rules: [
                'Venues: Hall No 925 and 923',
                'Team size: 2 members'
            ]
        },

        // Workshops
        {
            id: 'frontend',
            title: 'Frontend',
            description: 'Hands-on frontend session. Venue: VLSI Lab.',
            // duration: '—',
            // difficulty: 'Beginner',
            // prize: 'Certificate',
            icon: '🎨',
            category: 'workshop',
            rules: [
                'Venue: VLSI Lab'
            ]
        },
       /* {
            id: 'pcb-assembling',
            title: 'PCB Assembling',
            description: 'Assemble and learn PCB basics. Venue: Microwave Lab.',
            // duration: '—',
            // difficulty: 'Beginner',
            // prize: 'Certificate',
            icon: '🛠️',
            category: 'workshop',
            rules: [
                'Venue: Microwave Lab'
            ]
        },*/
        /*{
            //id: 'eda-tools',
           // title: 'EDA Tools',
           // description: 'Explore EDA tools. //Venue: 3rd Floor Lab.',
            // duration: '—',
            // difficulty: 'Intermediate',
            // prize: 'Certificate',
            icon: '🧩',
            //category: 'workshop',
           // rules: [
                'Venue: 3rd Floor Lab'
            ]
       }*/
    ];

    const filteredEvents = activeFilter === 'all'
        ? events
        : events.filter(event => event.category === activeFilter);

    // const getDifficultyColor = (difficulty: string) => {
    //     switch (difficulty) {
    //         case 'Beginner': return '#00ff88';
    //         case 'Intermediate': return '#ffaa00';
    //         case 'Advanced': return '#ff4444';
    //         default: return '#aaaaaa';
    //     }
    // };

    return (
        <EventsContainer>
            <EventsContent>
                <Header>
                    <Title>Events & Workshops</Title>
                    <Subtitle>Discover Amazing Opportunities</Subtitle>
                    <Description>
                        Explore our diverse range of technical events, non-technical competitions,
                        and hands-on workshops designed to challenge, inspire, and educate.
                    </Description>
                </Header>

                <FilterTabs>
                    <FilterTab
                        isActive={activeFilter === 'all'}
                        onClick={() => setActiveFilter('all')}
                    >
                        All Events
                    </FilterTab>
                    <FilterTab
                        isActive={activeFilter === 'tech'}
                        onClick={() => setActiveFilter('tech')}
                    >
                        Technical
                    </FilterTab>
                    <FilterTab
                        isActive={activeFilter === 'non-tech'}
                        onClick={() => setActiveFilter('non-tech')}
                    >
                        Non-Technical
                    </FilterTab>
                    <FilterTab
                        isActive={activeFilter === 'workshop'}
                        onClick={() => setActiveFilter('workshop')}
                    >
                        Workshops
                    </FilterTab>
                </FilterTabs>

                <EventsGrid>
                    {filteredEvents.map((event, index) => (
                        <EventCard key={event.id} style={{ animationDelay: `${index * 0.1}s` }}>
                            <EventHeader>
                                <EventTitle>{event.title}</EventTitle>
                                <EventIcon>{event.icon}</EventIcon>
                            </EventHeader>

                            <EventDescription>{event.description}</EventDescription>

                            {/* <EventDetails>
                                <EventDetail type="duration">{event.duration}</EventDetail>
                                <EventDetail type="difficulty" style={{ color: getDifficultyColor(event.difficulty) }}>
                                    {event.difficulty}
                                </EventDetail>
                                <EventDetail type="prize">{event.prize}</EventDetail>
                            </EventDetails> */}

                            <EventRules>
                                <RulesTitle>Rules & Guidelines</RulesTitle>
                                <RulesList>
                                    {event.rules.map((rule, ruleIndex) => (
                                        <li key={ruleIndex}>{rule}</li>
                                    ))}
                                </RulesList>
                            </EventRules>

                            <RegisterButton to="/register">
                                Register Now
                            </RegisterButton>
                        </EventCard>
                    ))}
                </EventsGrid>

                <StatsSection>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
                        Event Statistics
                    </h2>
                    <p style={{ color: '#aaaaaa', fontSize: '1.1rem' }}>
                        Join thousands of participants in our exciting events
                    </p>

                    {/* <StatsGrid>
                        <StatItem>
                            <StatNumber>50+</StatNumber>
                            <StatLabel>Events</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>1000+</StatNumber>
                            <StatLabel>Participants</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>₹5L+</StatNumber>
                            <StatLabel>Prize Money</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>3</StatNumber>
                            <StatLabel>Days</StatLabel>
                        </StatItem>
                    </StatsGrid> */}
                </StatsSection>
            </EventsContent>
        </EventsContainer>
    );
};

export default EventsPage;



