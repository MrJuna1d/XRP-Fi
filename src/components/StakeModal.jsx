// ✅ FINAL VERSION OF STAKE MODAL — ensures contract sends real value from deposit balance to bridge wallet

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { ethers } from "ethers";
import {
  XRP_CONTRACT_ADDRESS,
  XRP_CONTRACT_ABI,
} from "../constants/XRPcontract";
import { bridgeToEthereum } from "../services/bridgeService";

const StakeModal = ({ opportunity, onClose }) => {
  const { account, depositBalance, fetchDepositBalance } = useWallet();
  const [stakeAmount, setStakeAmount] = useState("");
  const [isStaking, setIsStaking] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [bridgeStatus, setBridgeStatus] = useState("");
  const [bridgeTxHashes, setBridgeTxHashes] = useState(null);

  const handleStakeConfirm = async () => {
    const numericAmount = parseFloat(stakeAmount);
    const numericBalance = parseFloat(depositBalance);

    if (!numericAmount || numericAmount <= 0) return alert("Invalid amount");
    if (numericAmount > numericBalance)
      return alert("Insufficient deposited balance");

    try {
      setIsStaking(true);
      setBridgeStatus("Initiating XRP bridge...");

      // First, initiate the XRP side bridge
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        XRP_CONTRACT_ADDRESS,
        XRP_CONTRACT_ABI,
        signer
      );

      const parsedAmount = ethers.parseEther(stakeAmount);

      const tx = await contract.initiateBridge(parsedAmount);
      setBridgeStatus("Waiting for XRP bridge confirmation...");
      const xrpReceipt = await tx.wait();

      // Update the deposit balance after successful bridge
      await fetchDepositBalance();

      // Now trigger the Ethereum side bridge
      setBridgeStatus("Initiating Ethereum bridge...");
      const ethBridgeResult = await bridgeToEthereum(stakeAmount, account);

      if (!ethBridgeResult.success) {
        throw new Error(`Ethereum bridge failed: ${ethBridgeResult.error}`);
      }

      setBridgeTxHashes({
        xrpHash: xrpReceipt.hash,
        ethHash: ethBridgeResult.txHash,
        from: account,
        to: "0x61389b858618dc82e961Eadfd5B33C83B9669E04",
      });

      setBridgeStatus("Bridge completed successfully!");
      setShowSuccess(true);
    } catch (err) {
      console.error("Bridge initiation failed:", err);
      setBridgeStatus("");
      alert(
        err.message || "Bridge transaction failed. Check console for details."
      );
    } finally {
      setIsStaking(false);
    }
  };

  const handleMaxClick = () => {
    setStakeAmount(depositBalance.toString());
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
                  <span className="balance-value">{depositBalance} XRP</span>
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
                    <div className="spinner"></div>
                    {bridgeStatus || "Processing..."}
                  </div>
                ) : (
                  "Confirm Stake"
                )}
              </motion.button>
            </>
          ) : (
            <motion.div
              className="success-animation p-6 rounded-xl bg-green-900/20 text-white space-y-4"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <h3 className="text-xl font-semibold text-green-300">
                ✅ Stake Complete
              </h3>

              <div className="space-y-2 text-sm">
                <div>
                  <strong>XRP Bridge Tx:</strong>{" "}
                  <a
                    href={`https://explorer.testnet.xrplevm.org/tx/${bridgeTxHashes?.xrpHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {bridgeTxHashes?.xrpHash?.slice(0, 8)}...
                    {bridgeTxHashes?.xrpHash?.slice(-6)}
                  </a>
                </div>

                <div>
                  <strong>ETH Aave Tx:</strong>{" "}
                  <a
                    href={`https://sepolia.etherscan.io/tx/${bridgeTxHashes?.ethHash}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 underline"
                  >
                    {bridgeTxHashes?.ethHash?.slice(0, 8)}...
                    {bridgeTxHashes?.ethHash?.slice(-6)}
                  </a>
                </div>

                <div className="text-gray-400 text-xs">
                  From: {bridgeTxHashes?.from}
                  <br />
                  To: {bridgeTxHashes?.to}
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccess(false);
                  onClose();
                }}
                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded mt-4 text-white"
              >
                Continue
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StakeModal;
