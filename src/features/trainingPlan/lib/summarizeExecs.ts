import type { RegisterExerciseExecution } from "../types";

function formatExec(exec: RegisterExerciseExecution): string {
  const base = `${exec.sets}×${exec.reps}`;
  return exec.rir ? `${base} · RIR ${exec.rir}` : base;
}

export function summarizeExecs(execs: RegisterExerciseExecution[]): string {
  if (execs.length === 0) return "";
  const sorted = [...execs].sort((a, b) => a.weekNumber - b.weekNumber);
  if (sorted.length === 1) {
    return `S1 ${formatExec(sorted[0])}`;
  }
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  return `S1 ${formatExec(first)} → S${last.weekNumber} ${formatExec(last)}`;
}
