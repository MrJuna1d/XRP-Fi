import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2000); // Animation duration + small buffer

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-container">
        <motion.div
          className="x-container"
          initial={{ scale: 0, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 360 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        >
          <div className="line line-1" />
          <div className="line line-2" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;