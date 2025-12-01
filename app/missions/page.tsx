"use server";
import { supabase } from "@/lib/supabase-server";
import Link from "next/link";

export default async function MissionsPage() {
  // se obtienen las misiones totales
  const { data: missions, error } = await supabase
    .from("missions")
    .select("*")
    .order("id", { ascending: true });

  if (error) throw error;

  // aqui se obtiene el progreso del usuario
  const { data: userProgress } = await supabase
    .from("user_progress")
    .select("completed_missions")
    .single();

  const completedRaw = userProgress?.completed_missions;
  const completedIds: string[] = Array.isArray(completedRaw)
    ? completedRaw
    : [];

  const imageUrl =
    "https://twfebreuxttgjfydquft.supabase.co/storage/v1/object/public/missions-images/";

  return (
    <article>
      <h1 className="text-4xl font-bold">Todas las Misiones Disponibles</h1>

      <section className="flex pt-5 pb-5 flex-wrap gap-5">
        {missions.map((mission) => {
          const isCompleted = completedIds.includes(mission.id);
          const difficulty = mission.difficulty ?? "Desconocida";

          const getDifficultyInfo = (difficulty: string) => {
            switch (difficulty) {
              case "easy":
                return { text: "Fácil", color: "green" };
              case "medium":
                return { text: "Media", color: "yellow" };
              case "hard":
                return { text: "Difícil", color: "red" };
              default:
                return { text: "Desconocida", color: "gray" };
            }
          };

          const difficultyInfo = getDifficultyInfo(difficulty);

          return (
            <div
              key={mission.id}
              className={`w-60 flex flex-col gap-5 justify-center items-center rounded-xl overflow-hidden pb-5 shadow-md border transition-all
                ${
                  isCompleted
                    ? "border-green-500 shadow-green-300"
                    : "border-gray-300 hover:shadow-lg"
                }
              `}
            >
              {/* Imagen */}
              {/* Imagen */}
              <div
                className="w-full h-50 flex justify-between items-end p-5 relative"
                style={{
                  backgroundImage: `url(${imageUrl}${mission.id}/${mission.id}.webp)`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "100%",
                }}
              >
                {/* Etiqueta de dificultad */}
                <span
                  className={`
      absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold
      ${
        difficultyInfo.color === "green"
          ? "bg-green-200/90 text-green-800"
          : difficultyInfo.color === "yellow"
          ? "bg-yellow-200/90 text-yellow-800"
          : difficultyInfo.color === "red"
          ? "bg-red-200/90 text-red-800"
          : "bg-gray-200/90 text-gray-800"
      }
      shadow-md backdrop-blur-sm
    `}
                >
                  {difficultyInfo.text}
                </span>

                <h2 className="text-white font-bold text-xl drop-shadow-lg">
                  {mission.title}
                </h2>

                {isCompleted && (
                  <span className="absolute top-3 left-3 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-md">
                    ✔ Completada
                  </span>
                )}
              </div>

              <Link
                href={`/missions/${mission.id}`}
                className="
                  w-7/8 p-2 bg-primarygreen text-white font-bold
                  rounded-xl text-center hover:bg-primarygreen/80 transition-colors
                "
              >
                Ver Misión
              </Link>
            </div>
          );
        })}
      </section>
    </article>
  );
}
