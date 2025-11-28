"use server";
import { supabase } from "@/lib/supabase-server";
import Link from "next/link";

export default async function MissionsPage() {
  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    throw error;
  }

  const imageUrl = `https://twfebreuxttgjfydquft.supabase.co/storage/v1/object/public/missions-images/`;

  return (
    <article>
      <h1 className="text-4xl font-bold">Todas las Misiones Disponibles</h1>
      <section className="flex pt-5 pb-5 flex-wrap gap-5">
        {data.map((mission) => (
          <div
            key={mission.id}
            className="w-60 flex flex-col gap-5 justify-center items-center rounded-xl overflow-hidden pb-5 shadow-md hover:shadow-lg transition-shadow border border-gray-300 "
          >
            <div
              className="w-full h-50 flex justify-center items-end p-5"
              style={{
                backgroundImage: `url(${imageUrl}${mission.id}/${mission.id}.webp)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "100%",
              }}
            >
              <h2 className="text-white font-bold text-xl">{mission.title}</h2>
            </div>
            <Link href={`/missions/${mission.id}`} className="w-7/8 p-2 bg-primarygreen text-white font-bold rounded-xl text-center hover:bg-primarygreen/80 transition-colors cursor-pointer ">
              Ver Mision
            </Link>
          </div>
        ))}
      </section>
    </article>
  );
}
