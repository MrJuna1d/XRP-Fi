import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import {
  XRP_CONTRACT_ABI,
  XRP_CONTRACT_ADDRESS,
} from "../constants/XRPcontract";
import { ethers } from "ethers";

const DepositButton = () => {
  const { account } = useWallet();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [showMessage, setShowMessage] = useState(false);
  const [depositedBalance, setDepositedBalance] = useState("0.0000");

  const fetchDepositBalance = async () => {
    if (!window.ethereum || !account) return;

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
    if (account) {
      fetchDepositBalance();
    }
  }, [account]);

  const handleDeposit = async () => {
    if (!window.ethereum || !account) {
      setMessage("MetaMask not detected or wallet not connected.");
      setShowMessage(true);
      return;
    }

    try {
      const depositAmount = prompt(
        "Enter amount of XRP to deposit (e.g., 0.01):"
      );

      if (
        !depositAmount ||
        isNaN(depositAmount) ||
        parseFloat(depositAmount) <= 0
      ) {
        setMessage("❌ Invalid amount entered.");
        setShowMessage(true);
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");
      setShowMessage(true);

      // Get the signer and create contract instance
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        XRP_CONTRACT_ADDRESS,
        XRP_CONTRACT_ABI,
        signer
      );

      // Convert the amount to Wei (or the smallest unit)
      const depositAmountWei = ethers.parseEther(depositAmount);

      // Call the deposit function with the value parameter
      const tx = await contract.deposit({
        value: depositAmountWei,
      });

      setMessage("Transaction submitted. Waiting for confirmation...");

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      setMessage(`✅ Successfully deposited ${depositAmount} XRP`);
      setTxHash(receipt.hash);
      setShowMessage(true);

      // Refresh the deposit balance
      await fetchDepositBalance();
    } catch (error) {
      console.error("Deposit failed:", error);
      if (error.code === 4001) {
        setMessage("❌ Transaction rejected by user.");
      } else if (error.code === "INSUFFICIENT_FUNDS") {
        setMessage("❌ Insufficient funds for deposit.");
      } else {
        setMessage("❌ Deposit failed. Check console for details.");
      }
      setShowMessage(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white">
      <div className="flex items-center justify-between mb-3 ">
        <strong className="text-lg">{depositedBalance} XRP</strong>
        <button
          onClick={handleDeposit}
          className="deposit-button px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white font-medium"
          disabled={loading}
        >
          {loading ? "Processing..." : "Deposit XRP"}
        </button>
      </div>

      {showMessage && (
        <div
          className={`message-container ${
            message.includes("✅") ? "success" : "error"
          }`}
        >
          <div className="message-content">
            {message}
            {txHash && (
              <div className="tx-hash">
                Transaction Hash:
                <a
                  href={`https://etherscan.io/tx/${txHash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hash-link"
                >
                  {txHash.slice(0, 6)}...{txHash.slice(-4)}
                </a>
              </div>
            )}
          </div>
          <button
            className="close-button"
            onClick={() => setShowMessage(false)}
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};

export default DepositButton;
