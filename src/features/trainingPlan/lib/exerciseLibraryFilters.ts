import type { Exercise } from "@features/exercise";

export function deriveExerciseGroups(items: Exercise[]): string[] {
  const set = new Set<string>();
  for (const ex of items) {
    if (ex.exerciseGroup) set.add(ex.exerciseGroup);
  }
  return Array.from(set).sort();
}

export function filterExercisesByGroup(
  items: Exercise[],
  group: string | null,
): Exercise[] {
  if (!group) return items;
  return items.filter((i) => i.exerciseGroup === group);
}
