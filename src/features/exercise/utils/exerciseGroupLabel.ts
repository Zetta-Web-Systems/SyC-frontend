import type { Exercise } from "../types";

type MaybeGroup = string | { id?: string; name?: string } | null | undefined;

export function getExerciseGroupLabel(
  exercise: Pick<Exercise, "exerciseGroup"> | null | undefined,
): string {
  if (!exercise) return "";
  const group = exercise.exerciseGroup as MaybeGroup;
  if (typeof group === "string") return group;
  if (group && typeof group === "object") return group.name ?? "";
  return "";
}
