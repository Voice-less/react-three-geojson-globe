import React, { Suspense, useEffect, useMemo, useState,useCallback } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import { TextureLoader, BackSide, Vector3 } from 'three';
import ThreeSphere from './three-sphere.jsx';
import GeoJsonLines from './geojson-lines.jsx';
import GeoJsonFilled from './geojson-filled.jsx';
import WireframeGlobe from './wireframe-globe.jsx';
import GalaxyTexture from '../../assets/textures/galaxy.png';

function useFpsLogger() {
  useEffect(() => {
    let frames = 0;
    let lastTime = performance.now();
    const tick = () => {
      frames++;
      const now = performance.now();
      if (now >= lastTime + 1000) {
        console.log(`FPS: ${Math.round((frames * 1000) / (now - lastTime))}`);
        frames = 0;
        lastTime = now;
      }
      requestAnimationFrame(tick);
    };
    const rafId = tick();
    return () => cancelAnimationFrame(rafId);
  }, []);
}

function latLonToVector3(lat, lon, radius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  const x = -(radius * Math.sin(phi) * Math.cos(theta));
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new Vector3(x, y, z);
}

function Background() {
  const texture = useLoader(TextureLoader, GalaxyTexture);
  const backgroundGeometry = useMemo(() => [200, 32, 32], []);

  return (
    <Sphere args={backgroundGeometry}>
      <meshBasicMaterial map={texture} side={BackSide} />
    </Sphere>
  );
}

function ControlPanel({ 
  showPngs, 
  setShowPngs, 
  geoJsonMode, 
  setGeoJsonMode, 
  showWireframe, 
  setShowWireframe 
}) {
  return (
    <div style={{
      position: 'absolute',
      top: '20px',
      left: '20px',
      zIndex: 1000,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      padding: '15px',
      borderRadius: '10px',
      color: 'white',
      fontFamily: 'Arial, sans-serif',
      minWidth: '200px'
    }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '16px' }}>Globe Controls</h3>
      
      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showPngs}
            onChange={(e) => setShowPngs(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Show Animated PNGs
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={showWireframe}
            onChange={(e) => setShowWireframe(e.target.checked)}
            style={{ marginRight: '8px' }}
          />
          Show Wireframe Globe
        </label>
      </div>

      <div style={{ marginBottom: '10px' }}>
        <label style={{ display: 'block', marginBottom: '5px', fontSize: '14px' }}>
          GeoJSON Display Mode:
        </label>
        <select
          value={geoJsonMode}
          onChange={(e) => setGeoJsonMode(e.target.value)}
          style={{
            backgroundColor: '#333',
            color: 'white',
            border: '1px solid #666',
            borderRadius: '4px',
            padding: '5px',
            width: '100%'
          }}
        >
          <option value="none">None</option>
          <option value="lines">Lines Only</option>
          <option value="filled">Filled Regions</option>
        </select>
      </div>
    </div>
  );
}

// Simple loading globe component
function LoadingGlobe() {
  return (
    <group>
      <Sphere args={[100, 32, 16]} position={[0, 0, 0]}>
        <meshStandardMaterial 
          color={0x4ECDC4} 
          transparent 
          opacity={0.3}
          wireframe
        />
      </Sphere>
      <Sphere args={[95, 16, 8]} position={[0, 0, 0]}>
        <meshBasicMaterial 
          color={0x2196F3} 
          transparent 
          opacity={0.1}
        />
      </Sphere>
    </group>
  );
}

// Pre-rendered components wrapper that keeps everything mounted
function PreRenderedScene({ showPngs, geoJsonMode, showWireframe, onAllLoaded }) {
  const [loadedComponents, setLoadedComponents] = useState({
    wireframe: false,
    pngs: false,
    lines: false,
    filled: false
  });
  
  // Track if onAllLoaded has been called to prevent infinite loops
  const [allLoadedCalled, setAllLoadedCalled] = useState(false);

  const handleComponentLoaded = useCallback((componentName) => {
    setLoadedComponents(prev => {
      // Only update if the component wasn't already loaded
      if (prev[componentName]) {
        return prev; // No change needed
      }
      
      const updated = { ...prev, [componentName]: true };
      return updated;
    });
  }, []);

  // Separate useEffect to check if all components are loaded
  useEffect(() => {
    const allLoaded = Object.values(loadedComponents).every(loaded => loaded);
    
    if (allLoaded && !allLoadedCalled && onAllLoaded) {
      setAllLoadedCalled(true);
      onAllLoaded();
    }
  }, [loadedComponents, allLoadedCalled, onAllLoaded]);

  return (
    <group>
      {/* Always render but control visibility */}
      <group visible={showWireframe}>
        <WireframeGlobe onLoaded={() => handleComponentLoaded('wireframe')} />
      </group>
      
      <group visible={showPngs}>
        <ThreeSphere onLoaded={() => handleComponentLoaded('pngs')} />
      </group>
      
      <group visible={geoJsonMode === 'lines'}>
        <GeoJsonLines onLoaded={() => handleComponentLoaded('lines')} />
      </group>
      
      <group visible={geoJsonMode === 'filled'}>
        <GeoJsonFilled onLoaded={() => handleComponentLoaded('filled')} />
      </group>
    </group>
  );
}

function ThreeScene() {
  useFpsLogger();

  // State for toggles
  const [showPngs, setShowPngs] = useState(true);
  const [geoJsonMode, setGeoJsonMode] = useState('lines'); // 'none', 'lines', 'filled'
  const [showWireframe, setShowWireframe] = useState(true);
  const [allComponentsLoaded, setAllComponentsLoaded] = useState(false);

  const { moroccoCoords, initialCameraPosition } = useMemo(() => {
    const coords = { lat: 31.6, lon: -8.0 };
    const position = latLonToVector3(coords.lat, coords.lon, 300);
    return { moroccoCoords: coords, initialCameraPosition: position };
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
      <ControlPanel 
        showPngs={showPngs}
        setShowPngs={setShowPngs}
        geoJsonMode={geoJsonMode}
        setGeoJsonMode={setGeoJsonMode}
        showWireframe={showWireframe}
        setShowWireframe={setShowWireframe}
      />
      
      <Canvas
        gl={{
          antialias: false,
          alpha: false,
          powerPreference: "high-performance",
          stencil: false,
          depth: true,
          logarithmicDepthBuffer: true,
          precision: "highp"
        }}
        dpr={Math.min(window.devicePixelRatio, 1.5)}
        camera={{
          fov: 45,
          position: initialCameraPosition,
          near: 50,
          far: 800
        }}
        performance={{ min: 0.5 }}
        onCreated={({ gl }) => {
          const context = gl.getContext();
          context.enable(context.POLYGON_OFFSET_FILL);
          context.depthFunc(context.LEQUAL);
          context.clearDepth(1.0);
          gl.sortObjects = false;
        }}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.6} />
          <directionalLight
            position={[100, 100, 100]}
            intensity={1.0}
            castShadow={false}
          />
          
          <OrbitControls
            enableDamping
            dampingFactor={0.05}
            rotateSpeed={0.1}
            enableZoom
            enablePan={false}
            target={[0, 0, 0]}
            minDistance={165}
            maxDistance={400}
            enableKeys={false}
            regress
          />

          <Background />
          
          {/* Pre-render everything, toggle visibility */}
          <PreRenderedScene 
            showPngs={showPngs}
            geoJsonMode={geoJsonMode}
            showWireframe={showWireframe}
          />
          
        </Suspense>
      </Canvas>
    </div>
  );
}

export default ThreeScene;