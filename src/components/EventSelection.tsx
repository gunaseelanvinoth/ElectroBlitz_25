import React, { useState, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import FileUpload from './FileUpload';

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

const pulse = keyframes`
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.02);
  }
`;

const EventContainer = styled.div`
  max-width: 800px;
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

const CategoryTabs = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const TabButton = styled.button<{ isActive: boolean }>`
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
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
`;

const EventCard = styled.div<{ isSelected: boolean }>`
  background: ${props => props.isSelected
        ? 'linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(255, 0, 255, 0.1))'
        : 'rgba(255, 255, 255, 0.05)'};
  border: 2px solid ${props => props.isSelected
        ? '#00d4ff'
        : 'rgba(255, 255, 255, 0.1)'};
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 0.6s ease-out;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 212, 255, 0.2);
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

  ${props => props.isSelected && css`
    animation: ${pulse} 2s ease-in-out infinite;
  `}
`;

const EventHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const EventIcon = styled.div`
  font-size: 1.5rem;
  opacity: 0.7;
`;

const EventDescription = styled.p`
  color: #cccccc;
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
`;

// const EventDetails = styled.div`
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   font-size: 0.8rem;
//   color: #aaaaaa;
// `;

// const EventDuration = styled.span`
//   background: rgba(0, 212, 255, 0.2);
//   padding: 0.25rem 0.5rem;
//   border-radius: 10px;
//   color: #00d4ff;
// `;

// const EventDifficulty = styled.span`
//   background: rgba(255, 0, 255, 0.2);
//   padding: 0.25rem 0.5rem;
//   border-radius: 10px;
//   color: #ff00ff;
// `;

const SelectionInfo = styled.div`
  text-align: center;
  color: #aaaaaa;
  font-size: 0.9rem;
  margin-top: 1rem;
`;

const ScannerImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 15px;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 212, 255, 0.2);
  }
`;

const MaxEventsWarning = styled.div`
  background: rgba(255, 193, 7, 0.1);
  border: 1px solid rgba(255, 193, 7, 0.3);
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 2rem;
  color: #ffc107;
  text-align: center;
  font-size: 0.9rem;
`;

interface Event {
    id: string;
    title: string;
    description: string;
    icon: string;
    category: 'tech' | 'non-tech' | 'workshop';
}

interface EventSelectionProps {
    category: 'tech' | 'non-tech' | 'workshop' | '';
    selectedEvents: string[];
    onEventsChange: (events: string[]) => void;
    onFileUpload?: (file: File | null) => void;
    uploadedFile?: File | null;
}

const EventSelection: React.FC<EventSelectionProps> = ({
    category,
    selectedEvents,
    onEventsChange,
    onFileUpload,
    uploadedFile
}) => {
    const [activeTab, setActiveTab] = useState<'tech' | 'non-tech' | 'workshop'>('tech');
    const maxEvents = 5;

    const events: Event[] = [
        // Technical
        { id: 'idea-presentation', title: 'Idea Presentation', description: 'Venue: Microprocessor Lab. Team: 2 members.',  icon: '💡', category: 'tech' },
        { id: 'tech-debate', title: 'Tech Debate', description: 'Venue: Communication Lab.',  icon: '🗣️', category: 'tech' },
        { id: 'circuit-debugging', title: 'Circuit Debugging', description: 'Venues: Hall No 915, Electronics Lab. Team: 2.', icon: '🔧', category: 'tech' },
        { id: 'code-debugging', title: 'Code Debugging', description: 'Venues: Hall No 914, DSP Lab.', icon: '🐞', category: 'tech' },
        { id: 'electrathon', title: 'Electrathon', description: 'Venue: Project Corridor. Team: 3-4.',  icon: '⚡', category: 'tech' },

        // Non-Technical
        { id: 'dugout-deals', title: 'The Dugout Deals', description: 'Venue: 916 or APJ Hall. Team: 3-4.', icon: '🤝', category: 'non-tech' },
        { id: 'connections', title: 'Connections', description: 'Venues: Hall No 922 and 923. Team: 2.',  icon: '🔗', category: 'non-tech' },
        { id: 'case-study', title: 'Case Study', description: 'Venues: Hall No 925 and 923. Team: 2.',  icon: '📊', category: 'non-tech' },

        // Workshops
        { id: 'frontend', title: 'Frontend', description: 'Venue: VLSI Lab.',  icon: '🎨', category: 'workshop' },
        /*{ id: 'pcb-assembling', title: 'PC Assembling', description: 'Venue: Microwave Lab.', icon: '🛠️', category: 'workshop' },*/
       /* { id: 'eda-tools', title: 'EDA Tools', description: 'Venue: 3rd Floor Lab.',  icon: '🧩', category: 'workshop' }*/
    ];

    useEffect(() => {
        if (category && ['tech', 'non-tech', 'workshop'].includes(category)) {
            setActiveTab(category as 'tech' | 'non-tech' | 'workshop');
        }
    }, [category]);

    const filteredEvents = events.filter(event => event.category === activeTab);

    const handleEventToggle = (eventId: string) => {
        if (selectedEvents.includes(eventId)) {
            onEventsChange(selectedEvents.filter(id => id !== eventId));
        } else if (selectedEvents.length < maxEvents) {
            onEventsChange([...selectedEvents, eventId]);
        }
    };

  

    return (
        <EventContainer>
            <Title>Select Events</Title>
            <Description>
                Choose the events you want to participate in. You can select up to {maxEvents} events.
            </Description>

            {selectedEvents.length >= maxEvents && (
                <MaxEventsWarning>
                    ⚠️ You have reached the maximum limit of {maxEvents} events.
                    Deselect an event to choose a different one.
                </MaxEventsWarning>
            )}

            <CategoryTabs>
                <TabButton
                    isActive={activeTab === 'tech'}
                    onClick={() => setActiveTab('tech')}
                >
                    Technical Events
                </TabButton>
                <TabButton
                    isActive={activeTab === 'non-tech'}
                    onClick={() => setActiveTab('non-tech')}
                >
                    Non-Technical Events
                </TabButton>
                <TabButton
                    isActive={activeTab === 'workshop'}
                    onClick={() => setActiveTab('workshop')}
                >
                    Workshops
                </TabButton>
            </CategoryTabs>

            <EventsGrid>
                {filteredEvents.map((event) => (
                    <EventCard
                        key={event.id}
                        isSelected={selectedEvents.includes(event.id)}
                        onClick={() => handleEventToggle(event.id)}
                    >
                        <EventHeader>
                            <EventTitle>{event.title}</EventTitle>
                            <EventIcon>{event.icon}</EventIcon>
                        </EventHeader>

                        <EventDescription>{event.description}</EventDescription>

                        {/* <EventDetails>
                            <EventDuration>{event.duration}</EventDuration>
                            <EventDifficulty style={{ color: getDifficultyColor(event.difficulty) }}>
                                {event.difficulty}
                            </EventDifficulty>
                        </EventDetails> */}
                    </EventCard>
                ))}
            </EventsGrid>

            {/* Show scanner image for workshop events */}
            {activeTab === 'workshop' && (
                <ScannerImage 
                    src="/assets/scanner.jpeg" 
                    alt="Workshop Scanner" 
                />
            )}

            {/* File upload for workshop events */}
            {activeTab === 'workshop' && onFileUpload && (
                <FileUpload
                    onFileSelect={onFileUpload}
                    selectedFile={uploadedFile || null}
                    isRequired={true}
                    error={selectedEvents.some(eventId => 
                        ['frontend', 'pcb-assembling', 'eda-tools'].includes(eventId)
                    ) && !uploadedFile ? "File upload is required for workshop events" : undefined}
                />
            )}

            <SelectionInfo>
                Selected: {selectedEvents.length}/{maxEvents} events
            </SelectionInfo>
        </EventContainer>
    );
};

export default EventSelection;





