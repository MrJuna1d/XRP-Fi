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
      <div className="landing-content">
        {/* Hero Section */}
        <motion.div
          className="hero-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1 className="hero-title">
            <span className="gradient-text">XRP.Fi</span>
          </h1>
          <p className="hero-subtitle">
            Yield Aggregation on XRP EVM Sidechain
          </p>
          <div className="wallet-connection">
            <motion.button
              className="cta-button"
              onClick={handleConnectWallet}
              disabled={isConnecting}
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(0, 212, 255, 0.3)' }}
              whileTap={{ scale: 0.95 }}
            >
              {isConnecting ? 'Connecting...' : 'Start Bridging & Earning'}
            </motion.button>
            {error && <div className="error-message">{error}</div>}
          </div>
        </motion.div>

        {/* Features Section */}
        <motion.div
          className="features-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <div className="features-grid">
            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">✅</div>
              <h3>Aggregate Yield Platform</h3>
              <p>Earn passive income by bridging assets from XRP EVM Sidechain and routing them into the best DeFi yield sources.</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">🔁</div>
              <h3>Cross-Chain Interoperability</h3>
              <p>Simulate transferring funds from XRP EVM Sidechain to other chains</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">⚙️</div>
              <h3>Automated Yield Routing</h3>
              <p>Upon arrival, your XRP is deposited directly into DeFi protocols</p>
            </motion.div>

            <motion.div
              className="feature-card"
              whileHover={{ y: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="feature-icon">🔐</div>
              <h3>Managed Smart Contracts</h3>
              <p>All positions are trackable on-chain with transparent logic and user-level accounting.</p>
            </motion.div>
          </div>
        </motion.div>

        {/* Strategy Flow Section */}
        <motion.div
          className="strategy-flow"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <h2 className="section-title">How It Works</h2>
          <div className="flow-steps">
            <div className="flow-step">
              <div className="step-icon">💎</div>
              <h4>Deposit</h4>
              <p>XRP Side</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-icon">🌉</div>
              <h4>Bridge</h4>
              <p>EVM Chain (Relayer Transfers ETH)</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-icon">🔄</div>
              <h4>Auto-Supply</h4>
              <p>Create position on Behalf of User</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-icon">📊</div>
              <h4>Track</h4>
              <p>Real-time Position in ETH</p>
            </div>
            <div className="flow-arrow">→</div>
            <div className="flow-step">
              <div className="step-icon">💰</div>
              <h4>Withdraw</h4>
              <p>Back to XRP if needed</p>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LandingPage;