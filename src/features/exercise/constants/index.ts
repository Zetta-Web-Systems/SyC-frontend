import type { PaginatedParams } from "@shared/types/pagination.types";

export const ExerciseLevel = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
} as const;

export type ExerciseLevel = (typeof ExerciseLevel)[keyof typeof ExerciseLevel];

export const GROUP_EXERCISES_KEYS = {
  all: ["groupExercises"] as const,
  list: (params: PaginatedParams) =>
    [...GROUP_EXERCISES_KEYS.all, "list", params] as const,
  detail: (id: string) =>
    [...GROUP_EXERCISES_KEYS.all, "detail", id] as const,
} as const;
