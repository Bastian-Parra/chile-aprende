"use server";

import { supabase } from "@/lib/supabase-server";
import SearchColonistsScreen from "@/app/components/missions/search/SearchColonistScreen";
import { MissionData } from "@/types/missions";

export default async function SearchPage({
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

  if (!missionData.search) {
    return <p>Esta misión no tiene búsqueda de colonos.</p>;
  }

  return (
    <SearchColonistsScreen
      missionId={id}
      searchData={missionData.search}
    />
  );
}
