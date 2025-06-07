import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useWallet } from '../context/WalletContext';

const StakeModal = ({ opportunity, onClose }) => {
  const { balance, stakeAsset } = useWallet();
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleStakeConfirm = async () => {
    if (!stakeAmount || parseFloat(stakeAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    const numericBalance = parseFloat(balance.replace(',', ''));
    const numericAmount = parseFloat(stakeAmount);

    if (numericAmount > numericBalance) {
      alert('Insufficient balance');
      return;
    }

    setIsStaking(true);

    // Simulate staking process
    setTimeout(() => {
      stakeAsset(opportunity.protocol, numericAmount, opportunity.apy);
      setIsStaking(false);
      setShowSuccess(true);

      // Show success animation for 2 seconds then close modal
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleMaxClick = () => {
    const numericBalance = parseFloat(balance.replace(',', ''));
    setStakeAmount(numericBalance.toString());
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="stake-modal"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
        >
          {!showSuccess ? (
            <>
              {/* Modal Header */}
              <div className="modal-header">
                <div className="modal-protocol-info">
                  <div className="modal-protocol-icon">{opportunity.icon}</div>
                  <div>
                    <h3 className="modal-protocol-name">Stake in {opportunity.protocol}</h3>
                    <div className="modal-protocol-details">{opportunity.chain} • {opportunity.apy}% APY</div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={onClose}>✕</button>
              </div>

              {/* Balance Display */}
              <div className="modal-balance">
                <div className="balance-info">
                  <span className="balance-label">Available Balance</span>
                  <span className="balance-value">{balance} XRP</span>
                </div>
              </div>

              {/* Stake Amount Input */}
              <div className="stake-input-section">
                <label className="input-label">Amount to Stake</label>
                <div className="stake-input-container">
                  <input
                    type="number"
                    className="stake-input"
                    placeholder="0.00"
                    value={stakeAmount}
                    onChange={(e) => setStakeAmount(e.target.value)}
                    disabled={isStaking}
                  />
                  <div className="input-actions">
                    <button 
                      className="max-button"
                      onClick={handleMaxClick}
                      disabled={isStaking}
                    >
                      MAX
                    </button>
                    <span className="currency-label">XRP</span>
                  </div>
                </div>
              </div>

              {/* Stake Summary */}
              {stakeAmount && (
                <motion.div
                  className="stake-summary"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="summary-row">
                    <span>You will stake</span>
                    <span className="summary-value">{stakeAmount} XRP</span>
                  </div>
                  <div className="summary-row">
                    <span>Expected yearly yield</span>
                    <span className="summary-value gradient-text">
                      {(parseFloat(stakeAmount) * parseFloat(opportunity.apy) / 100).toFixed(2)} XRP
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Confirm Button */}
              <motion.button
                className="confirm-stake-button"
                onClick={handleStakeConfirm}
                disabled={isStaking || !stakeAmount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isStaking ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>
                    Staking...
                  </div>
                ) : (
                  'Confirm Stake'
                )}
              </motion.button>
            </>
          ) : (
            /* Success Animation */
            <motion.div
              className="success-animation"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", damping: 15, stiffness: 300 }}
            >
              <motion.div
                className="success-checkmark"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", damping: 15, stiffness: 300 }}
              >
                <motion.div
                  className="checkmark-circle"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div
                    className="checkmark-icon"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    ✓
                  </motion.div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="success-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5, duration: 0.4 }}
              >
                <h3>Staked Successfully!</h3>
                <p>{stakeAmount} XRP staked in {opportunity.protocol}</p>
              </motion.div>

              <motion.div
                className="floating-xrp"
                initial={{ y: 0, opacity: 1 }}
                animate={{ y: -50, opacity: 0 }}
                transition={{ delay: 0.8, duration: 1.2 }}
              >
                💰
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StakeModal;