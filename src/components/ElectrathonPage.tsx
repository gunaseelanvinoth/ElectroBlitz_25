import React from 'react';
import styled, { keyframes } from 'styled-components';
import { Link } from 'react-router-dom';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const ContentCard = styled.div`
  max-width: 900px;
  margin: 0 auto;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 2.5rem;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.6rem;
  font-weight: 900;
  margin: 0 0 1rem 0;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const Subtitle = styled.p`
  color: #aaaaaa;
  margin: 0 0 2rem 0;
  font-size: 1.1rem;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-top: 1.5rem;
`;

const InfoBox = styled.div`
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 14px;
  padding: 1rem 1.25rem;
  color: #e8e8e8;
`;

const Label = styled.div`
  color: #00d4ff;
  font-weight: 600;
  margin-bottom: 0.35rem;
`;

const RegisterButton = styled(Link)`
  display: inline-block;
  margin-top: 2rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  padding: 0.9rem 1.6rem;
  border-radius: 28px;
  text-decoration: none;
  font-weight: 700;
  transition: all 0.3s ease;
  box-shadow: 0 10px 20px rgba(0, 212, 255, 0.18);

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 14px 26px rgba(0, 212, 255, 0.28);
  }
`;

const ElectrathonPage: React.FC = () => {
  return (
    <PageContainer>
      <ContentCard>
        <Title>Electrathon</Title>
        <Subtitle>
          The flagship 24-hour build-and-innovate challenge of ElectroBlitz. Showcase your skills in
          electronics, embedded systems, and innovation. This is a unique track with its own rules
          and registration.
        </Subtitle>

        <Grid>
          <InfoBox>
            <Label>Format</Label>
            <div>Non-stop 24-hour engineering sprint (prototype + demo).</div>
          </InfoBox>
          <InfoBox>
            <Label>Team Size</Label>
            <div>3 members (fixed).</div>
          </InfoBox>
          <InfoBox>
            <Label>Eligibility</Label>
            <div>Open to all branches; basic hardware skills recommended.</div>
          </InfoBox>
          <InfoBox>
            <Label>Judging</Label>
            <div>Innovation, feasibility, execution, and final demonstration.</div>
          </InfoBox>
        </Grid>

        <RegisterButton to="/register#electrathon">
          Register for Electrathon
        </RegisterButton>
      </ContentCard>
    </PageContainer>
  );
};

export default ElectrathonPage;


