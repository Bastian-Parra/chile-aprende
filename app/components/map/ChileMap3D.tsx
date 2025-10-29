"use client";

import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

interface ChileMapProps {
  onRegionClick?: (region: any) => void;
  missions?: any[];
}

const ChileMap: React.FC<ChileMapProps> = ({
  onRegionClick,
  missions = [],
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current) return;

    // configuración del mapa 3d
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/standard",
      attributionControl: false,
      projection: "mercator",
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
        const chileData = await response.json();

        map.current.addSource("chile-regions", {
          type: "geojson",
          data: chileData,
        });

        // capa de regiones
        map.current.addLayer({
          id: "chile-fill",
          type: "fill",
          source: "chile-regions",
          paint: {
            "fill-color": [
              "case",
              ["boolean", ["feature-state", "hover"], false],
              "#1FD869",
              "#1FD869",
            ],
            "fill-opacity": 0.3,
            "fill-outline-color": "#fff",
          },
        });

        // control de navegación 3d
        map.current.addControl(new mapboxgl.NavigationControl());

        // control del terreno 3d
        map.current.setTerrain({
          source: "mapbox-dem",
          exaggeration: 2.5,
        });

        setMapLoaded(true);
      } catch (error) {
        console.error("Error loading Chile data:", error);
      }
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

// poligono chile
function getChilePolygon() {
  return [
    [-75.644395, -55.61183],
    [-66.95927, -55.61183],
    [-66.95927, -17.49854],
    [-75.644395, -17.49854],
    [-75.644395, -55.61183],
  ];
}

export default ChileMap;
