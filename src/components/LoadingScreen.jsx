import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const LoadingScreen = ({ onComplete }) => {
  const [animationPhase, setAnimationPhase] = useState('initial');

  useEffect(() => {
    const timer1 = setTimeout(() => setAnimationPhase('slideIn'), 100);
    const timer2 = setTimeout(() => setAnimationPhase('formX'), 1200);
    const timer3 = setTimeout(() => setAnimationPhase('glow'), 1700);
    const timer4 = setTimeout(() => setAnimationPhase('zoom'), 2200);
    const timer5 = setTimeout(() => onComplete(), 3500);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
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
        {/* First Line - slides from left and rotates to form top-left to bottom-right diagonal */}
        <motion.div
          className="line"
          initial={{ 
            x: -200, 
            y: 0,
            opacity: 0,
            rotate: 0
          }}
          animate={{
            x: animationPhase === 'initial' ? -200 : 0,
            y: 0,
            opacity: animationPhase === 'initial' ? 0 : 1,
            rotate: animationPhase === 'formX' || animationPhase === 'glow' || animationPhase === 'zoom' ? 45 : 0,
          }}
          transition={{
            x: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.3 },
            rotate: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center',
          }}
        />
        
        {/* Second Line - slides from right and rotates to form top-right to bottom-left diagonal */}
        <motion.div
          className="line"
          initial={{ 
            x: 200, 
            y: 0,
            opacity: 0,
            rotate: 0
          }}
          animate={{
            x: animationPhase === 'initial' ? 200 : 0,
            y: 0,
            opacity: animationPhase === 'initial' ? 0 : 1,
            rotate: animationPhase === 'formX' || animationPhase === 'glow' || animationPhase === 'zoom' ? -45 : 0,
          }}
          transition={{
            x: { duration: 1, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.3 },
            rotate: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            transformOrigin: 'center',
          }}
        />

        {/* Glow Effect - appears when X is formed */}
        <motion.div
          className="x-glow"
          initial={{ opacity: 0, scale: 1 }}
          animate={{
            opacity: animationPhase === 'glow' ? [0, 0.8, 0.6, 1, 0.7] : 0,
            scale: animationPhase === 'zoom' ? 50 : 1,
          }}
          transition={{
            opacity: { duration: 0.5, times: [0, 0.2, 0.4, 0.7, 1] },
            scale: { duration: 1.3, delay: animationPhase === 'zoom' ? 0 : 1, ease: [0.25, 0.46, 0.45, 0.94] },
          }}
        />

        {/* X Container for final zoom effect */}
        <motion.div
          className="x-container"
          initial={{ scale: 1, opacity: 1 }}
          animate={{
            scale: animationPhase === 'zoom' ? 50 : 1,
            opacity: animationPhase === 'zoom' ? 0 : 1,
          }}
          transition={{
            scale: { duration: 1.3, ease: [0.25, 0.46, 0.45, 0.94] },
            opacity: { duration: 0.5, delay: 0.8 },
          }}
        />
      </div>
    </motion.div>
  );
};

export default LoadingScreen;