"use client";

import { useEffect, useState } from "react";

interface Data {
  initialData: {
    level: number;
    totalXp: number;
    nextLevelXp: number;
    progress: number;
  } | null
}

export default function UserLevelClient({ initialData }: Data) {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    const interval = setInterval(async () => {
      const res = await fetch("/api/user/level");
      const json = await res.json();
      setData(json);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  if (!data) return null;

  return (
    <div className="flex flex-col w-full">
      <span className="text-sm text-white">Nivel {data.level}</span>

      <div className="w-full h-2 bg-gray-800 rounded mt-1">
        <div
          className="h-full bg-primarygreen rounded transition-all duration-500"
          style={{ width: `${data.progress * 100}%` }}
        />
      </div>

      <span className="text-xs text-gray-300 mt-1">
        {data.totalXp} / {data.nextLevelXp} XP
      </span>
    </div>
  );
}
