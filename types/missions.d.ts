export interface MissionData {
  hud: MissionHUD;
  type: "exploration";
  intro: MissionIntro;
  scenes: MissionScene[];
  start_bg: string;
  objective: MissionObjective;
  completion: MissionCompletion;
  building: MissionBuilding;
  search: MissionSearch
}

export interface MissionSearch {
  background: string;
  dialogues: Dialogue[];
}


export interface MissionBuilding {
  background: string;
  steps: MissionBuildingStep[];
  completion_message?: string;
}

export interface MissionBuildingStep {
  id: string;
  label: string;
  required: Record<string, number>;
  hint?: string;
}

export interface MissionHUD {
  show_counters: boolean;
  resource_icons: Record<string, string>;
}

export interface MissionIntro {
  text: string;
  title: string;
  question: string;
  options: MissionIntroOption[];
}

export interface MissionIntroOption {
  id: string; 
  next: string; 
  type: string; 
  label: string;
}

export interface MissionScene {
  id: string;
  next: string | null;
  prev: string | null;
  resources: MissionResource[];
  background_image: string;
}

export interface MissionResource {
  id: string;
  type: string; // madera, rocas, bayas, pescados
  x: number;
  y: number;
}

export interface MissionObjective {
  goal: Record<string, number>;
  description: string;
}

export interface MissionCompletion {
  type: "resource_collection";
  reward_xp: number;
  unlock_next: string;
}
