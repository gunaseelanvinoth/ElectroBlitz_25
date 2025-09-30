import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const Nav = styled.nav<{ isScrolled: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  padding: 1rem 2rem;
  background: ${props => props.isScrolled
        ? 'rgba(12, 12, 12, 0.95)'
        : 'transparent'};
  backdrop-filter: blur(10px);
  border-bottom: ${props => props.isScrolled
        ? '1px solid rgba(0, 212, 255, 0.3)'
        : 'none'};
  transition: all 0.3s ease;
`;

const NavContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled(Link)`
  font-size: 1.8rem;
  font-weight: 800;
  color: #00d4ff;
  text-decoration: none;
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: glow 3s ease-in-out infinite alternate;
  text-shadow: 0 0 6px rgba(0, 212, 255, 0.2), 0 0 12px rgba(0, 212, 255, 0.15);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.05);
    filter: brightness(1.2);
  }
`;

const NavLinks = styled.ul<{ isOpen: boolean }>`
  display: flex;
  list-style: none;
  gap: 2rem;
  margin: 0;
  padding: 0;

  @media (max-width: 768px) {
    position: fixed;
    top: 70px;
    left: 0;
    right: 0;
    background: rgba(12, 12, 12, 0.98);
    backdrop-filter: blur(20px);
    flex-direction: column;
    padding: 2rem;
    transform: ${props => props.isOpen ? 'translateY(0)' : 'translateY(-100%)'};
    opacity: ${props => props.isOpen ? '1' : '0'};
    visibility: ${props => props.isOpen ? 'visible' : 'hidden'};
    transition: all 0.3s ease;
  }
`;

const NavLink = styled.li`
  position: relative;
`;

const StyledLink = styled(Link) <{ isActive: boolean }>`
  color: ${props => props.isActive ? '#00d4ff' : '#ffffff'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.2), transparent);
    transition: left 0.5s ease;
  }

  &:hover {
    color: #00d4ff;
    transform: translateY(-2px);
    
    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    display: block;
    padding: 1rem;
    text-align: center;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffffff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 212, 255, 0.1);
    color: #00d4ff;
  }

  @media (max-width: 768px) {
    display: block;
  }
`;

const RegisterButton = styled(Link)`
  background: linear-gradient(45deg, #00d4ff, #ff00ff);
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;

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
    transform: translateY(-2px) scale(1.05);
    box-shadow: 0 10px 20px rgba(0, 212, 255, 0.3);
    
    &::before {
      left: 100%;
    }
  }

  @media (max-width: 768px) {
    margin-top: 1rem;
    text-align: center;
  }
`;

const Navigation: React.FC = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <Nav isScrolled={isScrolled}>
            <NavContainer>
                <Logo to="/" onClick={closeMobileMenu}>
                    ElectroBlitz
                </Logo>

                <NavLinks isOpen={isMobileMenuOpen}>
                    <NavLink>
                        <StyledLink
                            to="/"
                            isActive={location.pathname === '/'}
                            onClick={closeMobileMenu}
                        >
                            Home
                        </StyledLink>
                    </NavLink>
                    <NavLink>
                        <StyledLink
                            to="/events"
                            isActive={location.pathname === '/events'}
                            onClick={closeMobileMenu}
                        >
                            Events
                        </StyledLink>
                    </NavLink>
                    <NavLink>
                        <StyledLink
                            to="/about"
                            isActive={location.pathname === '/about'}
                            onClick={closeMobileMenu}
                        >
                            About
                        </StyledLink>
                    </NavLink>
                    <NavLink>
                        <StyledLink
                            to="/contact"
                            isActive={location.pathname === '/contact'}
                            onClick={closeMobileMenu}
                        >
                            Contact
                        </StyledLink>
                    </NavLink>
                    <NavLink>
                        <RegisterButton
                            to="/register"
                            onClick={closeMobileMenu}
                        >
                            Register Now
                        </RegisterButton>
                    </NavLink>
                </NavLinks>

                <MobileMenuButton onClick={toggleMobileMenu}>
                    ☰
                </MobileMenuButton>
            </NavContainer>
        </Nav>
    );
};

export default Navigation;
