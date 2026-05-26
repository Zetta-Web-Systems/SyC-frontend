import type { RegisterExerciseExecution } from "../types";

export const DEFAULT_EXEC: Omit<RegisterExerciseExecution, "weekNumber"> = {
  sets: 3,
  reps: "10",
  rir: "3",
};

export function defaultExec(weekNumber: number): RegisterExerciseExecution {
  return { weekNumber, ...DEFAULT_EXEC };
}

export function defaultExecs(
  durationInWeeks: number,
): RegisterExerciseExecution[] {
  return Array.from({ length: durationInWeeks }, (_, i) => defaultExec(i + 1));
}

export function syncExecsToDuration(
  execs: RegisterExerciseExecution[],
  durationInWeeks: number,
): RegisterExerciseExecution[] {
  if (execs.length === durationInWeeks) return execs;

  if (durationInWeeks < execs.length) {
    return execs.slice(0, durationInWeeks).map((e, i) => ({
      ...e,
      weekNumber: i + 1,
    }));
  }

  const next = execs.map((e, i) => ({ ...e, weekNumber: i + 1 }));
  for (let i = execs.length; i < durationInWeeks; i++) {
    next.push(defaultExec(i + 1));
  }
  return next;
}
