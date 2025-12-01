"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useState } from "react";
import Image from "next/image";

export default function Profile() {
  const { user } = useUser();

  const [profile, setProfile] = useState<{
    level: number;
    totalXp: number;
    nextLevelXp: number;
    xpInCurrentLevel: number;
    completed: any[];
  } | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetch("/api/user/profile");
      const json = await res.json();
      setProfile(json);
    };

    loadData();
  }, []);

  if (!user) return null;

  return (
    <>
      <h1 className="text-4xl font-extrabold mb-6">Mi progreso</h1>

      {/* ================= HEADER ================= */}
      <header className="shadow-xl overflow-hidden rounded-2xl border border-gray-100">
        <div className="w-full h-80 flex gap-10 items-center p-6">

          {/* FOTO */}
          <div
            className="h-full w-2/7 bg-amber-50 rounded-bl-2xl rounded-tl-2xl overflow-hidden"
            style={{
              backgroundImage: `url(${user.imageUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* INFO */}
          <div className="flex flex-col gap-3">
            <h2 className="text-3xl font-bold">{user.fullName}</h2>
            <p className="text-md">{user.emailAddresses[0].emailAddress}</p>

            {/* NIVEL */}
            {profile && (
              <>
                <p className="text-lg font-semibold">
                  Nivel {profile.level}
                </p>

                {/* Barra XP */}
                <div className="w-96 h-4 bg-gray-300 rounded">
                  <div
                    className="h-full bg-green-500 rounded"
                    style={{
                      width: `${(profile.xpInCurrentLevel / profile.nextLevelXp) * 100}%`,
                    }}
                  ></div>
                </div>

                <p className="text-sm text-gray-600">
                  {profile.xpInCurrentLevel} / {profile.nextLevelXp} XP
                </p>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ================= MISIONS COMPLETED ================= */}
      <h2 className="text-3xl font-bold mt-10 mb-4">Misiones completadas</h2>

      {!profile?.completed?.length && (
        <p className="text-gray-500">Aún no has completado ninguna misión.</p>
      )}

      <div className="grid grid-cols-3 gap-6">
        {profile?.completed?.map((mission) => (
          <div
            key={mission.id}
            className="border rounded-xl shadow-lg bg-white overflow-hidden hover:scale-[1.02] transition"
          >
            {/* Imagen */}
            <div className="h-40 w-full relative">
              <Image
                src={mission.mission_data?.start_bg}
                alt={mission.mission_data?.intro?.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Texto */}
            <div className="p-4">
              <h3 className="text-xl font-bold">
                {mission.mission_data?.intro?.title}
              </h3>
              <p className="text-sm text-gray-600">{mission.region}</p>

              <a
                href={`/missions/${mission.id}`}
                className="mt-3 inline-block text-blue-500 font-semibold"
              >
                Ver misión →
              </a>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
