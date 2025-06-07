import { motion, AnimatePresence } from 'framer-motion';

const WithdrawAnimation = ({ result, onComplete }) => {
  const { isGain, yieldEarned, finalAmount, protocol } = result;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="withdraw-animation-modal"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 15, stiffness: 300 }}
        >
          {isGain ? (
            /* Gain Animation */
            <motion.div className="gain-animation">
              <motion.div
                className="coin-explosion"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.6 }}
              >
                <div className="explosion-coins">
                  {[...Array(8)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="flying-coin"
                      initial={{ 
                        x: 0, 
                        y: 0, 
                        opacity: 1,
                        rotate: 0 
                      }}
                      animate={{ 
                        x: Math.cos(i * 45 * Math.PI / 180) * 100,
                        y: Math.sin(i * 45 * Math.PI / 180) * 100,
                        opacity: 0,
                        rotate: 360
                      }}
                      transition={{ 
                        duration: 1.5,
                        delay: 0.3,
                        ease: "easeOut"
                      }}
                    >
                      💰
                    </motion.div>
                  ))}
                </div>
                <motion.div
                  className="success-checkmark"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8, type: "spring", damping: 15, stiffness: 300 }}
                >
                  <div className="checkmark-circle gain">
                    <span className="checkmark-icon">✓</span>
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                className="result-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <h3 className="gain-title">🎉 Successful Withdrawal!</h3>
                <p>Withdrew from {protocol}</p>
                <div className="yield-info gain">
                  <span>Yield Earned: +{yieldEarned} XRP</span>
                  <span>Total Received: {finalAmount} XRP</span>
                </div>
              </motion.div>
            </motion.div>
          ) : (
            /* Loss Animation */
            <motion.div className="loss-animation">
              <motion.div
                className="falling-coin"
                initial={{ y: -50, rotate: 0 }}
                animate={{ y: 100, rotate: 180 }}
                transition={{ duration: 1, ease: "easeIn" }}
              >
                💰
              </motion.div>
              
              <motion.div
                className="sad-face"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring", damping: 15, stiffness: 300 }}
              >
                😢
              </motion.div>
              
              <motion.div
                className="result-text"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 1, duration: 0.4 }}
              >
                <h3 className="loss-title">Withdrawal Complete</h3>
                <p>Withdrew from {protocol}</p>
                <div className="yield-info loss">
                  <span>Loss: {yieldEarned} XRP</span>
                  <span>Total Received: {finalAmount} XRP</span>
                </div>
              </motion.div>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WithdrawAnimation;