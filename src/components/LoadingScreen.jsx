import { motion } from 'framer-motion';
import { useEffect } from 'react';

const LoadingScreen = ({ onComplete }) => {
  useEffect(() => {
    const timerComplete = setTimeout(() => {
      onComplete();
    }, 2500); // Original duration for simple animation

    return () => {
      clearTimeout(timerComplete);
    };
  }, [onComplete]);

  return (
    <motion.div
      className="loading-screen"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="loading-container">
        <motion.svg
          width="100"
          height="100"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            opacity: { duration: 0.5 },
            scale: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Top-left to Bottom-right curved stroke of XRP logo (simplified for overall shape) */}
          <path
            d="M 10 20 C 25 5, 75 95, 90 80"
            stroke="url(#gradient1)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Bottom-left to Top-right curved stroke of XRP logo (simplified for overall shape) */}
          <path
            d="M 10 80 C 25 95, 75 5, 90 20"
            stroke="url(#gradient2)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient id="gradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ff9900" />
              <stop offset="25%" stopColor="#ff3f81" />
              <stop offset="50%" stopColor="#7f5fff" />
              <stop offset="75%" stopColor="#00eaff" />
              <stop offset="100%" stopColor="#00d4a9" />
            </linearGradient>
             <linearGradient id="gradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00d4a9" />
              <stop offset="25%" stopColor="#00eaff" />
              <stop offset="50%" stopColor="#7f5fff" />
              <stop offset="75%" stopColor="#ff3f81" />
              <stop offset="100%" stopColor="#ff9900" />
            </linearGradient>
          </defs>
        </motion.svg>
      </div>
    </motion.div>
  );
};

export default LoadingScreen;