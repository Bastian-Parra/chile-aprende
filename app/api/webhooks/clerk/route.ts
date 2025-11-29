import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase-server";
import { WebhookEvent } from "@clerk/nextjs/server";

export async function POST(req: Request) {
  const payload = await req.text();
  const headersList = await headers();
  const svix_id = headersList.get("svix-id");
  const svix_timestamp = headersList.get("svix-timestamp");
  const svix_signature = headersList.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "No svix headers" }, { status: 400 });
  }

  const wh = new Webhook(process.env.CLERK_WEBHOOK_SECRET!);

  let event;
  try {
    event = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying signature:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Evento recibido desde Clerk
  const { type, data } = event as WebhookEvent;

  if (type === "user.created") {
    const { id, email_addresses, first_name, last_name } = data;
    const email = email_addresses[0]?.email_address;

    // Crear usuario en Supabase
    const { error } = await supabase.from("users").insert([
      {
        id,
        email,
        username: first_name + " " + last_name,
      },
    ]);

    await supabase.from("user_progress").insert([
      {
        user_id: id,
        level: 1,
        total_xp: 0,
        game_state: {},
        completed_missions: {},
        unlocked_achievements: {},
      },
    ]);

    if (error) {
      console.error("Error inserting user:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
