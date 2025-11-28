import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { auth } from "@clerk/nextjs/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { success: false, message: "No autorizado" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const missionPart = body.part;

  const { data, error } = await supabase
    .from("user_progress")
    .select("completed_missions")
    .eq("user_id", userId)
    .single();

  if (error) {
    return NextResponse.json({ success: false, message: "DB Error" });
  }

  const completed = data.completed_missions || []; // array de misiones completadas

  if (!completed.includes(`${params.id}:${missionPart}`)) {
    // si no tiene la parte de la mision ej: exploration
    completed.push(`${params.id}:${missionPart}`);
  }

  await supabase
    .from("user_progress")
    .update({ completed_missions: completed })
    .eq("user_id", userId);

  return NextResponse.json({ success: true });
}
