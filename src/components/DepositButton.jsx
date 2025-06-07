import { useState } from "react";
import { useWallet } from "../context/WalletContext";
import { XRP_CONTRACT_ABI, XRP_CONTRACT_ADDRESS } from "../constants/XRPcontract";
import { ethers } from "ethers";

const DepositButton = () => {
  const { account, depositBalance, fetchDepositBalance } = useWallet();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!window.ethereum || !account) {
      setMessage("MetaMask not detected or wallet not connected.");
      return;
    }

    try {
      const depositAmount = prompt("Enter amount of XRP to deposit (e.g., 0.01):");
      
      if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
        setMessage("❌ Invalid amount entered.");
        return;
      }

      setLoading(true);
      setMessage("Waiting for MetaMask confirmation...");

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
        value: depositAmountWei
      });

      setMessage("Transaction submitted. Waiting for confirmation...");
      
      // Wait for transaction confirmation
      await tx.wait();
      
      setMessage(`✅ Successfully deposited ${depositAmount} XRP.`);
      
      // Refresh the deposit balance
      await fetchDepositBalance();
    } catch (error) {
      console.error("Deposit failed:", error);
      if (error.code === 4001) {
        setMessage("❌ Transaction rejected by user.");
      } else if (error.code === 'INSUFFICIENT_FUNDS') {
        setMessage("❌ Insufficient funds for deposit.");
      } else {
        setMessage("❌ Deposit failed. Check console for details.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white space-y-3">
      <div>
        <strong>Deposited XRP in Contract:</strong> {depositBalance} XRP
      </div>

      <button
        onClick={handleDeposit}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded hover:scale-105 transition disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Deposit XRP"}
      </button>

      {message && (
        <div className={`mt-2 text-sm italic ${message.includes('✅') ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default DepositButton;
