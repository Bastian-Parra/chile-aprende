"use server";

import { supabase } from "@/lib/supabase-server";
import ExplorationScreen from "@/app/components/missions/explore/ExplorationScreen";
import { MissionData } from "@/types/missions";

export default async function ExplorationPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const { data, error } = await supabase
    .from("missions")
    .select("mission_data")
    .eq("id", id)
    .single();

  if (error || !data) {
    return <p>Error al cargar misión.</p>;
  }

  const missionData = data.mission_data as MissionData;

  // Preparar los datos que ExplorationScreen necesita
  const backgrounds = missionData.scenes.map((scene) => scene.background_image);

  const allResources = missionData.scenes.flatMap((scene, index) =>
    scene.resources.map((r) => ({
      ...r,
      screen: index,
    }))
  );

  return (
    <ExplorationScreen
      missionId={id}
      mapData={{
        backgrounds,
        resources: allResources,
        icons: missionData.hud.resource_icons,
      }}
      objective={missionData.objective.goal}
    />
  );
}
