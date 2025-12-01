import { supabase } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabase.from("user_progress")
  .select("user_id, total_xp, users:user_id (username,)")
  .order("total_xp", {ascending: false})
  .limit(50)

  if (error) {
    return new Response("Error loading leaderboard", { status: 500 })
  }

  return Response.json(data)
}