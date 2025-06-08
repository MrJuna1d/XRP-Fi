import { motion } from "framer-motion";

const YieldCard = ({ opportunity, delay, onStakeClick }) => {
  const { protocol, chain, apy, tvl, risk, icon, isFunctional } = opportunity;

  return (
    <motion.div
      className="yield-card"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
    >
      <div className="yield-card-header">
        <div className="protocol-info">
          <div className="protocol-icon">{icon}</div>
          <div>
            <h3 className="protocol-name">{protocol}</h3>
            <div className="protocol-chain">{chain}</div>
          </div>
        </div>
        <div className={`risk-badge ${risk}`}>{risk}</div>
      </div>

      <div className="yield-stats">
        <div className="stat">
          <div className="stat-label">APY</div>
          <div className="stat-value apy-value">{apy}%</div>
        </div>
        <div className="stat">
          <div className="stat-label">TVL</div>
          <div className="stat-value">{tvl}</div>
        </div>
      </div>

      <motion.button
        className={isFunctional ? "stake-button" : "view-demo-button"}
        onClick={() => onStakeClick(opportunity)}
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
      >
        {isFunctional ? "Create Position" : "View Demo"}
      </motion.button>
    </motion.div>
  );
};

export default YieldCard;
