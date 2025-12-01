import { supabase } from "../supabase-server";
import type { UserProgressRow } from "@/types/userProgress";

export async function getUserProgress(userId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle<UserProgressRow>();

  if (error) throw error;

  return data;
}

export async function getUserLevelData(userId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("total_xp, level")
    .eq("user_id", userId)
    .single();

  if (error || !data) return null;

  const { total_xp, level } = data;

  const nextLevelXp = level * 100; // fórmula simple
  const progress = Math.min(total_xp / nextLevelXp, 1);

  return {
    level,
    totalXp: total_xp,
    nextLevelXp,
    progress,
  };
}
