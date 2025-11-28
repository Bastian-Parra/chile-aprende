// app/api/missions/complete/route.ts
import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const body = await req.json();
  const { missionId, stage, rewardXP } = body;

  // progreso del usuario
  const { data: progress } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId)
    .single();

  const completed = progress.completed_missions || [];

  completed.push({
    id: `${missionId}:${stage}`,
    completed_at: new Date().toISOString(),
  });

  const newXP = progress.total_xp + rewardXP;

  const { error } = await supabase
    .from("user_progress")
    .update({
      total_xp: newXP,
      completed_missions: completed,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (error) return new Response("DB Error", { status: 500 });

  return new Response(JSON.stringify({ ok: true }), { status: 200 });
}
