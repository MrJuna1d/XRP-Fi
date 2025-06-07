import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import HALO from 'vanta/dist/vanta.halo.min';

const VantaBackground = ({ children }) => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = HALO({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        backgroundColor: 0x181848, // deep navy
        baseColor: 0x7f5fff,      // soft purple
        color2: 0x00eaff,         // cyan
        amplitudeFactor: 2.5,
        size: 2.0,
        speed: 0.7,
        xOffset: 0.0,
        yOffset: 0.0,
        // No alpha in hex, so we'll use a semi-transparent overlay in the style below
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div ref={vantaRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0 }}>
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(24,24,72,0.7)', zIndex: 1 }} />
      {children}
    </div>
  );
};

export default VantaBackground; 