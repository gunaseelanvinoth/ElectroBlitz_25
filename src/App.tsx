import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import LandingPage from './components/LandingPage';
import RegistrationPage from './components/RegistrationPage';
import EventsPage from './components/EventsPage';
import AboutPage from './components/AboutPage';
import AdminDashboard from './components/AdminDashboard';
import ElectrathonPage from './components/ElectrathonPage';
import Navigation from './components/Navigation';
import ContactPage from './components/ContactPage';
import Footer from './components/Footer';
import { GlobalStyles } from './styles/GlobalStyles';
import { RegistrationProvider } from './contexts/RegistrationContext';

const AppContainer = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%);
  overflow-x: hidden;
`;

function App() {
  return (
    <RegistrationProvider>
      <Router>
        <GlobalStyles />
        <AppContainer>
          <Navigation />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/electrathon" element={<ElectrathonPage />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/events" element={<EventsPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
          <Footer />
        </AppContainer>
      </Router>
    </RegistrationProvider>
  );
}

export default App;