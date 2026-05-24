import type { DashboardMetric } from "@/types/challenge";

export const dashboardMetrics: DashboardMetric[] = [
  {
    id: "streak-days",
    label: "Current Streak",
    value: 6,
    unit: "days",
    change: 1,
  },
  {
    id: "completion-rate",
    label: "Weekly Completion",
    value: 78,
    unit: "%",
    change: 6,
  },
  {
    id: "checklist-wins",
    label: "Wins Logged",
    value: 18,
    unit: "this week",
    change: 3,
  },
  {
    id: "journal-entries",
    label: "Reflections Saved",
    value: 5,
    unit: "entries",
    change: 2,
  },
];