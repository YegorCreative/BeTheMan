import type { Habit } from "@/types/challenge";

export const habits: Habit[] = [
  {
    id: "lead-your-home",
    label: "Initiate one meaningful conversation",
    categoryId: "relational",
    target: 1,
    unit: "actions",
  },
  {
    id: "stay-composed",
    label: "Pause before reacting under stress",
    categoryId: "emotional",
    target: 1,
    unit: "actions",
  },
  {
    id: "train-hard",
    label: "Complete focused training",
    categoryId: "physical",
    target: 1,
    unit: "sessions",
  },
  {
    id: "quiet-time",
    label: "Spend time in prayer or scripture",
    categoryId: "spiritual",
    target: 1,
    unit: "actions",
  },
];