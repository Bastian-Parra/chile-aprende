"use client";

import React, { useRef, useEffect } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { RegionFeature } from "@/types/geojson";
import * as turf from "@turf/turf";
import { features } from "process";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

const ChileMap = ({
  onRegionClick,
}: {
  onRegionClick?: (region: RegionFeature) => void;
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // configuración del mapa 3d
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      attributionControl: false,
      projection: "globe",
      center: [-71.5429, -35.6751],
      zoom: 8, // zoom
      pitch: 65, // inclinacion
      bearing: 0,
      maxBounds: [
        [-77, -56],
        [-66, -17],
      ],
    });

    map.current.on("load", async () => {
      if (!map.current) return;

      const style = map.current.getStyle();

      style.layers.forEach((layer) => {
        if (layer.type === "symbol") {
          map.current?.setLayoutProperty(layer.id, "visibility", "none");
        }
      });

      try {
        const response = await fetch("/regions.json"); // fetch de regiones

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const chileData = await response.json(); // se pasa el json a un objeto

        interface RegionFeatureProperties {
          shapeName?: string;
          // Add other properties that your features might have
        }

        const centroids = {
          type: "FeatureCollection",
          features: chileData.features.map((feature: GeoJSON.Feature<GeoJSON.Geometry, RegionFeatureProperties>) => {
            return turf.centroid(feature, {
              properties: {
                shapeName: feature.properties?.shapeName,
              }
            });
          })
        }
        
        const chileGeoJSON = turf.featureCollection(chileData.features);
        
        if (
          !chileData ||
          !chileData.features ||
          !Array.isArray(chileData.features)
        ) {
          throw new Error("Invalid Chile data");
        }

        map.current.addSource("chile-regions", {
          type: "geojson",
          data: chileData,
        });

        map.current.on("click", "chile-fill", (e) => {
          if (!e.features || !e.features.length) return;
          const regionName = e.features[0].properties?.shapeName;

          map.current?.flyTo({
            center: e.lngLat,
            zoom: 9,
            speed: 0.4,
            curve: 1.6,
            easing: (t: number) => t,
            pitch: 45,
            bearing: 10,
            essential: true,
          });

          if (onRegionClick) onRegionClick(regionName);
        });

        // capa de regiones
        map.current.addLayer({
          id: "chile-fill",
          type: "fill",
          source: "chile-regions",
          paint: {
            "fill-color": [
              "match",
              ["get", "shapeName"],
              "Región de Arica y Parinacota",
              "#FF6B6B",
              "Región de Tarapacá",
              "#FFD93D",
              "Región de Antofagasta",
              "#6BCB77",
              "Región de Atacama",
              "#4D96FF",
              "Región de Coquimbo",
              "#845EC2",
              "Región de Valparaío",
              "#F9F871",
              "Región Metropolitana de Santiago",
              "#FF9671",
              "Región del Libertador Bernardo O'Higgins",
              "#FFC75F",
              "Región de Máule",
              "#F999B7",
              "Ñuble",
              "#B39CD0",
              "Región del Bío-Bío",
              "#FF6F91",
              "Región de La Araucanía",
              "#93C47D",
              "Región de Los Ríos",
              "#76A5AF",
              "Región de Los Lagos",
              "#8D6E63",
              "Región de Aysen del Gral.Ibañez del Campo",
              "#C1C0B9",
              "Región de Magallanes y Antártica Chilena",
              "#5C5470",
              /* default color */
              "#CCCCCC",
            ],
            "fill-opacity": 0.5,
            "fill-outline-color": "#FFFFFF",
          },
        });

        map.current.addSource("region-labels", {
          type: "geojson",
          data: centroids as GeoJSON.FeatureCollection,
        })

        map.current.addLayer({
          id: "region-labels-layer",
          type: "symbol",
          source: "region-labels",
          layout: {
            "text-field": ["get", "shapeName"], // el texto que se mostrará
            "text-size": 12,
            "text-anchor": "center",
            "text-allow-overlap": true,
          },
          paint: {
            "text-color": "#ffffff",
            "text-halo-color": "#000000",
            "text-halo-width": 1,
          },
        });

        // control de navegación 3d
        map.current.addControl(new mapboxgl.NavigationControl());

        // control del terreno 3d
        map.current.setTerrain({
          source: "mapbox-dem",
          exaggeration: 2.5,
        });
      } catch (error) {
        console.error("Error loading Chile data:", error);
      }
    });

    map.current.on("mouseleave", "chile-fill", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
    });

    map.current.on("mouseenter", "chile-fill", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "pointer";
    });

    map.current.on("mouseleave", "chile-fill", () => {
      if (!map.current) return;
      map.current.getCanvas().style.cursor = "";
    });

    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [onRegionClick]);

  return (
    <div className="w-full h-[calc(80vh-64px)]">
      <div
        ref={mapContainer}
        className="w-full h-full rounded-lg shadow-2xl overflow-hidden"
      />
    </div>
  );
};

export default ChileMap;
