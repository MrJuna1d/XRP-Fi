import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoadingScreen from './components/LoadingScreen';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Portfolio from './pages/Portfolio';
import { WalletProvider } from './context/WalletContext';
import VantaBackground from './components/VantaBackground.jsx';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <WalletProvider>
      <Router>
        <VantaBackground>
          <div className="app">
            <AnimatePresence mode="wait">
              {isLoading ? (
                <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
              ) : (
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/portfolio" element={<Portfolio />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              )}
            </AnimatePresence>
          </div>
        </VantaBackground>
      </Router>
    </WalletProvider>
  );
}

export default App;