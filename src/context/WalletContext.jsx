import { createContext, useContext, useState, useEffect } from "react";

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

  // Enhanced portfolio data with more realistic tracking
  const [portfolio, setPortfolio] = useState({
    totalStaked: "0",
    totalYield: "0",
    stakedAssets: [],
  });

  const connectWallet = async () => {
    if (typeof window.ethereum !== "undefined") {
      try {
        setIsConnecting(true);
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });

        if (accounts.length > 0) {
          const connectedAccount = accounts[0];
          setAccount(connectedAccount);
          setBalance("2,847.65");

          // Store in localStorage for persistence
          localStorage.setItem("connectedWallet", connectedAccount);
          localStorage.setItem("walletBalance", "2,847.65");

          return connectedAccount; // Return the account for immediate use
        }
      } catch (error) {
        console.error("Error connecting wallet:", error);
        return null;
      } finally {
        setIsConnecting(false);
      }
    } else {
      alert("MetaMask is not installed. Please install MetaMask to continue.");
      setIsConnecting(false);
      return null;
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
      const handleAccountsChanged = (accounts) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          localStorage.setItem("connectedWallet", accounts[0]);
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [account]);

  const value = {
    account,
    balance,
    portfolio,
    isConnecting,
    connectWallet,
    disconnectWallet,
    formatAddress,
    stakeAsset,
    withdrawAsset,
  };

  return (
    <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
  );
};
