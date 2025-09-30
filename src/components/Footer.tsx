import React from 'react';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  margin-top: 4rem;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-top: 1px solid rgba(255, 255, 255, 0.08);
`;

const FooterInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #cccccc;
  text-align: center;
`;

const Devs = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2rem;
`;

const Avatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 60px;
  object-fit: cover;
  border: 3px solid rgba(255, 255, 255, 0.3);
`;

const DevItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.35rem;
`;

const DevName = styled.div`
  font-size: 0.9rem;
  color: #e6e6e6;
  font-weight: 600;
`;

const Footer: React.FC = () => {
  return (
    <FooterContainer>
      <FooterInner>
        <div>Developed by</div>
        <Devs>
          <DevItem>
            <Avatar src={process.env.PUBLIC_URL + '/images/gunaseelan_v.jpg'} alt="Gunaseelan V" />
            <DevName>Gunaseelan V</DevName>
          </DevItem>
          <DevItem>
            <Avatar src={process.env.PUBLIC_URL + '/images/navaharish_v.jpg'} alt="Navaharish V" />
            <DevName>Navaharish V</DevName>
          </DevItem>
        </Devs>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;


