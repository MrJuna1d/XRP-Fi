import { useState, useEffect } from "react";
import { useWallet } from "../context/WalletContext";
import { XRP_CONTRACT_ABI } from "../constants/XRPcontract";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0x61389b858618dc82e961Eadfd5B33C83B9669E04";

const DepositButton = () => {
  const { account } = useWallet();
  const [userDeposit, setUserDeposit] = useState("0.00");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch user's deposited balance from contract
  const fetchDepositBalance = async () => {
    if (!account || typeof window.ethereum === "undefined") return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceBigInt = await provider.getBalance(account);
      const balanceInEth = ethers.formatEther(balanceBigInt);
      setXrpBalance(parseFloat(balanceInEth).toFixed(4)); // treat it as XRP
    } catch (error) {
      console.error("Failed to fetch deposited balance:", error);
    }
  };

  useEffect(() => {
    fetchDepositBalance();
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
      fetchDepositBalance(); // refresh after deposit
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
        <strong>Deposited XRP in Contract:</strong> {userDeposit} XRP
      </div>

      <button
        onClick={handleDeposit}
        className="px-6 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded hover:scale-105 transition disabled:opacity-50"
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
