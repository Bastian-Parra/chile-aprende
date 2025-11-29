import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { missionId, part } = body;

  if (!missionId || !part) {
    return new Response("Missing fields", { status: 400 });
  }

  const { data: progress, error: progressError } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (progressError || !progress) {
    return new Response("Progress not found", { status: 404 });
  }

  // game_state es un objeto de partes completadas
  const updatedState = {
    ...progress.game_state,
    [part]: "completed",
  };

  const { error } = await supabase
    .from("user_progress")
    .update({
      game_state: updatedState,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return new Response("DB update error", { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
