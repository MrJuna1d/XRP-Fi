import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const path1Ref = useRef(null);
  const path2Ref = useRef(null);
  const [path1Length, setPath1Length] = useState(0);
  const [path2Length, setPath2Length] = useState(0);

  useEffect(() => {
    // Measure path lengths after initial render
    if (path1Ref.current && path2Ref.current) {
      setPath1Length(path1Ref.current.getTotalLength());
      setPath2Length(path2Ref.current.getTotalLength());
    }

    // Trigger onComplete after drawing animation finishes + a small buffer
    const animationDuration = 2000; // Duration for both paths to draw
    const delayBeforeComplete = 500; // Buffer before calling onComplete

    const timerComplete = setTimeout(() => {
      onComplete();
    }, animationDuration + delayBeforeComplete);

    return () => {
      clearTimeout(timerComplete);
    };
  }, [onComplete, path1Length, path2Length]); // Recalculate if pathLength changes (e.g., initial render to actual length)

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
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        >
          {/* Top-left to Bottom-right curved stroke of XRP logo (simplified for overall shape) */}
          <motion.path
            ref={path1Ref}
            d="M 10 20 C 25 5, 75 95, 90 80"
            stroke="url(#gradient1)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: path1Length, strokeDashoffset: path1Length }}
            animate={{ strokeDashoffset: path1Length > 0 ? 0 : path1Length }}
            transition={{
              strokeDashoffset: { duration: 1.5, ease: "easeInOut" },
            }}
          />
          {/* Bottom-left to Top-right curved stroke of XRP logo (simplified for overall shape) */}
          <motion.path
            ref={path2Ref}
            d="M 10 80 C 25 95, 75 5, 90 20"
            stroke="url(#gradient2)"
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ strokeDasharray: path2Length, strokeDashoffset: path2Length }}
            animate={{ strokeDashoffset: path2Length > 0 ? 0 : path2Length }}
            transition={{
              strokeDashoffset: { duration: 1.5, ease: "easeInOut", delay: 0.2 },
            }}
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