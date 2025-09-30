import React from 'react';
import styled, { keyframes } from 'styled-components';

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  padding: 120px 2rem 2rem;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
`;

const Content = styled.div`
  max-width: 900px;
  margin: 0 auto;
  animation: ${fadeInUp} 0.6s ease-out;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: 900;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
`;

const Card = styled.div`
  background: linear-gradient(135deg, rgba(0, 212, 255, 0.08), rgba(255, 0, 255, 0.08));
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: 16px;
  padding: 1.25rem;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.25);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  position: relative;
  overflow: hidden;

  &:hover {
    transform: translateY(-6px);
    box-shadow: 0 25px 50px rgba(0, 212, 255, 0.15);
    border-color: rgba(0, 212, 255, 0.35);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.12), transparent);
    transition: left 0.6s ease;
  }

  &:hover::before {
    left: 100%;
  }
`;

const Label = styled.div`
  color: #00d4ff;
  font-weight: 700;
  margin-bottom: 0.25rem;
`;

const Name = styled.div`
  color: #ffffff;
  font-weight: 600;
`;

const Phone = styled.a`
  color: #e6e6e6;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  margin-top: 0.5rem;
  padding: 0.4rem 0.7rem;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: all 0.25s ease;

  &:hover { color: #ffffff; background: rgba(0, 212, 255, 0.12); border-color: rgba(0, 212, 255, 0.25); }
`;

const ContactPage: React.FC = () => {
  return (
    <PageContainer>
      <Content>
        <Title>Contact</Title>
        <CardGrid>
          <Card>
            <Label>UNECS Chairman</Label>
            <Name>Manickavel G</Name>
            <Phone href="tel:7810089560">7810089560</Phone>
          </Card>
          <Card>
            <Label>IETE Chairman</Label>
            <Name>Swamynathan S</Name>
            <Phone href="tel:9944043555">9944043555</Phone>
          </Card>
          <Card>
            <Label>IETE Secretary</Label>
            <Name>Gunaseelan V</Name>
            <Phone href="tel:9894288912">9894288912</Phone>
          </Card>
          <Card>
            <Label>UNECS Secretary</Label>
            <Name>Suryani S</Name>
            <Phone href="tel:8667677359">8667677359</Phone>
          </Card>
        </CardGrid>
      </Content>
    </PageContainer>
  );
};

export default ContactPage;


