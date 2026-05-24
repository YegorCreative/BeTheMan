import type { ChallengeCategory } from "@/types/challenge";

export const challengeCategories: ChallengeCategory[] = [
  {
    id: "relational",
    title: "Relational",
    description: "Lead with presence, service, and deliberate attention toward the people closest to you.",
    intensity: "core",
  },
  {
    id: "emotional",
    title: "Emotional",
    description: "Build composure, restraint, and honest self-awareness under pressure.",
    intensity: "starter",
  },
  {
    id: "physical",
    title: "Physical",
    description: "Train strength, energy, and discipline through deliberate daily action.",
    intensity: "elite",
  },
  {
    id: "spiritual",
    title: "Spiritual",
    description: "Anchor the day in conviction, scripture, prayer, and aligned intent.",
    intensity: "core",
  },
];