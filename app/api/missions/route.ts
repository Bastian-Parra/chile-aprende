import { supabase } from "@/lib/supabase-server";

export async function GET() {
  const { data, error } = await supabase
    .from("missions")
    .select("id, region, title, image_url, difficulty");

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
