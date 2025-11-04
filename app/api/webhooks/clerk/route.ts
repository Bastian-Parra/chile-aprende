import { supabase } from "@/app/lib/supabase";

export async function POST(req: Request) {
  try {
    const payload = await req.json()

    if(payload.type === 'user.created') {
      await supabase.from('users').upsert({
        id: payload.data.id,
        email: payload.data.email_address[0]?.email_address,
        username: payload.data.username
      })

      await supabase.from('user_progress').upsert({
        user_id: payload.data.id,
        level: 1,
        total_xp: 0,
        game_state: {},
        completed_missions: {},
        unlocked_achievements: {}
      })
    }

    return new Response('OK', { status: 200 })
  } catch (error) {
    console.error(error)
    return new Response('Error', { status: 500 })
  }
}