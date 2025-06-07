import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { ethers } from "ethers";
import { XRP_CONTRACT_ADDRESS, XRP_CONTRACT_ABI } from "../constants/XRPcontract";

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within a WalletProvider");
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [account, setAccount] = useState(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [balance, setBalance] = useState("0");
  const [depositBalance, setDepositBalance] = useState("0.00");
  const [chainId, setChainId] = useState(null);

  // Enhanced portfolio data with more realistic tracking
  const [portfolio, setPortfolio] = useState({
    totalStaked: "0",
    totalYield: "0",
    stakedAssets: [],
  });

  const fetchDepositBalance = useCallback(async () => {
    if (!account || typeof window.ethereum === "undefined") return;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        XRP_CONTRACT_ADDRESS,
        XRP_CONTRACT_ABI,
        provider
      );
      const balanceBigInt = await contract.getDepositBalance(account);
      const formatted = ethers.formatEther(balanceBigInt);
      setDepositBalance(parseFloat(formatted).toFixed(4));
      return formatted;
    } catch (error) {
      console.error("Failed to fetch deposit balance:", error);
      return null;
    }
  }, [account]);

  // Set up polling for deposit balance updates
  useEffect(() => {
    let intervalId;

    if (account) {
      // Initial fetch
      fetchDepositBalance();

      // Set up polling every 5 seconds
      intervalId = setInterval(fetchDepositBalance, 5000);
    }

    // Cleanup interval on unmount or when account changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [account, fetchDepositBalance]);

  // Set up event listener for new blocks
  useEffect(() => {
    let provider;

    const setupBlockListener = async () => {
      if (!account || typeof window.ethereum === "undefined") return;

      provider = new ethers.BrowserProvider(window.ethereum);
      provider.on("block", () => {
        fetchDepositBalance();
      });
    };

    setupBlockListener();

    // Cleanup listener on unmount or when account changes
    return () => {
      if (provider) {
        provider.removeAllListeners("block");
      }
    };
  }, [account, fetchDepositBalance]);

  const connectWallet = async () => {
    if (typeof window.ethereum === "undefined") {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      return null;
    }

    try {
      setIsConnecting(true);
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      if (accounts.length > 0) {
        const connectedAccount = accounts[0];
        
        // Get the current chain ID
        const chainIdHex = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chainIdDecimal = parseInt(chainIdHex, 16);
        setChainId(chainIdDecimal);

        // Get the account balance
        const provider = new ethers.BrowserProvider(window.ethereum);
        const balanceBigInt = await provider.getBalance(connectedAccount);
        const balanceInEth = ethers.formatEther(balanceBigInt);
        const formattedBalance = parseFloat(balanceInEth).toFixed(4);

        setAccount(connectedAccount);
        setBalance(formattedBalance);

        // Fetch initial deposit balance
        await fetchDepositBalance();

        // Store in localStorage for persistence
        localStorage.setItem("connectedWallet", connectedAccount);
        localStorage.setItem("walletBalance", formattedBalance);

        return connectedAccount;
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      if (error.code === 4001) {
        // User rejected the connection request
        alert("Please approve the connection request in MetaMask to continue.");
      } else {
        alert("Failed to connect wallet. Please try again.");
      }
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setBalance("0");
    setPortfolio({
      totalStaked: "0",
      totalYield: "0",
      stakedAssets: [],
    });

    // Clear localStorage
    localStorage.removeItem("connectedWallet");
    localStorage.removeItem("walletBalance");
    localStorage.removeItem("portfolio");

    // Clear any session storage as well
    sessionStorage.removeItem("connectedWallet");
    sessionStorage.removeItem("walletBalance");
  };

  const formatAddress = (address) => {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const stakeAsset = (protocol, amount, apy) => {
    const stakeId = Date.now().toString();
    const stakeDate = new Date();

    // Create new staked asset with realistic data
    const newStakedAsset = {
      id: stakeId,
      protocol,
      amount: parseFloat(amount),
      apy: parseFloat(apy),
      stakeDate,
      currentYield: 0,
      isActive: true,
    };

    setPortfolio((prev) => {
      const newTotalStaked =
        prev.stakedAssets.reduce((sum, asset) => sum + asset.amount, 0) +
        parseFloat(amount);
      const updatedAssets = [...prev.stakedAssets, newStakedAsset];

      const newPortfolio = {
        totalStaked: newTotalStaked.toFixed(2),
        totalYield: prev.totalYield,
        stakedAssets: updatedAssets,
      };

      // Save to localStorage
      localStorage.setItem("portfolio", JSON.stringify(newPortfolio));
      return newPortfolio;
    });

    // Update balance (subtract staked amount)
    const currentBalance = parseFloat(balance.replace(",", ""));
    const newBalance = currentBalance - parseFloat(amount);
    setBalance(newBalance.toLocaleString());
    localStorage.setItem("walletBalance", newBalance.toLocaleString());
  };

  const withdrawAsset = (assetId) => {
    return new Promise((resolve) => {
      setPortfolio((prev) => {
        const assetToWithdraw = prev.stakedAssets.find(
          (asset) => asset.id === assetId
        );
        if (!assetToWithdraw) {
          resolve({ success: false });
          return prev;
        }

        // Simulate yield calculation (random between -5% to +20% for demo)
        const yieldMultiplier = 0.95 + Math.random() * 0.25; // 0.95 to 1.20
        const finalAmount = assetToWithdraw.amount * yieldMultiplier;
        const yieldEarned = finalAmount - assetToWithdraw.amount;
        const isGain = yieldEarned > 0;

        // Update balance with final amount
        const currentBalance = parseFloat(balance.replace(",", ""));
        const newBalance = currentBalance + finalAmount;
        setBalance(newBalance.toLocaleString());
        localStorage.setItem("walletBalance", newBalance.toLocaleString());

        // Remove asset from portfolio
        const updatedAssets = prev.stakedAssets.filter(
          (asset) => asset.id !== assetId
        );
        const newTotalStaked = updatedAssets.reduce(
          (sum, asset) => sum + asset.amount,
          0
        );
        const newTotalYield = parseFloat(prev.totalYield) + yieldEarned;

        const newPortfolio = {
          totalStaked: newTotalStaked.toFixed(2),
          totalYield: Math.max(0, newTotalYield).toFixed(2),
          stakedAssets: updatedAssets,
        };

        localStorage.setItem("portfolio", JSON.stringify(newPortfolio));

        resolve({
          success: true,
          isGain,
          yieldEarned: yieldEarned.toFixed(2),
          finalAmount: finalAmount.toFixed(2),
          protocol: assetToWithdraw.protocol,
        });

        return newPortfolio;
      });
    });
  };

  useEffect(() => {
    // Check if wallet was previously connected
    const savedAccount = localStorage.getItem("connectedWallet");
    const savedBalance = localStorage.getItem("walletBalance");
    const savedPortfolio = localStorage.getItem("portfolio");

    if (savedAccount && savedBalance) {
      setAccount(savedAccount);
      setBalance(savedBalance);
      fetchDepositBalance(); // Fetch deposit balance when wallet is reconnected
    }

    if (savedPortfolio) {
      try {
        const parsedPortfolio = JSON.parse(savedPortfolio);
        setPortfolio(parsedPortfolio);
      } catch (error) {
        console.error("Error parsing saved portfolio:", error);
      }
    }

    // Listen for account changes
    if (typeof window.ethereum !== "undefined") {
      const handleAccountsChanged = async (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          localStorage.setItem("connectedWallet", accounts[0]);
          await fetchDepositBalance(); // Fetch deposit balance when account changes
        }
      };

      const handleChainChanged = (chainId) => {
        // Reload the page when chain changes as recommended by MetaMask
        window.location.reload();
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);
      window.ethereum.on("chainChanged", handleChainChanged);

      return () => {
        window.ethereum.removeListener("accountsChanged", handleAccountsChanged);
        window.ethereum.removeListener("chainChanged", handleChainChanged);
      };
    }
  }, [account]);

  const value = {
    account,
    balance,
    depositBalance,
    chainId,
    portfolio,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    stakeAsset,
    withdrawAsset,
    fetchDepositBalance, // Expose this function to components
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
