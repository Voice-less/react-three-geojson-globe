import React from 'react';
import { Sphere } from '@react-three/drei';

export default function WireframeGlobe() {
  return (
    <Sphere args={[99, 24, 24]}>
      <meshBasicMaterial 
        color="#333" 
        wireframe 
        opacity={0.2} 
        transparent 
      />
    </Sphere>
  );
}