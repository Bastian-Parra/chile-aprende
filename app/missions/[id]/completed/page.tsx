import { supabase } from "@/lib/supabase-server";
import Image from "next/image";
import Link from "next/link";
import ConfettiExplosion from "@/app/components/ui/ConfettiExplosion";

export default async function MissionCompletedPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // obtener datos de la misión
  const { data: mission } = await supabase
    .from("missions")
    .select("*")
    .eq("id", id)
    .single();

  const { title, mission_data, image_url} = mission;
  const rewardXp = mission_data?.completion?.reward_xp ?? 0;
  const image = image_url

  return (
    <section className="w-full min-h-screen flex flex-col items-center justify-center text-black px-6">
      
      {image && (
        <div className="w-full max-w-xl mb-10">
          <Image
            src={image}
            alt={title}
            width={1000}
            height={1000}
            className="rounded-lg shadow-xl w-full object-cover"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold mb-4 text-center">
        🎉 ¡Misión completada! 🎉
      </h1>

      <ConfettiExplosion />

      <h2 className="text-2xl mb-6 text-primarygreen text-center">
        {title}
      </h2>

      <div className="bg-black/10 p-6 rounded-xl text-center mb-10 shadow-lg backdrop-blur">
        <p className="text-xl mb-2">Recompensa obtenida:</p>
        <p className="text-3xl font-bold text-yellow-400">{rewardXp} XP</p>
      </div>

      <div className="flex gap-6">
        <Link
          href="/missions"
          className="px-6 py-3 bg-primarygreen rounded-lg text-black font-bold hover:bg-primarygreen/80 transition"
        >
          Ir a Misiones
        </Link>

        <Link
          href="/play"
          className="px-6 py-3 bg-white/20 border border-white rounded-lg font-bold hover:bg-white/30 transition"
        >
          Volver al Mapa
        </Link>
      </div>
    </section>
  );
}
