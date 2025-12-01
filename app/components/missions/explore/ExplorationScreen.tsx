"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import ResourceItem from "./ResourceItem";
import HudResources from "./HudResource";
import { toast } from "../../messages/Toast";
import { useUser } from "@clerk/nextjs";

interface Resource {
  id: string;
  type: string;
  x: number;
  y: number;
  screen: number;
}

interface ExplorationProps {
  missionId: string;
  mapData: {
    backgrounds: string[];
    resources: Resource[];
    icons: Record<string, string>;
  };
  objective: Record<string, number>;
}

export default function ExplorationScreen({
  missionId,
  mapData,
  objective,
}: ExplorationProps) {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [resources, setResources] = useState(mapData.resources);
  const [collected, setCollected] = useState(() =>
    Object.fromEntries(Object.keys(objective).map((k) => [k, 0]))
  );

  const totalScreens = mapData.backgrounds.length;

  const { user } = useUser();

  const handleCollect = (type: string, id: string) => {
    setCollected((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));

    setResources((prev) => prev.filter((r) => r.id !== id));

    toast("Recurso recogido", { type: "success" });
  };

  const screenResources = resources.filter((r) => r.screen === currentScreen);

  useEffect(() => {
    const goals = objective;
    const allReached = Object.keys(goals).every(
      (key) => collected[key] >= goals[key]
    );

    if (!allReached) return;

    if (!user) return

    const storageKey = `collected_resources_${user.id}`;

    localStorage.setItem(storageKey, JSON.stringify(collected));

    const finishExploration = async () => {
      try {
        await fetch(`/api/missions/complete-part`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ missionId, part: "exploration" }),
        });

        window.location.href = `/missions/${missionId}/start`; // redirige al usuario al inicio de la misión
      } catch (error) {
        console.error("Error completing exploration:", error);
      }
    };

    finishExploration();
  }, [collected, missionId, objective]);

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo */}
      <Image
        src={mapData.backgrounds[currentScreen]}
        alt="Scene"
        fill
        className="object-cover"
      />

      {/* Recursos */}
      {screenResources.map((item) => (
        <ResourceItem
          key={item.id}
          item={item}
          icons={mapData.icons}
          onCollect={handleCollect}
        />
      ))}

      {/* HUD */}
      <HudResources counters={collected} icons={mapData.icons} />

      {/* Navegación */}
      {currentScreen > 0 && (
        <button
          onClick={() => setCurrentScreen((c) => c - 1)}
          className="absolute left-5 top-1/2 text-white bg-black/40 px-4 py-2 rounded-full"
        >
          ←
        </button>
      )}

      {currentScreen < totalScreens - 1 && (
        <button
          onClick={() => setCurrentScreen((c) => c + 1)}
          className="absolute right-5 top-1/2 text-white bg-black/40 px-4 py-2 rounded-full"
        >
          →
        </button>
      )}
    </div>
  );
}
