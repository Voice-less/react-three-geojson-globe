import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GeoJSONLoader } from 'three-geojson';
import { WGS84_ELLIPSOID } from '3d-tiles-renderer';
import myCustomGeoJson from '../../assets/data/world_morocco.json';

// Move constants outside component (from official examples pattern)
const CONFIG = {
  thickness: 1e5 * 0.5,
  resolution: 2.5,
  wireframe: false,
  scaleFactor: 100 / 6378137,
  scaleMultiplier: 1.02
};

const MOROCCO_COLORS = {
  'Tangier-Tetouan-Al Hoceima': 0xff0000,
  'Oriental': 0x00ff00,
  'Fez-Meknes': 0x0000ff,
  'Rabat-Salé-Kenitra': 0xffff00,
  'Béni Mellal-Khénifra': 0xff00ff,
  'Casablanca-Settat': 0x00ffff,
  'Marrakech-Safi': 0xffa500,
  'Drâa-Tafilalet': 0x800080,
  'Souss-Massa': 0x008000,
  'Guelmim-Oued Noun': 0x000080,
  'Laâyoune-Sakia El Hamra': 0x808000,
  'Dakhla-Oued Ed-Dahab': 0x800000
};

// Pre-create base material (like in official examples)
const baseMaterial = new THREE.MeshStandardMaterial({
  polygonOffset: true,
  polygonOffsetFactor: 2,
  polygonOffsetUnits: 2,
  color: 0x4ECDC4,
  transparent: false,
  opacity: 1,
  flatShading: false,
  side: THREE.FrontSide,
  depthWrite: true,
});

export default function GeoJsonFilled({ onLoaded }) {
  const [geoJsonData, setGeoJsonData] = useState(null);
  
  useEffect(() => {
    try {
      const loader = new GeoJSONLoader();
      const result = loader.parse(myCustomGeoJson);
      setGeoJsonData(result);
    } catch (error) {
      console.error('GeoJsonFilled: Error loading data:', error);
    }
  }, []);
  
  const geoJsonObjects = useMemo(() => {
    if (!geoJsonData) return [];
    
    // Create the main group (exactly like your original)
    const group = new THREE.Group();
    group.rotation.x = -Math.PI / 2;
    
    // Process ALL polygons exactly like your original logic
    geoJsonData.polygons.forEach(geom => {
      const feature = geom.feature;
      try {
        const mesh = geom.getMeshObject({
          ellipsoid: WGS84_ELLIPSOID,
          thickness: CONFIG.thickness,
          resolution: CONFIG.resolution,
        });
        
        // Your exact Morocco coloring logic - unchanged
        if (feature.properties && feature.properties.admin === 'Morocco') {
          const regionName = feature.properties.region_name || 'Unknown';
          mesh.material.color.set(MOROCCO_COLORS[regionName] || 0xff0000);
        } else {
          // Only optimization: reuse base material instead of creating new
          mesh.material = baseMaterial;
        }
        
        group.add(mesh);
      } catch (error) {
        console.warn('Error processing polygon:', error);
      }
    });
    
    // Your exact scaling logic - unchanged
    group.scale.setScalar(CONFIG.scaleFactor);
    group.scale.multiplyScalar(CONFIG.scaleMultiplier);
    
    return [<primitive key="geojson-group" object={group} />];
  }, [geoJsonData]);
  
  // Call onLoaded when geoJsonObjects are ready
  useEffect(() => {
    if (geoJsonObjects.length > 0 && onLoaded) {
      onLoaded();
    }
  }, [geoJsonObjects, onLoaded]);
  
  return (
    <>
      {geoJsonObjects}
    </>
  );
}