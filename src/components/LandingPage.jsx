import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useEffect, useState } from 'react';

const LandingPage = () => {
  const navigate = useNavigate();
  const { account, connectWallet, isConnecting } = useWallet();
  const [error, setError] = useState('');

  // Auto-redirect if wallet is already connected
  useEffect(() => {
    if (account) {
      navigate('/dashboard');
    }
  }, [account, navigate]);

  const handleConnectWallet = async () => {
    try {
      setError(''); // Clear any previous errors
      const connectedAccount = await connectWallet();
      if (connectedAccount) {
        // Auto-redirect to dashboard after successful connection
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Failed to connect wallet:', err);
      setError('Failed to connect wallet. Please try again.');
    }
  };

  return (
    <motion.div
      className="landing-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, ease: 'easeInOut' }}
    >
      {/* Main Content */}
      <div className="landing-content">
        <motion.div
          className="hero-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">
            XRP DeFi <span className="gradient-text">Aggregator</span>
          </h1>
          <p className="hero-subtitle">
            Maximize your yields across chains with intelligent XRP staking and cross-chain opportunities
          </p>
          <div className="wallet-connection">
            <motion.button
              className="cta-button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isConnecting ? 'Connecting...' : 'Connect Wallet'}
            </motion.button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </motion.div>

        <motion.div
          className="features-grid"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="feature-card">
            <div className="feature-icon">⚡</div>
            <h3>Lightning Fast</h3>
            <p>Execute trades and stake with XRP's speed</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔗</div>
            <h3>Cross-Chain</h3>
            <p>Access yields across multiple networks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🛡️</div>
            <h3>Secure</h3>
            <p>Enterprise-grade security protocols</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;