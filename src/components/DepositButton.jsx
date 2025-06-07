import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { CONTRACT_ABI } from "../constants/contract";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xaFac3C0Fa22E12454c4053D0419dC900724DC461";

const DepositButton = () => {
  const { account } = useWallet();
  const [xrpBalance, setXrpBalance] = useState("0.00");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const getBalance = async () => {
    if (!account || typeof window.ethereum === "undefined") return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceBigInt = await provider.getBalance(account);
      const balanceInEth = ethers.formatEther(balanceBigInt);
      setXrpBalance(parseFloat(balanceInEth).toFixed(4)); // treat it as XRP
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  useEffect(() => {
    getBalance();
  }, [account]);

  const handleDeposit = async () => {
    if (!window.ethereum || !account) {
      setMessage("MetaMask not detected or wallet not connected.");
      return;
    }

    try {
      const depositAmount = prompt(
        "Enter amount of XRP to deposit (e.g., 0.01):"
      );

      if (!depositAmount || isNaN(depositAmount)) {
        setMessage("❌ Invalid amount entered.");
        return;
      }

      setLoading(true);
      setMessage("Depositing...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.deposit({
        value: ethers.parseEther(depositAmount),
      });

      await tx.wait();
      setMessage(`✅ Successfully deposited ${depositAmount} XRP.`);
      getBalance(); // update balance after deposit
    } catch (error) {
      console.error("Deposit failed:", error);
      setMessage("❌ Deposit failed. Check the console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-white space-y-3">
      <div>
        <strong>Your XRP Balance:</strong> {xrpBalance} XRP
      </div>

      <button
        onClick={handleDeposit}
        className="px-8 py-3 bg-gradient-to-r from-[#00D4FF] to-[#0099CC] text-white font-bold text-lg rounded-xl shadow-lg hover:scale-105 transition duration-300 ease-in-out disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Processing..." : "Deposit XRP"}
      </button>

      {message && (
        <div className="mt-2 text-sm text-white/80 italic">{message}</div>
      )}
    </div>
  );
};

export default DepositButton;
