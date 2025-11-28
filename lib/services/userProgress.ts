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
