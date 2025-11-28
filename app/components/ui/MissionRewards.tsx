'use client'

import Link from "next/link";
import { MissionsIcons } from "../icons/MissionsIcons";

export default function MissionRewards({
  xp,
  items,
  id
}: {
  xp: number;
  items: string[];
  id: string
}) {
  console.log(items);
  return (
    <div className="flex flex-col gap-5 justify-center items-center border border-gray-200 rounded-xl p-5 shadow-xl w-full">
      <h1 className="text-xl font-bold">Recompensas</h1>
      <div className="flex gap-3 items-center font-bold">
        <span className="bg-[#fff7cc] p-2 rounded-full text-[#ffd802]">
          <MissionsIcons.star />
        </span>
        <div className="flex flex-col">
          <p className="text-md">+{xp}</p>
          <p className="text-sm font-normal">Puntos de Experiencia</p>
        </div>
      </div>

      {/* TODO: Terminar esta parte de los items de recompensas */}
      <div>
        <span></span>
      </div>

      <Link href={`/missions/${id}/start`} className="bg-[#1e90ff] w-full p-2 rounded-md text-white font-bold hover:bg-[#1e90ff]/80 transition-colors cursor-pointer flex gap-2 justify-center items-center">
        <span>
          <MissionsIcons.rocket />
        </span>
        Comenzar Misión
      </Link>
    </div>
  );
}
