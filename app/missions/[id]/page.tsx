"use server";
import { supabase } from "@/lib/supabase-server";
import MissionSubtitle from "@/app/components/ui/MissionSubtitle";
import Difficulty from "@/app/components/ui/Difficulty";
import MissionObjectives from "@/app/components/ui/MissionObjectives";
import MissionVideo from "@/app/components/ui/MissionVideo";
import { Suspense } from "react";
import MissionRewards from "@/app/components/ui/MissionRewards";

interface Mission {
  id: string;
  title: string;
  description: string;
  image_url: string;
  difficulty: string;
  xp_reward: number;
  rewards: {
    bonus_xp: number;
    items: string[];
  }[];
  subtitle: string;
  learning_objectives: string[];
  multimedia: string[];
}

export default async function MissionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const missionId = (await params).id

  const { data, error } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId);

  if (error) {
    throw error;
  }

  return data.map((mission: Mission, index) => (
    <article key={index} className="flex flex-col gap-10">
      <div className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-extrabold">{mission.title}</h1>
          <Difficulty difficulty={mission.difficulty} />
        </div>
        <p className="text-xl">{mission.subtitle}</p>
      </div>
      <div className="flex gap-5">
        <section className="flex flex-col gap-5 w-4/5">
          <MissionSubtitle title="Descripción de la Misión" />
          <p className="text-xl">{mission.description}</p>
          <MissionSubtitle title="Objetivos de Aprendizaje" />
          {Object.entries(mission.learning_objectives).map(
            (objective, index) => (
              <MissionObjectives key={index} text={objective[1]} />
            )
          )}
          <MissionSubtitle title="Recursos Multimedia" />
          <Suspense fallback={<p>Cargando video...</p>}>
            <div className="flex gap-5">
              {Object.entries(mission.multimedia).map((video_url, index) => (
                <MissionVideo src={video_url[1]} key={index} />
              ))}
            </div>
          </Suspense>
        </section>
        <section className="w-1/4">
          {/* TODO: Terminar esta parte de los items de recompensas */}
          <MissionRewards
            id={missionId}
            xp={mission.xp_reward}
            items={
              Array.isArray(mission.rewards)
                ? mission.rewards.flatMap((reward) => reward.items || [])
                : []
            }
          />
        </section>
      </div>
    </article>
  ));
}
