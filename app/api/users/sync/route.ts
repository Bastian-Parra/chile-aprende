import { supabase } from "@/lib/supabase";
import { currentUser } from "@clerk/nextjs/server";

export async function POST() {
  console.log("llamada a api");
  try {
    const user = await currentUser();

    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    await supabase.from("users").upsert({
      id: user.id,
      email: user.primaryEmailAddress?.emailAddress,
      username: user.username || user.firstName,
    });

    await supabase.from("user_progress").upsert({
      user_id: user.id,
      level: 1,
      total_xp: 0,
      game_state: {},
      completed_missions: {},
      unlocked_achievements: [],
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error("Sync error:", error);
    return Response.json({ error: "Sync failed" }, { status: 500 });
  }
}
