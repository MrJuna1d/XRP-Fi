import { motion } from 'framer-motion';

const YieldCard = ({ opportunity, delay = 0, onStakeClick }) => {
  const getRiskColor = (risk) => {
    switch (risk.toLowerCase()) {
      case 'low': return '#10B981';
      case 'medium': return '#F59E0B';
      case 'high': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const handleStakeClick = () => {
    onStakeClick(opportunity);
  };

  return (
    <motion.div
      className="yield-card"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ 
        scale: 1.02, 
        boxShadow: '0 10px 40px rgba(0, 212, 255, 0.15)',
        transition: { duration: 0.2 }
      }}
    >
      <div className="yield-card-header">
        <div className="protocol-info">
          <div className="protocol-icon">{opportunity.icon}</div>
          <div>
            <h3 className="protocol-name">
              {opportunity.protocol}
            </h3>
            <div className="protocol-chain">{opportunity.chain}</div>
          </div>
        </div>
        <div 
          className="risk-badge"
          style={{ backgroundColor: getRiskColor(opportunity.risk) }}
        >
          {opportunity.risk}
        </div>
      </div>

      <div className="yield-stats">
        <div className="stat">
          <div className="stat-label">APY</div>
          <div className="stat-value apy-value">{opportunity.apy}%</div>
        </div>
        <div className="stat">
          <div className="stat-label">TVL</div>
          <div className="stat-value">{opportunity.tvl}</div>
        </div>
      </div>

      <motion.button
        className={`stake-button ${!opportunity.isFunctional ? 'demo-button' : ''}`}
        onClick={handleStakeClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {opportunity.isFunctional ? 'Stake XRP' : 'View Demo'}
      </motion.button>
    </motion.div>
  );
};

export default YieldCard;