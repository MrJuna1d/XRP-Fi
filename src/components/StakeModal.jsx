// ✅ FINAL VERSION OF STAKE MODAL — ensures contract sends real value from deposit balance to bridge wallet

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import {
  XRP_CONTRACT_ADDRESS,
  XRP_CONTRACT_ABI,
} from "../constants/XRPcontract";

const StakeModal = ({ opportunity, onClose }) => {
  const { account } = useWallet();
  const [depositedBalance, setDepositedBalance] = useState("0.00");
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const fetchDepositBalance = async () => {
    if (!account || !window.ethereum) return;
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        XRP_CONTRACT_ADDRESS,
        XRP_CONTRACT_ABI,
        provider
      );
      const balanceBigInt = await contract.getDepositBalance(account);
      const formatted = ethers.formatEther(balanceBigInt);
      setDepositedBalance(parseFloat(formatted).toFixed(4));
    } catch (err) {
      console.error("Error fetching deposit balance:", err);
    }
  };

  useEffect(() => {
    fetchDepositBalance();
  }, [account]);

  const handleStakeConfirm = async () => {
    const numericAmount = parseFloat(stakeAmount);
    const numericBalance = parseFloat(depositedBalance);

    if (!numericAmount || numericAmount <= 0) return alert("Invalid amount");
    if (numericAmount > numericBalance)
      return alert("Insufficient deposited balance");

    try {
      setIsStaking(true);
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        XRP_CONTRACT_ADDRESS,
        XRP_CONTRACT_ABI,
        signer
      );

      const parsedAmount = ethers.parseEther(numericAmount.toString());

      const tx = await contract.initiateBridge(parsedAmount);
      await tx.wait();

      await fetchDepositBalance();

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        onClose();
      }, 2000);
    } catch (err) {
      console.error("Bridge initiation failed:", err);
      alert("Bridge transaction failed. Check console for details.");
    } finally {
      setIsStaking(false);
    }
  };

  const handleMaxClick = () => {
    setStakeAmount(depositedBalance.toString());
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
              <div className="modal-header">
                <div className="modal-protocol-info">
                  <div className="modal-protocol-icon">{opportunity.icon}</div>
                  <div>
                    <h3 className="modal-protocol-name">
                      Stake in {opportunity.protocol}
                    </h3>
                    <div className="modal-protocol-details">
                      {opportunity.chain} • {opportunity.apy}% APY
                    </div>
                  </div>
                </div>
                <button className="modal-close-btn" onClick={onClose}>
                  ✕
                </button>
              </div>

              <div className="modal-balance">
                <div className="balance-info">
                  <span className="balance-label">Deposited in Contract</span>
                  <span className="balance-value">{depositedBalance} XRP</span>
                </div>
              </div>

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
                      {(
                        (parseFloat(stakeAmount) *
                          parseFloat(opportunity.apy)) /
                        100
                      ).toFixed(2)}{" "}
                      XRP
                    </span>
                  </div>
                </motion.div>
              )}

              <motion.button
                className="confirm-stake-button"
                onClick={handleStakeConfirm}
                disabled={isStaking || !stakeAmount}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isStaking ? (
                  <div className="loading-spinner">
                    <div className="spinner"></div>Staking...
                  </div>
                ) : (
                  "Confirm Stake"
                )}
              </motion.button>
            </>
          ) : (
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
                transition={{ delay: 0.2 }}
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
                <p>
                  {stakeAmount} XRP staked in {opportunity.protocol}
                </p>
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
