// types/map.ts
export interface Region {
  id: string;
  name: string;
  type: "forest" | "mountain" | "desert" | "coastal";
  missions: Mission[];
  completed: boolean;
}

export interface Mission {
  id: string;
  name: string;
  description: string;
  regionId: string;
  completed: boolean;
  rewards: Reward[];
}

export interface Reward {
  type: "points" | "badge" | "resource";
  value: number | string;
}
