import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useEffect, useState } from 'react';
import WithdrawAnimation from '../components/WithdrawAnimation';

const Portfolio = () => {
  const navigate = useNavigate();
  const { account, balance, portfolio, formatAddress, withdrawAsset, disconnectWallet } = useWallet();
  const [withdrawResult, setWithdrawResult] = useState(null);
  const [showDisconnectToast, setShowDisconnectToast] = useState(false);

  useEffect(() => {
    if (!account) {
      navigate('/');
    }
  }, [account, navigate]);

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setShowDisconnectToast(true);
    
    setTimeout(() => {
      setShowDisconnectToast(false);
    }, 3000);
    
    navigate('/');
  };

  const handleWithdraw = async (assetId) => {
    const result = await withdrawAsset(assetId);
    if (result.success) {
      setWithdrawResult(result);
      setTimeout(() => {
        setWithdrawResult(null);
      }, 2000);
    }
  };

  if (!account) {
    return null;
  }

  return (
    <motion.div
      className="portfolio-page"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="dashboard-container">
        {/* Header */}
        <motion.header
          className="dashboard-header"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="dashboard-title">
            <span className="gradient-text">Portfolio</span> Management
          </h1>
          <div className="header-actions">
            <motion.button
              className="back-button"
              onClick={() => navigate('/dashboard')}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Dashboard
            </motion.button>
            <button 
              className="disconnect-button"
              onClick={handleDisconnectWallet}
            >
              🔌 Disconnect
            </button>
          </div>
        </motion.header>

        {/* Portfolio Header Section */}
        <motion.section
          className="portfolio-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="section-title">Wallet Overview</h2>
          
          <div className="portfolio-grid">
            {/* Connected Wallet Card */}
            <div className="portfolio-card wallet-card">
              <div className="card-header">
                <h3>Connected Wallet</h3>
                <div className="wallet-status">🟢 Connected</div>
              </div>
              <div className="wallet-address">{formatAddress(account)}</div>
              <div className="wallet-balance">
                <span className="balance-label">XRP Balance</span>
                <span className="balance-amount">{balance} XRP</span>
              </div>
            </div>

            {/* Total Staked Card */}
            <div className="portfolio-card stats-card">
              <div className="stat-item">
                <div className="stat-label">Total Amount Staked</div>
                <div className="stat-value">{portfolio.totalStaked} XRP</div>
              </div>
              <div className="stat-item">
                <div className="stat-label">Total Yield Earned</div>
                <div className="stat-value gradient-text">{portfolio.totalYield} XRP</div>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Active Stakes Section */}
        <motion.section
          className="portfolio-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <h2 className="section-title">Active Stakes</h2>

          {portfolio.stakedAssets.length === 0 ? (
            <motion.div
              className="empty-state"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="empty-icon">📊</div>
              <h3>No Active Stakes</h3>
              <p>Start staking to see your positions here</p>
              <motion.button
                className="cta-button"
                onClick={() => navigate('/dashboard')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Explore Opportunities
              </motion.button>
            </motion.div>
          ) : (
            <div className="staked-assets-grid">
              <AnimatePresence>
                {portfolio.stakedAssets.map((asset, index) => (
                  <motion.div
                    key={asset.id}
                    className="staked-asset-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                  >
                    <div className="asset-header">
                      <div className="asset-protocol">
                        <span className="protocol-icon">🏦</span>
                        <div>
                          <h3>{asset.protocol}</h3>
                          <p className="asset-apy">{asset.apy}% APY</p>
                        </div>
                      </div>
                      <div className="asset-status">
                        <span className="status-indicator">🟢</span>
                        <span>Active</span>
                      </div>
                    </div>

                    <div className="asset-details">
                      <div className="detail-row">
                        <span className="detail-label">Token/Asset</span>
                        <span className="detail-value">XRP</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Amount Staked</span>
                        <span className="detail-value">{asset.amount} XRP</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Current Yield</span>
                        <span className="detail-value gradient-text">+{asset.currentYield} XRP</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-label">Stake Date</span>
                        <span className="detail-value">
                          {new Date(asset.stakeDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      className="withdraw-button"
                      onClick={() => handleWithdraw(asset.id)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      💰 Withdraw
                    </motion.button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </motion.section>
      </div>

      {/* Withdraw Animation */}
      {withdrawResult && (
        <WithdrawAnimation
          result={withdrawResult}
          onComplete={() => setWithdrawResult(null)}
        />
      )}

      {/* Disconnect Toast */}
      {showDisconnectToast && (
        <motion.div
          className="disconnect-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
        >
          ✅ Wallet disconnected
        </motion.div>
      )}
    </motion.div>
  );
};

export default Portfolio;