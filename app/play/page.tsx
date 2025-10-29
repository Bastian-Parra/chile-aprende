// pages/map-page.tsx
"use client";

import React from "react";
import ChileMap from "../components/map/ChileMap3D";

const MapPage: React.FC = () => {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-5 items-center">
        <h1 className="text-5xl font-extrabold">
          Explora Chile y vive su Historia
        </h1>
        <p className="text-xl">
          Completa misiones, aprende sobre nuestro país y compite por ser el
          mejor.
        </p>
        <ChileMap />
      </div>
    </div>
  );
};

export default MapPage;
