"use client";

import Image from "next/image";

interface HudResourceProps {
  icons: Record<string, string>;
  counters: Record<string, number>;
}

export default function HudResources({ icons, counters }: HudResourceProps) {
  return (
        <div className="absolute top-5 right-5 flex flex-col gap-3 bg-black/40 p-4 rounded-xl shadow-lg">
      {Object.entries(counters).map(([key, value]) => (
        <div key={key} className="flex items-center gap-2 text-white">
          <Image
            src={icons[key]}
            alt={key}
            width={32}
            height={32}
            className="w-8 h-8 object-contain rounded-full"
          />
          <span className="text-lg font-semibold">{value}</span>
        </div>
      ))}
    </div>
  );
}
