import { getUserBaseInfo } from "@/lib/services/userState";
import { supabase } from "@/lib/supabase-server";
import { getAuth } from "@clerk/nextjs/server";

/* 
explicacion del codigo:
esta ruta es para completar una mision, es decir, cuando el usuario termina una mision, 
se actualiza su progreso en la base de datos y es similar a cuando usamos express donde hay que crear
archivo rutas y todo eso, aqui se crea una ruta por archivo ya que asi funciona nextjs pages/api
*/

import type { NextApiRequest, NextApiResponse } from "next";

type ResponseData = {
  success: boolean;
  message: string;
};

export default async function completeMissionHandler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  if (req.method !== "POST") {
    return res.status(401).json({
      success: false,
      message: "Metodo no permitido",
    });
  }

  const { userId } = getAuth(req); // obtenemos el id del usuario que nos trae clerk

  if (!userId) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  const { missionId } = req.body;

  if (!missionId) {
    return res.status(404).json({
      success: false,
      message: "Mision no encontrada o falta la missionId en el body",
    });
  }

  const user = await getUserBaseInfo(userId); // obtenemos la informacion base del usuario

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "Usuario no encontrado",
    });
  }

  // aqui hacemos la consulta a la base de datos para obtener la mision
  const { data: mission, error: missionError } = await supabase
    .from("missions")
    .select("*")
    .eq("id", missionId)
    .single();

  if (missionError || !mission) {
    return res.status(404).json({
      success: false,
      message: "Mision no encontrada",
    });
  }

  // se calcula el xp ganado con el reward_xp que viene de la db
  const gainedXP = mission.xp_reward ?? 20;
  const newTotalXP = user.total_xp + gainedXP;

  // se calcula el xp necesario para el siguiente nivel
  const nextLevelXP = (user.level + 1) * (user.level + 1) * 50;
  const shouldLevelUp = newTotalXP >= nextLevelXP;
  const newLevel = shouldLevelUp ? user.level + 1 : user.level;

  // se agrega la mision a completed_missions
  const updatedCompletedMissions = [
    ...user.completed_missions,
    {
      id: missionId,
      completed_at: new Date().toISOString(),
      score: req.body.score ?? null,
      attempts: req.body.attempts ?? null,
      extra: req.body.extra ?? null,
    },
  ];

  // se guardan los datos en supabase para mantener consistencia y guardado de datos
  const { error: updateError } = await supabase
    .from("user_progress")
    .update({
      total_xp: newTotalXP,
      level: newLevel,
      completed_missions: updatedCompletedMissions,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  if (updateError) {
    return res.status(500).json({
      success: false,
      message: "Error al actualizar el progreso del usuario",
    });
  }

  return res.status(200).json({
    success: true,
    message: "Mision completada exitosamente",
  });
}
