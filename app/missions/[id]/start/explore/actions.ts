"use server";

import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function markExplorationCompleted(missionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("No estás autenticado");
  }

  // 1. Obtener misión para leer reward_xp
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("mission_data")
    .eq("id", missionId)
    .single();

  if (missionError || !mission) {
    throw new Error("No se pudo cargar la misión");
  }

  const rewardXP = mission.mission_data.completion.reward_xp ?? 0;

  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  console.log(userId);

  console.log("Progreso: ", progress);

  if (!progress) throw new Error("Progreso no encontrado");

  const updatedState = {
    ...progress.game_state,
    exploration: "completed",
  };

  const newXP = progress.total_xp + rewardXP;

  await supabase
    .from("user_progress")
    .update({
      total_xp: newXP,
      game_state: updatedState,
    })
    .eq("user_id", userId);

  return { ok: true };
}
