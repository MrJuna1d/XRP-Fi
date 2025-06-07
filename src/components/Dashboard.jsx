import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useWallet } from "../context/WalletContext";
import { useEffect, useState } from "react";
import YieldCard from "./YieldCard";
import StakeModal from "./StakeModal";
import DepositButton from "../components/DepositButton";

const Dashboard = () => {
  const navigate = useNavigate();
  const { account, disconnectWallet } = useWallet();
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [showDisconnectToast, setShowDisconnectToast] = useState(false);

  // Mock yield opportunities data - RealX is the only functional one
  const yieldOpportunities = [
    {
      id: 1,
      protocol: "RealX",
      chain: "XRP Ledger",
      apy: "8.5",
      tvl: "$2.1B",
      risk: "Low",
      icon: "🏦",
      isFunctional: true, // This one actually works
    },
    {
      id: 2,
      protocol: "Aave",
      chain: "Polygon",
      apy: "12.3",
      tvl: "$1.8B",
      risk: "Medium",
      icon: "👻",
      isFunctional: false, // Mock only
    },
    {
      id: 3,
      protocol: "Curve",
      chain: "Arbitrum",
      apy: "15.7",
      tvl: "$950M",
      risk: "Medium",
      icon: "🌊",
      isFunctional: false, // Mock only
    },
    {
      id: 4,
      protocol: "Yearn",
      chain: "Optimism",
      apy: "9.2",
      tvl: "$1.2B",
      risk: "Low",
      icon: "🧙‍♂️",
      isFunctional: false, // Mock only
    },
    {
      id: 5,
      protocol: "Convex",
      chain: "Ethereum",
      apy: "18.4",
      tvl: "$780M",
      risk: "High",
      icon: "🔺",
      isFunctional: false, // Mock only
    },
    {
      id: 6,
      protocol: "Balancer",
      chain: "Polygon",
      apy: "11.8",
      tvl: "$650M",
      risk: "Medium",
      icon: "⚖️",
      isFunctional: false, // Mock only
    },
  ];

  useEffect(() => {
    if (!account) {
      navigate("/");
    }
  }, [account, navigate]);

  const handleDisconnectWallet = () => {
    disconnectWallet();
    setShowDisconnectToast(true);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setShowDisconnectToast(false);
    }, 3000);

    // Redirect to landing page
    navigate("/");
  };

  const handleStakeClick = (opportunity) => {
    if (!opportunity.isFunctional) {
      alert(
        `${opportunity.protocol} is currently in demo mode. Only RealX is fully functional for staking.`
      );
      return;
    }
    setSelectedOpportunity(opportunity);
  };

  const handleCloseModal = () => {
    setSelectedOpportunity(null);
  };

  if (!account) {
    return null;
  }

  return (
    <motion.div
      className="dashboard"
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
            XRP DeFi <span className="gradient-text">Dashboard</span>
          </h1>
          <div className="header-actions">
            <motion.button
              className="portfolio-button"
              onClick={() => navigate("/portfolio")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              📊 Portfolio
            </motion.button>
            <motion.button
              className="portfolio-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <DepositButton />
            </motion.button>

            <button
              className="disconnect-button"
              onClick={handleDisconnectWallet}
            >
              🔌 Disconnect Wallet
            </button>
          </div>
        </motion.header>

        {/* Yield Opportunities Section */}
        <motion.section
          className="yield-section"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h2 className="section-title">Available Yield Opportunities</h2>
          <div className="yield-grid">
            {yieldOpportunities.map((opportunity, index) => (
              <YieldCard
                key={opportunity.id}
                opportunity={opportunity}
                delay={index * 0.1}
                onStakeClick={handleStakeClick}
              />
            ))}
          </div>
        </motion.section>
      </div>

      {/* Stake Modal */}
      {selectedOpportunity && (
        <StakeModal
          opportunity={selectedOpportunity}
          onClose={handleCloseModal}
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

export default Dashboard;
