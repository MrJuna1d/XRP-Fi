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
  const [depositedAmount, setDepositedAmount] = useState("0.0760"); // Mock deposited amount

  // Mock yield opportunities data
  const yieldOpportunities = [
    {
      id: 1,
      protocol: "Aave",
      chain: "Ethereum",
      apy: "8.5",
      tvl: "$2.1B",
      risk: "LOW",
      icon: "👻",
      isFunctional: true,
    },
    {
      id: 2,
      protocol: "Curve",
      chain: "Polygon",
      apy: "12.3",
      tvl: "$1.8B",
      risk: "MEDIUM",
      icon: "🌊",
      isFunctional: false,
    },
    {
      id: 3,
      protocol: "Yearn",
      chain: "Optimism",
      apy: "15.7",
      tvl: "$950M",
      risk: "MEDIUM",
      icon: "🧙‍♂️",
      isFunctional: false,
    },
    {
      id: 4,
      protocol: "Convex",
      chain: "Ethereum",
      apy: "9.2",
      tvl: "$1.2B",
      risk: "LOW",
      icon: "🔺",
      isFunctional: false,
    },
    {
      id: 5,
      protocol: "Balancer",
      chain: "Polygon",
      apy: "11.8",
      tvl: "$650M",
      risk: "MEDIUM",
      icon: "⚖️",
      isFunctional: false,
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
    setTimeout(() => setShowDisconnectToast(false), 3000);
    navigate("/");
  };

  const handleStakeClick = (opportunity) => {
    if (!opportunity.isFunctional) {
      alert(
        `${opportunity.protocol} is currently in demo mode. Only Aave is fully functional for staking.`
      );
      return;
    }
    setSelectedOpportunity(opportunity);
  };

  if (!account) return null;

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
          <div className="header-left">
            <h1 className="dashboard-title">XRP.Fi</h1>
          </div>
          <div className="header-actions">
            <motion.div
              className="portfolio-button"
              onClick={() => navigate("/portfolio")}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              📊 Portfolio
            </motion.div>
            <motion.div className="deposit-info">
              <span>Deposited XRP in Contract: {depositedAmount} XRP</span>
              <DepositButton />
            </motion.div>
            <motion.button
              className="disconnect-button"
              onClick={handleDisconnectWallet}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              🔌 Disconnect Wallet
            </motion.button>
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
          onClose={() => setSelectedOpportunity(null)}
        />
      )}

      {/* Disconnect Toast */}
      {showDisconnectToast && (
        <motion.div
          className="disconnect-toast"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
        >
          Wallet disconnected successfully
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;
