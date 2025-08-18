import React, { useEffect, useState } from 'react';
import { Html } from '@react-three/drei';

export default function FpsCounter() {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    let id;

    const tick = () => {
      frames++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        setFps(Math.round((frames * 1000) / (now - lastTime)));
        frames = 0;
        lastTime = now;
      }
      id = requestAnimationFrame(tick);
    };
    id = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <Html prepend position={[0, 0, 0]} center={false}>
      <div
        style={{
          position: 'fixed',
          top: 10,
          right: 10,
          background: 'rgba(0,0,0,0.5)',
          color: '#fff',
          padding: '4px 8px',
          fontFamily: 'monospace',
          fontSize: 12,
          pointerEvents: 'none',
          zIndex: 9999,
        }}
      >
        FPS: {fps}
      </div>
    </Html>
  );
}