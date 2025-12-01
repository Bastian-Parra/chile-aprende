import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";
import { MissionOptions } from "@/app/components/missions/MissionOptions";

interface Options {
  id: string; // <-- usa string porque en tu JSON los IDs no son números
  label: string;
  type: string;
}

export default async function MissionStartPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { userId } = await auth();

  // 1. Misión
  const { data: mission, error } = await supabase
    .from("missions")
    .select("mission_data")
    .eq("id", id)
    .single();

  if (error) throw error;

  // 2. Progreso del usuario
  const { data: progress } = await supabase
    .from("user_progress")
    .select("game_state")
    .eq("user_id", userId)
    .single();

  const gameState = progress?.game_state ?? {};

  const { intro, start_bg } = mission.mission_data;

  const allPartsCompleted = gameState.exploration === "completed" && gameState.building === "completed" && gameState.search === "completed"

  // ----------------------------------------------
  // 🔥 FILTRAR OPCIONES BASADO EN game_state
  // ----------------------------------------------
  const remainingOptions = intro.options.filter((option: Options) => {
    // Si tiene game_state["exploration"] === "completed"
    // entonces bloquear opción cuyo id sea "exploration"
    const isCompleted = gameState[option.id] === "completed";
    return !isCompleted;
  });

  return (
    <section
      className="w-full h-screen flex items-center justify-center flex-col"
      style={{
        background: `url(${start_bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <header className="w-1/2 justify-center items-center text-center flex flex-col gap-5 bg-black/40 p-10 rounded-2xl hover:bg-black/60 transition-colors">
        <h1 className="text-4xl font-bold text-white">{intro.title}</h1>
        {allPartsCompleted && (
          <p className="text-primarygreen text-2xl">¡Misión completada!</p>
        )}
        <p className="text-white text-xl">{intro.text}</p>
        <p className="text-blue-300 text-xl">{intro.question}</p>

        <MissionOptions
          options={intro.options}
          gameState={gameState}
          missionId={id}
          missionCompleted={allPartsCompleted}
        />
      </header>
    </section>
  );
}
