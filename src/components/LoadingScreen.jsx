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
          animate={{
            scale: [0, 1, 1.1, 1, 1.05, 1], // Scales in, slightly bigger, settles, then pulses
            opacity: [0, 1, 1, 1, 1, 1],
            rotate: [0, 360, 360, 360, 360, 360],
          }}
          exit={{
            scale: [1, 0.8, 0],
            opacity: [1, 0.5, 0],
            transition: { duration: 0.7, ease: "easeIn" },
          }}
          transition={{
            scale: { times: [0, 0.6, 0.8, 1, 1.2, 1.4], duration: 2, ease: "easeInOut", repeat: Infinity, repeatType: "mirror" },
            opacity: { times: [0, 0.6, 1, 1, 1, 1], duration: 2, ease: "easeInOut" },
            rotate: { times: [0, 0.6, 1, 1, 1, 1], duration: 2, ease: "easeInOut" },
          }}
        >
          <div className="line line-1" />
          <div className="line line-2" />
        </motion.div>
        <motion.div
          className="loading-glow"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: [0, 0.5, 0.8, 0.5, 0],
            scale: [0.8, 1, 1.2, 1.1, 1.3],
          }}
          transition={{
            duration: 2.5,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "mirror",
            delay: 0.5,
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;