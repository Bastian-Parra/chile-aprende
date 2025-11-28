import { supabase } from "../supabase-server";
import { getUserProgress } from "./userProgress";

export async function completeMission(
  userId: string,
  missionId: string,
  rewardXp: number
) {
  const progress = await getUserProgress(userId);

  // si no hay fila, se crea con la mision ya completada

  if (!progress) {
    const { error } = await supabase.from("user_progress").insert({
      user_id: userId,
      level: 1,
      total_xp: rewardXp,
      game_state: {
        [`mission:${missionId}`]: { exploration_done: true },
      },
      unlocked_achievements: [],
      completed_missions: [missionId],
    });

    if (error) throw error
    return
  }

  const completed = progress.completed_missions ?? []
  const gameState = progress.game_state ?? {}
  const unlocked = progress.unlocked_achievements ?? []

  const alreadyCompleted = completed.includes(missionId)
  const newCompleted = alreadyCompleted ? completed : [...completed, missionId]

  const newTotalXp = progress.total_xp + (alreadyCompleted ? 0 : rewardXp)

  const newGameState = {
    ...gameState,
    [`mission:${missionId}`]: {
      ...(gameState[`mission:${missionId}`] as Record<string, unknown> | undefined ),
      exploration_done: true
    },
  }

  const { error: updateError } = await supabase.from("user_progress").update({
    total_xp: newTotalXp,
    completed_missions: newCompleted,
    game_state: newGameState,
    unlocked_achievements: unlocked,
  }).eq("user_id", userId)

  if (updateError) throw updateError
}
