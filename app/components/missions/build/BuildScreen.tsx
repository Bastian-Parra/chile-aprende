"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import HudResources from "../explore/HudResource"; // reutilizas el HUD
import { useUser } from "@clerk/nextjs";

interface BuildStep {
  id: string;
  label: string;
  required: Record<string, number>;
}

interface BuildProps {
  missionId: string;
  building: {
    background: string;
    steps: BuildStep[];
  };
  icons: Record<string, string>;
}

export default function BuildScreen({
  missionId,
  building,
  icons,
}: BuildProps) {
  const { background, steps } = building;
  const { user } = useUser();

  // Estado local de pasos completados
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>(
    {}
  );

  // Estado de recursos recolectados (igual que exploración)
  const initialCollected = Object.fromEntries(
    Array.from(new Set(steps.flatMap((s) => Object.keys(s.required)))).map(
      (k) => [k, 0]
    )
  );

  const [collected, setCollected] =
    useState<Record<string, number>>(initialCollected);

  // aqui vemos si tiene recursos suficientes
  const hasRequired = (req: Record<string, number>) => {
    return Object.keys(req).every((key) => {
      return (collected[key] || 0) >= req[key];
    });
  };

  const handleStepClick = (step: BuildStep) => {
    if (!hasRequired(step.required)) {
      alert("No tienes suficientes recursos para este paso.");
      return;
    }

    // Consumir recursos
    setCollected((prev) => {
      const updated = { ...prev };
      Object.keys(step.required).forEach((k) => {
        updated[k] = updated[k] - step.required[k];
      });

      if (user) {
        const storageKey = `collected_resources_${user.id}`;
        localStorage.setItem(storageKey, JSON.stringify(updated));
      }

      return updated;
    });

    setCompletedSteps((prev) => ({
      ...prev,
      [step.id]: true,
    }));
  };

  useEffect(() => {
    const loadSaveData = () => {
      if (!user) return;

      const storageKey = `collected_resources_${user.id}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          setCollected(parsed);
        } catch (error) {
          console.error("Error al cargar datos de guardado", error);
        }
      }
    };
    loadSaveData();
  }, [user]);

  useEffect(() => {
    const allDone = steps.every((s) => completedSteps[s.id]);
    if (!allDone) return;

    const finishBuild = async () => {
      await fetch("/api/missions/complete-part", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          missionId,
          part: "building",
        }),
      });

      window.location.href = `/missions/${missionId}/start`;
    };

    finishBuild();
  }, [completedSteps, steps, missionId]);

  // =====================================
  // RENDER
  // =====================================
  return (
    <div className="relative w-full h-screen overflow-hidden flex ">
      {/* Fondo */}
      <Image src={background} alt="build-bg" fill className="object-cover" />

      {/* HUD */}
      <HudResources counters={collected} icons={icons} />

      {/* Panel de construcción */}
      <div className="absolute bottom-5 left-5 right-0 bg-white/85 p-6 rounded-t-xl shadow-lg flex flex-col rounded-2xl h-80 w-1/5">
        <h2 className="text-xl font-bold mb-4">Construcción del Refugio</h2>

        {steps.map((step, index) => {
          const isCompleted = completedSteps[step.id];
          const isNext =
            index === 0 || completedSteps[steps[index - 1].id] === true;

          return (
            <button
              key={step.id}
              onClick={() => handleStepClick(step)}
              disabled={!isNext || isCompleted || !hasRequired(step.required)}
              className={`
                w-full p-3 mb-3 rounded border text-left
                ${
                  isCompleted
                    ? "bg-green-600 text-white border-green-700"
                    : isNext && hasRequired(step.required)
                    ? "bg-blue-600 text-white border-blue-700"
                    : "bg-gray-300 text-gray-600 border-gray-400 cursor-not-allowed"
                }
              `}
            >
              {step.label} {isCompleted && "✔"}
            </button>
          );
        })}
      </div>
    </div>
  );
}
