import React, { useRef, useMemo, useState } from 'react';
import { useFrame, useLoader } from '@react-three/fiber';
import { Sphere } from '@react-three/drei';
import { TextureLoader } from 'three';
import EarthMap from '../../assets/textures/earthmap.jpg'; 
import EarthBumpMap from '../../assets/textures/earthbump.jpeg';
import EarthCloudMap from '../../assets/textures/earthCloud.png';

export default function ThreeSphere() {
  const [colorMap, bumpMap, cloudsMap] = useLoader(TextureLoader, [
    EarthMap,
    EarthBumpMap,
    EarthCloudMap,
  ]);
  const cloudsRef = useRef();
  const lastUpdateRef = useRef(0);
  
  // Memoize geometry args to prevent recreation
  const earthGeometry = useMemo(() => [100, 24, 24], []);
  const cloudsGeometry = useMemo(() => [101, 20, 20], []);
  
  // Optimize animation with proper frame throttling
  useFrame(({ clock }) => {
    const elapsed = clock.getElapsedTime();
    // Update every 10 frames (approximately 6 times per second at 60fps)
    if (elapsed - lastUpdateRef.current > 0.166) { // ~10 FPS
      cloudsRef.current.rotation.y = elapsed / 25;
      lastUpdateRef.current = elapsed;
    }
  });
  
  return (
    <>
      {/* Earth Sphere */}
      <Sphere args={earthGeometry}>
        <meshLambertMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.3}
        />
      </Sphere>
      
      {/* Clouds Sphere */}
      <Sphere ref={cloudsRef} args={cloudsGeometry}>
        <meshBasicMaterial
          map={cloudsMap}
          transparent={true}
          opacity={0.6}
          alphaTest={0.1}
          depthWrite={false} // Add this for better transparency performance
        />
      </Sphere>
    </>
  );
}