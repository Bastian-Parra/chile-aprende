"use client";

import Link from "next/link";

interface Option {
  id: string;
  label: string;
  type: string;
}

interface MissionOptionsProps {
  options: Option[];
  gameState: Record<string, string>;
  missionId: string;
  missionCompleted: boolean;
}

export function MissionOptions({
  options,
  gameState,
  missionId,
  missionCompleted,
}: MissionOptionsProps) {
  // ------------------------------------------------------
  // SI LA MISIÓN COMPLETA → MOSTRAR BOTÓN FINALIZAR
  // ------------------------------------------------------
  if (missionCompleted) {
    const handleFinish = async () => {
      const res = await fetch(`/api/missions/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ missionId }),
      });

      const data = await res.json();
      if (data.redirect) {
        window.location.href = data.redirect;
      }
    };

    return (
      <div className="flex flex-col w-full gap-4 mt-6">
        <button
          onClick={handleFinish}
          className="w-full p-4 rounded-lg bg-primarygreen text-white font-bold text-xl hover:bg-green-700 transition-all"
        >
          Finalizar misión ✓
        </button>
      </div>
    );
  }

  // ------------------------------------------------------
  // SI LA MISIÓN NO ESTÁ COMPLETA → MOSTRAR OPCIONES
  // ------------------------------------------------------
  return (
    <div className="flex flex-col w-full gap-4 mt-6">
      {options.map((opt) => {
        const isCompleted = gameState[opt.id] === "completed";

        return (
          <button
            key={opt.id}
            disabled={isCompleted}
            className={`
              w-full p-4 rounded-lg text-lg font-semibold transition-all
              ${
                isCompleted
                  ? "bg-gray-600/50 text-gray-300 cursor-not-allowed border border-gray-500"
                  : "bg-white text-black hover:bg-gray-200 cursor-pointer"
              }
            `}
            onClick={() => {
              if (isCompleted) return;
              window.location.href = `/missions/${missionId}/start/${opt.id}`;
            }}
          >
            <div className="flex justify-between items-center w-full">
              <span>{opt.label}</span>

              {isCompleted && (
                <span className="text-green-400 font-bold text-xl">✓</span>
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
}
