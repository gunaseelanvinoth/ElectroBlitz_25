import React from 'react';
import styled, { keyframes } from 'styled-components';
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

const float = keyframes`
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-10px);
  }
`;

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const AboutContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const HeroSection = styled.div`
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
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  animation: ${fadeInUp} 0.8s ease-out 0.4s both;
`;

const Section = styled.section`
  margin-bottom: 4rem;
  animation: ${fadeInUp} 0.8s ease-out;
`;

const SectionTitle = styled.h2`
  font-size: 2.5rem;
  font-weight: 700;
  color: #00d4ff;
  margin-bottom: 2rem;
  text-align: center;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 50%;
    transform: translateX(-50%);
    width: 100px;
    height: 3px;
    background: linear-gradient(45deg, #00d4ff, #ff00ff);
    border-radius: 2px;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
`;

const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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

const CardIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 1rem;
  animation: ${float} 3s ease-in-out infinite;
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 700;
  color: #ffffff;
  margin-bottom: 1rem;
`;

const CardDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
  font-size: 1rem;
`;

const Timeline = styled.div`
  position: relative;
  max-width: 800px;
  margin: 0 auto;
`;

const TimelineItem = styled.div`
  display: flex;
  margin-bottom: 3rem;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    left: 30px;
    top: 0;
    bottom: -3rem;
    width: 2px;
    background: linear-gradient(45deg, #00d4ff, #ff00ff);
  }

  &:last-child::before {
    display: none;
  }
`;

const TimelineIcon = styled.div`
  width: 60px;
  height: 60px;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-right: 2rem;
  flex-shrink: 0;
  position: relative;
  z-index: 2;
`;

const TimelineContent = styled.div`
  flex: 1;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 15px;
  padding: 1.5rem;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;

const TimelineDate = styled.div`
  color: #00d4ff;
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
`;

const TimelineTitle = styled.h4`
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
`;

const TimelineDescription = styled.p`
  color: #cccccc;
  line-height: 1.6;
`;

const StatsSection = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 3rem;
  text-align: center;
  margin: 4rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
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

const CTA = styled.div`
  text-align: center;
  margin-top: 4rem;
`;

const CTAButton = styled(Link)`
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  padding: 1rem 2.5rem;
  text-decoration: none;
  text-align: center;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 15px 30px rgba(0, 212, 255, 0.3);
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

const AboutPage: React.FC = () => {
    return (
        <AboutContainer>
            <AboutContent>
                <HeroSection>
                    <Title>About ElectroBlitz</Title>
                    <Subtitle>Where Innovation Meets Excellence</Subtitle>
                    <Description>
                        ElectroBlitz is the premier technical festival organized by the Electronics and Computer Engineering
                        department, bringing together students, professionals, and industry experts for three days of
                        innovation, learning, and competition. Since its inception, ElectroBlitz has been a platform for
                        showcasing cutting-edge technology and fostering creativity in the field of electronics and computing.
                    </Description>
                </HeroSection>

                <Section>
                    <SectionTitle>Our Mission</SectionTitle>
                    <Grid>
                        <Card>
                            <CardIcon>🎯</CardIcon>
                            <CardTitle>Innovation</CardTitle>
                            <CardDescription>
                                To foster innovation and creativity in the field of electronics and computer engineering
                                through hands-on experiences and real-world challenges.
                            </CardDescription>
                        </Card>
                        <Card>
                            <CardIcon>🤝</CardIcon>
                            <CardTitle>Collaboration</CardTitle>
                            <CardDescription>
                                To create a platform where students, professionals, and industry experts can collaborate
                                and share knowledge for mutual growth and development.
                            </CardDescription>
                        </Card>
                        <Card>
                            <CardIcon>🚀</CardIcon>
                            <CardTitle>Excellence</CardTitle>
                            <CardDescription>
                                To inspire the next generation of engineers and technologists to push the boundaries
                                of what's possible in the digital world.
                            </CardDescription>
                        </Card>
                    </Grid>
                </Section>

                <Section>
                    <SectionTitle>Event Timeline</SectionTitle>
                    <Timeline>
                        <TimelineItem>
                            <TimelineIcon>📅</TimelineIcon>
                            <TimelineContent>
                                <TimelineDate>October 24</TimelineDate>
                                <TimelineTitle>Opening Ceremony & Technical Events</TimelineTitle>
                                <TimelineDescription>
                                    Kick off the festival with an inspiring opening ceremony followed by coding competitions,
                                    hackathons, and technical workshops throughout the day.
                                </TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineIcon>⚡</TimelineIcon>
                            <TimelineContent>
                                <TimelineDate>October 24</TimelineDate>
                                <TimelineTitle>Workshops & Non-Technical Events</TimelineTitle>
                                <TimelineDescription>
                                    Dive deep into hands-on workshops with industry experts, participate in cultural events,
                                    quizzes, and management games.
                                </TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                        <TimelineItem>
                            <TimelineIcon>🏆</TimelineIcon>
                            <TimelineContent>
                                <TimelineDate>October 24</TimelineDate>
                                <TimelineTitle>Finals & Closing Ceremony</TimelineTitle>
                                <TimelineDescription>
                                    Witness the grand finale of all competitions, award ceremony, and closing remarks
                                    from distinguished guests and industry leaders.
                                </TimelineDescription>
                            </TimelineContent>
                        </TimelineItem>
                    </Timeline>
                </Section>

                <StatsSection>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
                        ElectroBlitz by Numbers
                    </h2>
                    <p style={{ color: '#aaaaaa', fontSize: '1.1rem' }}>
                        Join thousands of participants in our exciting events
                    </p>

                    {/* <StatsGrid>
                        <StatItem>
                            <StatNumber>5+</StatNumber>
                            <StatLabel>Years</StatLabel>
                        </StatItem>
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
                            <StatNumber>25+</StatNumber>
                            <StatLabel>Colleges</StatLabel>
                        </StatItem>
                        <StatItem>
                            <StatNumber>50+</StatNumber>
                            <StatLabel>Sponsors</StatLabel>
                        </StatItem>
                    </StatsGrid> */}
                </StatsSection>

                <CTA>
                    <h2 style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff', marginBottom: '1rem' }}>
                        Ready to Join Us?
                    </h2>
                    <p style={{ color: '#aaaaaa', fontSize: '1.1rem', marginBottom: '2rem' }}>
                        Don't miss out on this incredible opportunity to learn, compete, and network with the best minds in technology.
                    </p>
                    <CTAButton to="/register">
                        Register Now
                    </CTAButton>
                </CTA>
            </AboutContent>
        </AboutContainer>
    );
};

export default AboutPage;
