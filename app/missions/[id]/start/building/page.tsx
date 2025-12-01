"use server";

import BuildScreen from "@/app/components/missions/build/BuildScreen";
import { supabase } from "@/lib/supabase-server";
import { MissionData } from "@/types/missions";

export default async function BuildPage({
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
    return <p>Error al cargar la misión.</p>;
  }

  const missionData = data.mission_data as MissionData;

  // ============================
  // EXTRAER BLOQUE DE BUILDING
  // ============================

  console.log(missionData.building);
  const building = missionData.building;

  if (!building) {
    return <p>Esta misión no tiene sistema de construcción.</p>;
  }

  return (
    <BuildScreen
      missionId={id}
      building={{
        background: building.background,
        steps: building.steps,
      }}
      icons={missionData.hud.resource_icons}
    />
  );
}
