"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

interface Dialogue {
  text: string;
  background: string;
}

interface SearchData {
  background: string;
  dialogues: Dialogue[];
}

export default function SearchColonistsScreen({
  missionId,
  searchData,
}: {
  missionId: string;
  searchData: SearchData;
}) {
  const { dialogues } = searchData;
  const [index, setIndex] = useState(0);

  const bg = dialogues[index].background


  const handleNext = () => {
    if (index < dialogues.length - 1) {
      setIndex((prev) => prev + 1);
    } else {
      completeSearch();
    }
  };

  const completeSearch = async () => {
    try {
      await fetch("/api/missions/complete-part", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          missionId,
          part: "search",
        }),
      });

      window.location.href = `/missions/${missionId}/start`;
    } catch (e) {
      console.error("Error completing search:", e);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fondo */}
      <Image
        src={bg}
        alt="Buscar colonos"
        fill
        className="object-cover transition-opacity duration-500"
      />

      {/* Panel de diálogo */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white p-8">
        <p className="text-lg mb-4">
          {dialogues[index].text}
        </p>

        <button
          onClick={handleNext}
          className="bg-white text-black px-6 py-2 rounded font-bold hover:bg-gray-200 hover:cursor-pointer"
        >
          {index < dialogues.length - 1 ? "Siguiente →" : "Finalizar ✓"}
        </button>
      </div>
    </div>
  );
}
