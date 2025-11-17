import { supabase } from "../supabase-server";

// interface para el progreso del usuario
interface UserProgress {
  user_id: string;
  level: number;
  total_xp: number;
  game_state: Record<string, unknown>;
  unlocked_achievements: string[];
  completed_missions: CompletedMissions[];
  updated_at: string;
}

// interface para las misiones completadas
export interface CompletedMissions {
  id: string;
  completed_at: string;
  score?: number;
  attempts?: number;
  extra?: Record<string, unknown>;
}

interface UserGameState {
  userId: string;
  level: number;
  totalXP: number;
  xpIntoLevel: number;
  xpToNextLevel: number;
  completedMissions: CompletedMissions[];
  availableMissions: unknown[];
  completedMissionList: unknown[];
  missionsByDifficulty: Record<string, unknown[]>;
  missionsByRegion: Record<string, unknown[]>;
}

// function para obtener la informacion base del usuario (nivel, xp, etc)
export async function getUserBaseInfo(userId: string) {
  const { data, error } = await supabase
    .from("user_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    throw error;
  }

  if (data.length === 0) {
    return null;
  }

  return data[0];
}

// function para obtener las misiones completadas
export async function getCompletedMissions(userProgress: UserProgress | null) {
  const completedMissions = userProgress?.completed_missions;

  if (!completedMissions?.length) {
    return [];
  }

  return completedMissions;
}

export async function getAvailableMissions(
  completedMissions: CompletedMissions[]
) {
  const completedIds = completedMissions.map((mission) => mission.id);

  const { data: missions, error } = await supabase.from("missions").select("*");

  if (error) throw error;

  if (!missions) {
    return {
      available: [],
      completed: [],
      all: [],
      byDifficulty: {},
      byRegion: {},
    };
  }

  const available = missions.filter(
    (mission) => !completedIds.includes(mission.id)
  ); // misiones que el usuario no ha completado
  const completed = missions.filter((mission) =>
    completedIds.includes(mission.id)
  ); // misiones que el usuario ha completado

  // misiones por dificultad
  const byDifficulty = missions.reduce((acc, mission) => {
    const diff = mission.difficulty || "unknown";

    if (!acc[diff]) acc[diff] = [];

    acc[diff].push(mission);
    return acc;
  }, {});

  // misiones por region
  const byRegion = missions.reduce((acc, mission) => {
    const region = mission.region || "unknown";

    if (!acc[region]) acc[region] = [];

    acc[region].push(mission);
    return acc;
  }, {});

  return {
    available,
    completed,
    all: missions,
    byDifficulty,
    byRegion,
  };
}

export const getUserLevelData = (userProgress: UserProgress | null) => {
  if (!userProgress) {
    return {
      level: 1,
      totalXP: 0,
      xpIntoLevel: 0,
      xpToNextLevel: 50,
      nextLevelXP: 50,
    };
  }

  const { level, total_xp } = userProgress;

  // formula de calculo de xp para el siguiente nivel
  const nextLevelXP = (level + 1) * (level + 1) * 50; // 50 + 100 + 150 + 200 + ...
  const currentLevelXP = level * level * 50;
  const xpIntoLevel = total_xp - currentLevelXP;
  const xpToNextLevel = nextLevelXP - total_xp;

  return {
    totalXP: total_xp,
    xpIntoLevel,
    xpToNextLevel,
    nextLevelXP,
    level,
  };
};

// esta es una funcion para juntar todos los datos del usuario en un solo objeto para ser usado en el cliente de manera eficiente
export function assembleUserGameState({
  userId,
  levelData,
  completedMissions,
  missionData,
}: {
  userId: string;
  levelData: ReturnType<typeof getUserLevelData>;
  completedMissions: CompletedMissions[];
  missionData: {
    available: unknown[];
    completed: unknown[];
    all: unknown[];
    byDifficulty: Record<string, unknown[]>;
    byRegion: Record<string, unknown[]>;
  };
}): UserGameState {
  return {
    userId,
    level: levelData.level,
    totalXP: levelData.totalXP,
    xpIntoLevel: levelData.xpIntoLevel,
    xpToNextLevel: levelData.xpToNextLevel,
    availableMissions: missionData.available,
    completedMissionList: missionData.completed,
    missionsByDifficulty: missionData.byDifficulty,
    missionsByRegion: missionData.byRegion,
    completedMissions,
  };
}
