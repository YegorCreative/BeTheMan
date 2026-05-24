"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

import { challengeCategories } from "@/data/challenge-categories";
import { dashboardMetrics } from "@/data/dashboard-metrics";
import { habits } from "@/data/habits";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import type { ChallengeCategoryId, ChecklistItem } from "@/types/challenge";
import { Badge, Button, Card, Container, ProgressBar, Section } from "@/components/ui";

interface DailyState {
  checklist: Record<string, boolean>;
  journal: string;
  completionHistory: string[];
}

const storageKey = "be-the-man-challenge:mvp";

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

const checklistItems: ChecklistItem[] = [
  {
    id: "do-reach-out",
    label: "Initiate one meaningful conversation instead of staying distant.",
    type: "do",
    categoryId: "relational",
  },
  {
    id: "do-train",
    label: "Train with intent for at least 30 focused minutes.",
    type: "do",
    categoryId: "physical",
  },
  {
    id: "do-pray",
    label: "Spend time in prayer, scripture, or silent reflection.",
    type: "do",
    categoryId: "spiritual",
  },
  {
    id: "dont-escape",
    label: "Do not numb out with meaningless scrolling when pressure hits.",
    type: "dont",
    categoryId: "emotional",
  },
  {
    id: "dont-lie",
    label: "Do not say what sounds good if it avoids honest leadership.",
    type: "dont",
    categoryId: "relational",
  },
  {
    id: "dont-skip",
    label: "Do not skip the hard task you already know must be done today.",
    type: "dont",
    categoryId: "physical",
  },
];

const navigationItems = [
  { id: "hero", label: "Overview" },
  { id: "categories", label: "Categories" },
  { id: "tracker", label: "Tracker" },
  { id: "reflection", label: "Reflection" },
];

const initialState: DailyState = {
  checklist: Object.fromEntries(checklistItems.map((item) => [item.id, false])),
  journal: "",
  completionHistory: [],
};

function normalizeDailyState(state: unknown): DailyState {
  const baseChecklist = Object.fromEntries(checklistItems.map((item) => [item.id, false]));

  if (!state || typeof state !== "object") {
    return {
      checklist: baseChecklist,
      journal: "",
      completionHistory: [],
    };
  }

  const candidate = state as Partial<DailyState>;
  const candidateChecklist =
    candidate.checklist && typeof candidate.checklist === "object" ? candidate.checklist : {};

  return {
    checklist: {
      ...baseChecklist,
      ...Object.fromEntries(
        Object.entries(candidateChecklist).map(([key, value]) => [key, Boolean(value)]),
      ),
    },
    journal: typeof candidate.journal === "string" ? candidate.journal : "",
    completionHistory: Array.isArray(candidate.completionHistory)
      ? candidate.completionHistory.filter((value): value is string => typeof value === "string")
      : [],
  };
}

function getTodayKey(date = new Date()): string {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function addDays(dateString: string, days: number): string {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + days);

  return getTodayKey(date);
}

function calculateStreak(completionHistory: string[]): number {
  const completedSet = new Set(completionHistory);
  let streak = 0;
  let cursor = getTodayKey();

  if (!completedSet.has(cursor)) {
    cursor = addDays(cursor, -1);
  }

  while (completedSet.has(cursor)) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }

  return streak;
}

function scrollToSection(sectionId: string) {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function categoryAccent(categoryId: ChallengeCategoryId): string {
  switch (categoryId) {
    case "relational":
      return "from-accent/25 to-transparent";
    case "emotional":
      return "from-white/10 to-transparent";
    case "physical":
      return "from-accent/35 to-transparent";
    case "spiritual":
      return "from-amber-200/10 to-transparent";
  }
}

export function ChallengeExperience() {
  const [dailyState, setDailyState, hydrated] = useLocalStorage<DailyState>(
    storageKey,
    initialState,
  );
  const safeState = useMemo(() => normalizeDailyState(dailyState), [dailyState]);

  const todayKey = useMemo(() => getTodayKey(), []);

  const totals = useMemo(() => {
    const completedCount = checklistItems.filter((item) => safeState.checklist[item.id]).length;
    const totalCount = checklistItems.length;
    const percent = Math.round((completedCount / totalCount) * 100);
    const journalReady = safeState.journal.trim().length > 0;
    const completionHistorySet = new Set(safeState.completionHistory);
    const isDayComplete = completedCount === totalCount;

    return {
      completedCount,
      totalCount,
      percent,
      journalReady,
      isDayComplete,
      streak: calculateStreak(Array.from(completionHistorySet)),
    };
  }, [safeState]);

  const summaryMetrics = useMemo(
    () => [
      {
        label: "Today",
        value: `${totals.completedCount}/${totals.totalCount}`,
        hint: "checkpoints cleared",
      },
      {
        label: "Current streak",
        value: `${totals.streak}`,
        hint: "fully completed days",
      },
      {
        label: "Journal",
        value: totals.journalReady ? "Saved" : "Pending",
        hint: "daily reflection",
      },
    ],
    [totals.completedCount, totals.journalReady, totals.streak, totals.totalCount],
  );

  const metrics = useMemo(
    () =>
      dashboardMetrics.map((metric) => {
        if (metric.id === "streak-days") {
          return { ...metric, value: totals.streak };
        }

        if (metric.id === "completion-rate") {
          return { ...metric, value: totals.percent };
        }

        if (metric.id === "checklist-wins") {
          return { ...metric, value: totals.completedCount * 3 };
        }

        if (metric.id === "journal-entries") {
          return { ...metric, value: safeState.journal.trim() ? 1 : 0 };
        }

        return metric;
      }),
    [safeState.journal, totals.completedCount, totals.percent, totals.streak],
  );

  const toggleChecklistItem = (itemId: string) => {
    setDailyState((currentState) => {
      const normalizedState = normalizeDailyState(currentState);
      const nextChecklist = {
        ...normalizedState.checklist,
        [itemId]: !normalizedState.checklist[itemId],
      };

      const allComplete = checklistItems.every((item) => nextChecklist[item.id]);
      const nextHistory = new Set(normalizedState.completionHistory);

      if (allComplete) {
        nextHistory.add(todayKey);
      } else {
        nextHistory.delete(todayKey);
      }

      return {
        ...normalizedState,
        checklist: nextChecklist,
        completionHistory: Array.from(nextHistory).sort(),
      };
    });
  };

  const updateJournal = (value: string) => {
    setDailyState((currentState) => ({
      ...normalizeDailyState(currentState),
      journal: value,
    }));
  };

  const resetToday = () => {
    setDailyState((currentState) => ({
      ...normalizeDailyState(currentState),
      checklist: Object.fromEntries(checklistItems.map((item) => [item.id, false])),
      journal: "",
      completionHistory: normalizeDailyState(currentState).completionHistory.filter(
        (date) => date !== todayKey,
      ),
    }));
  };

  return (
    <main className="min-h-dvh bg-hero-gradient pb-12">
      <h1 className="sr-only">Be The Man Challenge</h1>

      <div className="sticky top-0 z-40 border-b border-border/70 bg-bg/75 backdrop-blur-xl">
        <Container className="py-3">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-display text-lg tracking-[0.18em] text-fg">BTM</p>
              <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                Daily Challenge Protocol
              </p>
            </div>

            <div className="hidden items-center gap-2 md:flex">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => scrollToSection(item.id)}
                >
                  {item.label}
                </Button>
              ))}
            </div>

            <Button size="sm" onClick={() => scrollToSection("tracker")}>
              Today {totals.percent}%
            </Button>
          </div>

          <div className="mt-3 flex gap-2 overflow-x-auto pb-1 md:hidden">
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                variant="ghost"
                size="sm"
                className="shrink-0"
                onClick={() => scrollToSection(item.id)}
              >
                {item.label}
              </Button>
            ))}
          </div>
        </Container>
      </div>

      <Section id="hero" className="pt-fluid-lg sm:pt-fluid-xl">
        <Container>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]"
          >
            <motion.div variants={fadeUp}>
              <Card className="relative overflow-hidden border-accent/20 bg-surface-gradient p-fluid-lg">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,hsl(var(--color-accent)/0.15),transparent_35%)]" />
                <div className="relative space-y-6">
                  <Badge variant="accent">MVP Challenge Experience</Badge>
                  <div className="space-y-4">
                    <h2 className="font-display text-4xl tracking-[0.06em] text-fg sm:text-5xl lg:text-6xl">
                      Discipline that shows up in the way you live today.
                    </h2>
                    <p className="max-w-2xl text-base text-fg-muted sm:text-lg">
                      Build traction across your relationships, emotions, body, and faith with a
                      clear checklist, visible progress, and a daily written reflection.
                    </p>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {summaryMetrics.map((metric) => (
                      <div
                        key={metric.label}
                        className="rounded-lg border border-border/80 bg-bg/35 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                          {metric.label}
                        </p>
                        <p className="mt-2 text-2xl font-semibold text-fg">{metric.value}</p>
                        <p className="mt-1 text-sm text-fg-muted">{metric.hint}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3 sm:flex-row">
                    <Button size="lg" onClick={() => scrollToSection("tracker")}>
                      Start today&apos;s challenge
                    </Button>
                    <Button variant="secondary" size="lg" onClick={resetToday}>
                      Reset today
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={fadeUp}>
              <Card className="h-full border-border/80 bg-bg/45">
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-fg-muted">
                      Daily completion
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-fg">{totals.percent}%</p>
                    <p className="mt-2 text-sm text-fg-muted">
                      {hydrated
                        ? "Your progress and reflection persist locally in this browser."
                        : "Loading saved progress from this browser."}
                    </p>
                  </div>

                  <ProgressBar value={totals.percent} label="Challenge completion" />

                  <div className="grid gap-3 sm:grid-cols-2">
                    {metrics.map((metric) => (
                      <div
                        key={metric.id}
                        className="rounded-lg border border-border/80 bg-bg-elevated/80 px-4 py-4"
                      >
                        <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">
                          {metric.label}
                        </p>
                        <div className="mt-2 flex items-end gap-2">
                          <p className="text-2xl font-semibold text-fg">{metric.value}</p>
                          {metric.unit ? (
                            <p className="pb-1 text-sm text-fg-muted">{metric.unit}</p>
                          ) : null}
                        </div>
                        <p className="mt-2 text-sm text-accent">+{metric.change} vs last cycle</p>
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </Container>
      </Section>

      <Section id="categories" spacing="sm">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={{ visible: { transition: { staggerChildren: 0.08 } } }}
            className="space-y-6"
          >
            <motion.div variants={fadeUp} className="space-y-3">
              <Badge>Challenge Categories</Badge>
              <h2 className="font-display text-3xl tracking-[0.05em] text-fg sm:text-4xl">
                Four pillars. One standard.
              </h2>
            </motion.div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {challengeCategories.map((category) => {
                const linkedHabit = habits.find((habit) => habit.categoryId === category.id);

                return (
                  <motion.div key={category.id} variants={fadeUp}>
                    <Card interactive className="h-full overflow-hidden">
                      <div
                        className={cn(
                          "mb-5 h-24 rounded-lg bg-gradient-to-br",
                          categoryAccent(category.id),
                        )}
                      />
                      <div className="space-y-4">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-xl font-semibold text-fg">{category.title}</h3>
                          <Badge variant="accent">{category.intensity}</Badge>
                        </div>
                        <p className="text-sm leading-6 text-fg-muted">{category.description}</p>
                        {linkedHabit ? (
                          <div className="rounded-lg border border-border bg-bg/40 px-4 py-3 text-sm text-fg-muted">
                            Today&apos;s focus: {linkedHabit.label}
                          </div>
                        ) : null}
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </Container>
      </Section>

      <Section id="tracker" spacing="sm">
        <Container>
          <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <Card className="h-full">
                <div className="space-y-6">
                  <div className="space-y-3">
                    <Badge variant="accent">Do / Don&apos;t System</Badge>
                    <h2 className="font-display text-3xl tracking-[0.04em] text-fg">
                      Win the day with visible standards.
                    </h2>
                    <p className="text-sm text-fg-muted sm:text-base">
                      Check off what you did. Mark the standards you kept. The progress bar
                      updates immediately and the full day counts toward your streak.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {checklistItems.map((item, index) => {
                      const checked = safeState.checklist[item.id];

                      return (
                        <motion.button
                          key={item.id}
                          type="button"
                          variants={fadeUp}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true, amount: 0.15 }}
                          transition={{ delay: index * 0.04 }}
                          aria-pressed={checked}
                          aria-label={`${item.label} - ${checked ? "completed" : "not completed"}`}
                          onClick={() => toggleChecklistItem(item.id)}
                          className={cn(
                            "flex w-full items-start gap-4 rounded-lg border px-4 py-4 text-left transition-all duration-300",
                            checked
                              ? "border-accent/50 bg-accent/10 shadow-glow"
                              : "border-border bg-bg/35 hover:border-accent/30 hover:bg-bg-elevated/70",
                          )}
                        >
                          <div
                            className={cn(
                              "mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                              checked
                                ? "border-accent bg-accent text-bg"
                                : "border-border text-fg-muted",
                            )}
                          >
                            {checked ? "OK" : item.type === "do" ? "DO" : "DON'T"}
                          </div>
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-medium text-fg">{item.label}</p>
                              <Badge variant={checked ? "success" : "neutral"}>{item.type}</Badge>
                            </div>
                            <p className="mt-2 text-sm text-fg-muted">
                              {item.categoryId.charAt(0).toUpperCase() + item.categoryId.slice(1)} pillar
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
              className="space-y-6"
            >
              <Card>
                <div className="space-y-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-fg-muted">
                      Daily Progress Tracker
                    </p>
                    <p className="mt-2 text-3xl font-semibold text-fg">
                      {totals.completedCount} of {totals.totalCount} complete
                    </p>
                  </div>
                  <ProgressBar value={totals.percent} label="Today&apos;s momentum" />
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-lg border border-border bg-bg/40 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">Streak</p>
                      <p className="mt-2 text-2xl font-semibold text-fg">{totals.streak}</p>
                      <p className="mt-1 text-sm text-fg-muted">consecutive full days</p>
                    </div>
                    <div className="rounded-lg border border-border bg-bg/40 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">Completion</p>
                      <p className="mt-2 text-2xl font-semibold text-fg">{totals.percent}%</p>
                      <p className="mt-1 text-sm text-fg-muted">today&apos;s score</p>
                    </div>
                    <div className="rounded-lg border border-border bg-bg/40 px-4 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-fg-muted">Status</p>
                      <p className="mt-2 text-2xl font-semibold text-fg">
                        {totals.isDayComplete ? "Locked" : "Active"}
                      </p>
                      <p className="mt-1 text-sm text-fg-muted">session state</p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="space-y-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-fg-muted">
                    Streak Summary
                  </p>
                  <div className="flex items-end justify-between gap-4">
                    <div>
                      <p className="font-display text-4xl text-fg sm:text-5xl">{totals.streak}</p>
                      <p className="text-sm text-fg-muted">days in a row meeting the full standard</p>
                    </div>
                    <Badge variant={totals.isDayComplete ? "success" : "accent"}>
                      {totals.isDayComplete ? "Day secured" : "Still in play"}
                    </Badge>
                  </div>
                  <div className="rounded-lg border border-border bg-bg/35 px-4 py-4 text-sm leading-6 text-fg-muted">
                    Your streak advances when every required action is checked off for the day.
                    Local persistence keeps the current browser session accountable without backend complexity.
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </Container>
      </Section>

      <Section id="reflection" spacing="sm">
        <Container>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
          >
            <Card className="overflow-hidden border-accent/15 bg-surface-gradient">
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4">
                  <Badge>Reflection</Badge>
                  <h2 className="font-display text-3xl tracking-[0.05em] text-fg sm:text-4xl">
                    Write what today revealed.
                  </h2>
                  <p className="text-sm leading-6 text-fg-muted sm:text-base">
                    Store one honest paragraph. What did you lead well? Where did you hesitate?
                    What standard has to be tighter tomorrow?
                  </p>
                  <div className="rounded-lg border border-border bg-bg/35 px-4 py-4 text-sm text-fg-muted">
                    Saved locally on this device. No backend, no auth, no extra friction.
                  </div>
                </div>

                <div className="space-y-4">
                  <label htmlFor="daily-reflection" className="sr-only">
                    Daily reflection journal
                  </label>
                  <textarea
                    id="daily-reflection"
                    value={safeState.journal}
                    onChange={(event) => updateJournal(event.target.value)}
                    placeholder="Write a clean, honest reflection from today. Keep it direct."
                    aria-describedby="daily-reflection-status"
                    className="min-h-52 w-full rounded-lg border border-border bg-bg/45 px-4 py-4 text-base text-fg outline-none transition-colors duration-300 placeholder:text-fg-muted focus:border-accent/60"
                  />
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p id="daily-reflection-status" className="text-sm text-fg-muted">
                      {safeState.journal.trim().length > 0
                        ? "Reflection saved locally."
                        : "No reflection saved yet."}
                    </p>
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button variant="secondary" onClick={() => updateJournal("")}>
                        Clear note
                      </Button>
                      <Button onClick={() => scrollToSection("hero")}>Back to top</Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </Container>
      </Section>
    </main>
  );
}