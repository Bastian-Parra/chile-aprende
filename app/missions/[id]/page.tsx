"use server";
import { supabase } from "@/lib/supabase-server";
import Image from "next/image";

interface Mission {
  id: string;
  title: string;
  description: string;
  image_url: string;
}

export default async function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const missionId = (await params).id;

  console.log("id:", missionId);

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId);

  console.log(data);

  if (error) {
    throw error;
  }

  return (
    data.map((mission: Mission, index) => (
      <div key={index}>
        <h1>{mission.title}</h1>
        <p>{mission.description}</p>
        <Image src={`https://twfebreuxttgjfydquft.supabase.co/storage/v1/object/public/missions-images/${mission.id}.webp`} alt={mission.title} width={250} height={250} />
      </div>
    ))
  )
}
