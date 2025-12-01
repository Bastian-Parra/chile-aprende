import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function GET() {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  let { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  // si no existe → crearlo correctamente
  if (!progress) {
    const { data: created } = await supabase
      .from("user_progress")
      .insert({
        user_id: userId,
        total_xp: 0,
        completed_missions: [],
        game_state: {},
        unlocked_achievements: {},
      })
      .select()
      .single();

    progress = created;
  }

  const totalXp = progress.total_xp ?? 0;

  // nivel basado en XP total
  const level = Math.floor(totalXp / 100) + 1;

  // xp dentro del nivel actual (para la barra)
  const xpInCurrentLevel = totalXp % 100;

  const nextLevelXp = 100;

  const completeIdsRaw = progress.completed_missions

  // obtener misiones completadas
  const completedIds = Array.isArray(completeIdsRaw) ? completeIdsRaw : []

  const { data: missions } = await supabase
    .from("missions")
    .select("id, mission_data, region")
    .in("id", completedIds);

  return Response.json({
    level,
    totalXp,
    xpInCurrentLevel,
    nextLevelXp,
    completed: missions ?? [],
  });
}
