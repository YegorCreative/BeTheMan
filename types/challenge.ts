export type ChallengeCategoryId =
  | "relational"
  | "emotional"
  | "physical"
  | "spiritual";

export interface ChallengeCategory {
  id: ChallengeCategoryId;
  title: string;
  description: string;
  intensity: "starter" | "core" | "elite";
}

export interface Habit {
  id: string;
  label: string;
  categoryId: ChallengeCategoryId;
  target: number;
  unit: "minutes" | "sessions" | "actions";
}

export interface StreakConfig {
  freezeDaysPerMonth: number;
  graceWindowHours: number;
  milestoneRewards: number[];
}

export interface DashboardMetric {
  id: string;
  label: string;
  value: number;
  unit?: string;
  change: number;
}

export interface ChecklistItem {
  id: string;
  label: string;
  type: "do" | "dont";
  categoryId: ChallengeCategoryId;
}