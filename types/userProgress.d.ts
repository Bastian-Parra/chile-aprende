export interface UserProgressRow {
  user_id: string;
  level: number;
  total_xp: number;
  game_state: Record<string, unknown> | null;
  unlocked_achievements: string[] | null;
  completed_missions: string[] | null;
  updated_at: string;
}