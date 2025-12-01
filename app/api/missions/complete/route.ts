import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const { missionId } = await req.json();

  // 1. Obtener mission_data para saber XP
  const { data: mission } = await supabase
    .from("missions")
    .select("mission_data, id")
    .eq("id", missionId)
    .single();

  if (!mission)
    return new Response("Mission not found", { status: 404 });

  const rewardXp =
    mission.mission_data?.completion?.reward_xp || 0;

  // 2. Obtener progreso actual
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (!progress)
    return new Response("Progress not found", { status: 404 });

  const completed = Array.isArray(progress.completed_missions)
    ? progress.completed_missions
    : [];

  const updatedCompleted = completed.includes(missionId)
    ? completed
    : [...completed, missionId];

  const newTotalXp = (progress.total_xp || 0) + rewardXp;

  // 3. Guardar cambios
  await supabase
    .from("user_progress")
    .update({
      completed_missions: updatedCompleted,
      total_xp: newTotalXp,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return new Response(
    JSON.stringify({
      ok: true,
      earned_xp: rewardXp,
      redirect: `/missions/${missionId}/completed`,
    }),
    { status: 200 }
  );
}
