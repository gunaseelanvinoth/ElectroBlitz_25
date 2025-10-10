import React from 'react';
import { Link } from 'react-router-dom';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from {
    opacity: 0;
    transform: translateY(50px);
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
    transform: translateY(-20px);
  }
`;

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

const gradientShift = keyframes`
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
`;

const LandingContainer = styled.div`
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  background-size: 400% 400%;
  animation: ${gradientShift} 15s ease infinite;
`;

const AnimatedBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;
`;

const FloatingShape = styled.div<{
    size: string;
    color: string;
    top: string;
    left: string;
    animationDelay: string;
    animationDuration: string;
}>`
  position: absolute;
  width: ${props => props.size};
  height: ${props => props.size};
  background: ${props => props.color};
  border-radius: 50%;
  opacity: 0.1;
  animation: ${float} ${props => props.animationDuration} ease-in-out infinite;
  animation-delay: ${props => props.animationDelay};
  top: ${props => props.top};
  left: ${props => props.left};
`;

const Triangle = styled.div<{
    size: string;
    color: string;
    top: string;
    right: string;
    animationDelay: string;
    animationDuration: string;
}>`
  position: absolute;
  width: 0;
  height: 0;
  border-left: ${props => props.size} solid transparent;
  border-right: ${props => props.size} solid transparent;
  border-bottom: ${props => props.size} solid ${props => props.color};
  opacity: 0.1;
  animation: ${rotate} ${props => props.animationDuration} linear infinite;
  animation-delay: ${props => props.animationDelay};
  top: ${props => props.top};
  right: ${props => props.right};
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 800px;
  padding: 0 2rem;
  animation: ${fadeInUp} 1s ease-out;
`;

const Title = styled.h1`
  font-size: 4rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff, #00d4ff);
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ${gradientShift} 5s ease infinite, glow 4s ease-in-out infinite alternate;
  text-shadow: 0 0 10px rgba(0, 212, 255, 0.18), 0 0 20px rgba(0, 212, 255, 0.12);

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const Subtitle = styled.p`
  font-size: 1.5rem;
  color: #cccccc;
  margin-bottom: 2rem;
  animation: ${fadeInUp} 1s ease-out 0.3s both;

  @media (max-width: 768px) {
    font-size: 1.2rem;
  }
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #aaaaaa;
  margin-bottom: 3rem;
  line-height: 1.6;
  animation: ${fadeInUp} 1s ease-out 0.6s both;

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const PosterImage = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 15px;
  margin: 2rem 0;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
  transition: all 0.3s ease;
  animation: ${fadeInUp} 1s ease-out 0.8s both;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 25px 50px rgba(0, 212, 255, 0.2);
  }
`;

const CTAButton = styled(Link)`
  display: inline-block;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  text-decoration: none;
  font-size: 1.2rem;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  animation: ${fadeInUp} 1s ease-out 0.9s both;
  box-shadow: 0 10px 30px rgba(0, 212, 255, 0.3);

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

  &:hover {
    transform: translateY(-3px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 212, 255, 0.4);
    
    &::before {
      left: 100%;
    }
  }
`;

const StatsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 4rem;
  animation: ${fadeInUp} 1s ease-out 1.2s both;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 1.5rem;
  }
`;

const StatItem = styled.div`
  text-align: center;
`;

const StatNumber = styled.div`
  font-size: 2.5rem;
  font-weight: 800;
  color: #00d4ff;
  margin-bottom: 0.5rem;
`;

const StatLabel = styled.div`
  font-size: 1rem;
  color: #aaaaaa;
  text-transform: uppercase;
  letter-spacing: 1px;
`;

const LandingPage: React.FC = () => {
    return (
        <LandingContainer>
            <AnimatedBackground>
                {/* Floating circles */}
                <FloatingShape
                    size="100px"
                    color="#00d4ff"
                    top="20%"
                    left="10%"
                    animationDelay="0s"
                    animationDuration="6s"
                />
                <FloatingShape
                    size="150px"
                    color="#ff00ff"
                    top="60%"
                    left="5%"
                    animationDelay="2s"
                    animationDuration="8s"
                />
                <FloatingShape
                    size="80px"
                    color="#00ff88"
                    top="30%"
                    left="85%"
                    animationDelay="4s"
                    animationDuration="7s"
                />
                <FloatingShape
                    size="120px"
                    color="#ffaa00"
                    top="70%"
                    left="90%"
                    animationDelay="1s"
                    animationDuration="9s"
                />

                {/* Floating triangles */}
                <Triangle
                    size="60px"
                    color="#00d4ff"
                    top="15%"
                    right="15%"
                    animationDelay="3s"
                    animationDuration="10s"
                />
                <Triangle
                    size="40px"
                    color="#ff00ff"
                    top="45%"
                    right="25%"
                    animationDelay="1s"
                    animationDuration="12s"
                />
                <Triangle
                    size="80px"
                    color="#00ff88"
                    top="75%"
                    right="10%"
                    animationDelay="5s"
                    animationDuration="8s"
                />
            </AnimatedBackground>

            <Content>
                <Title>ElectroBlitz'25</Title>
                <Subtitle>Where Innovation Meets Excellence</Subtitle>
                <Description>
                    Join us for the most electrifying college event of the year!
                    Experience cutting-edge technology, innovative workshops, and
                    connect with like-minded individuals in the world of electronics and communication.
                </Description>

                <PosterImage 
                    src="/assets/poster.jpeg" 
                    alt="ElectroBlitz 2025 Poster" 
                />

                <CTAButton to="/register">
                    Register Now
                </CTAButton>

                <div style={{ marginTop: '2rem', color: '#cccccc' }}>
                    <div style={{ fontWeight: 700, color: '#00d4ff', marginBottom: '0.5rem' }}>Convenor</div>
                    <div>Dr. R.S. Sabeenian, HOD/ECE EXC EVD</div>

                    <div style={{ fontWeight: 700, color: '#00d4ff', margin: '1rem 0 0.5rem' }}>Coordinators</div>
                    <div>Dr. M. Senthil Vadivu, Assistant Professor / ECE</div>
                    <div>Prof K. Saranya, Assistant Professor / ECE</div>
                </div>

                {/* <StatsContainer>
                    <StatItem>
                        <StatNumber>50+</StatNumber>
                        <StatLabel>Events</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatNumber>1000+</StatNumber>
                        <StatLabel>Participants</StatLabel>
                    </StatItem>
                    <StatItem>
                        <StatNumber>3</StatNumber>
                        <StatLabel>Days</StatLabel>
                    </StatItem>
                </StatsContainer> */}
            </Content>
        </LandingContainer>
    );
};

export default LandingPage;
