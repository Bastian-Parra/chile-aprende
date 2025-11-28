import { supabase } from "@/lib/supabase-server";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";

interface Options {
  id: number;
  label: string;
}

export default async function MissionStartPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const { userId } = await auth();

  const { data: mission, error } = await supabase
    .from("missions")
    .select("mission_data")
    .eq("id", id)
    .single();

  const { data: progress } = await supabase
    .from("user_progress")
    .select("completed_missions")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw error;
  }

  const completed = progress?.completed_missions ?? [];

  const { hud, map, intro, objective, completion, start_bg } =
    mission.mission_data;

  const remainingOptions = intro.options.filter((option: Options) => {
    return !completed.includes(`${id}:${option.id}`);
  });

  return (
    <section className="w-full h-screen flex items-center justify-center flex-col" style={{
      background: `url(${start_bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}>
      <h1 className="text-4xl font-bold">{intro.title}</h1>
      <p>{intro.text}</p>
      <p>{intro.question}</p>

      <div className="flex flex-col gap-5">
        {remainingOptions.length === 0 && <p>Misión completada ✔</p>}

        {remainingOptions.map((option: Options) => (
          <Link
            key={option.id}
            href={`/missions/${id}/start/${option.id}`}
            className="p-2 bg-primarygreen text-white font-bold rounded-md min-w-md cursor-pointer hover:bg-primarygreen/80 transition-colors text-center"
          >
            {option.label}
          </Link>
        ))}
      </div>
    </section>
  );
}
