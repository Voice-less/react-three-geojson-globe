import React, { useMemo, useState, useEffect } from 'react';
import * as THREE from 'three';
import { GeoJSONLoader } from 'three-geojson';
import { WGS84_ELLIPSOID } from '3d-tiles-renderer';
import myCustomGeoJson from '../../assets/data/world_morocco.json';

export default function GeoJsonLines({ onLoaded }) {
  const [geoJsonData, setGeoJsonData] = useState(null);

  useEffect(() => {
    try {
      const loader = new GeoJSONLoader();
      const result = loader.parse(myCustomGeoJson);
      setGeoJsonData(result);
    } catch (error) {
      console.error('GeoJsonLines: Error loading data:', error);
    }
  }, []);

  const geoJsonObjects = useMemo(() => {
    if (!geoJsonData) return [];
    const objects = [];

    // Create the main group
    const group = new THREE.Group();

    // Apply the rotation
    group.rotation.x = -Math.PI / 2;

    // Process ALL line geometries
    geoJsonData.lines.forEach(geom => {
      try {
        const line = geom.getLineObject({
          ellipsoid: WGS84_ELLIPSOID,
        });

        line.material = new THREE.LineBasicMaterial({
          color: 0xffffff, // Changed to white for better contrast
          linewidth: 1,
        });

        group.add(line);
      } catch (error) {
        console.warn('Error processing line:', error);
      }
    });

    // Also get line objects from polygons (outlines)
    geoJsonData.polygons.forEach(geom => {
      try {
        const line = geom.getLineObject({
          ellipsoid: WGS84_ELLIPSOID,
        });

        // Color Morocco regions differently
        if (geom.feature.properties && geom.feature.properties.admin === 'Morocco') {
          const regionName = geom.feature.properties.region_name || 'Unknown';

          // Assign different colors to different regions
          const colors = {
            'Tangier-Tetouan-Al Hoceima': 0xffffff,    // White
            'Oriental': 0xffffff,                      // White
            'Fez-Meknes': 0xffffff,                    // White
            'Rabat-Salé-Kenitra': 0xffffff,            // White
            'Béni Mellal-Khénifra': 0xffffff,          // White
            'Casablanca-Settat': 0xffffff,            // White
            'Marrakech-Safi': 0xffffff,                // White
            'Drâa-Tafilalet': 0xffffff,               // White
            'Souss-Massa': 0xffffff,                  // White
            'Guelmim-Oued Noun': 0xffffff,            // White
            'Laâyoune-Sakia El Hamra': 0xffffff,      // White
            'Dakhla-Oued Ed-Dahab': 0xffffff          // White
          };

          line.material = new THREE.LineBasicMaterial({
            color: colors[regionName] || 0xffffff, // White for Morocco regions
            linewidth: 1,
          });
        } else {
          line.material = new THREE.LineBasicMaterial({
            color: 0xffffff, // White for all other regions
            linewidth: 1,
          });
        }

        group.add(line);
      } catch (error) {
        console.warn('Error processing polygon outline:', error);
      }
    });

    // Scale properly
    const scaleFactor = 100 / 6378137;
    group.scale.setScalar(scaleFactor);

    // Position it slightly outside your globe
    group.scale.multiplyScalar(1.02);

    objects.push(<primitive key="geojson-lines-group" object={group} />);
    return objects;
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