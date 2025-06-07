import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';

const VantaBackground = () => {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = GLOBE({
        el: vantaRef.current,
        THREE: THREE,
        mouseControls: true,
        touchControls: true,
        backgroundColor: 0x222222, // Dark grey background
        color: 0x98465f,           // Soft purple for globe elements
        size: 1.0,                 // Size of the globe
        showSphere: true,          // Whether to show the central sphere
        showOutline: false,        // Whether to show the outline of the sphere
      });
    }
    return () => {
      if (vantaEffect.current) {
        vantaEffect.current.destroy();
      }
    };
  }, []);

  return (
    <div
      ref={vantaRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none', // allow interaction with content above
      }}
    >
    </div>
  );
};

export default VantaBackground; 