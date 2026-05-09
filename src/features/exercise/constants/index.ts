import { BODY_ZONE_GROUPS } from "@shared/constants/bodyZones";
import type { BodyZoneIntent } from "@shared/constants/bodyZones";
import type { BodyZone } from "@shared/types/bodyZone.types";
import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

export const ExerciseLevel = {
  ONE: "1",
  TWO: "2",
  THREE: "3",
} as const;

export type ExerciseLevel = (typeof ExerciseLevel)[keyof typeof ExerciseLevel];

export const EXERCISE_LEVEL_LABELS: Record<ExerciseLevel, string> = {
  [ExerciseLevel.ONE]: "1",
  [ExerciseLevel.TWO]: "2",
  [ExerciseLevel.THREE]: "3",
};

export const EXERCISE_LEVEL_OPTIONS: FilterOption[] = [
  { value: ExerciseLevel.ONE, label: EXERCISE_LEVEL_LABELS[ExerciseLevel.ONE] },
  { value: ExerciseLevel.TWO, label: EXERCISE_LEVEL_LABELS[ExerciseLevel.TWO] },
  {
    value: ExerciseLevel.THREE,
    label: EXERCISE_LEVEL_LABELS[ExerciseLevel.THREE],
  },
];

export const EXERCISE_ACTIVE_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const GROUP_EXERCISES_KEYS = {
  all: ["groupExercises"] as const,
  list: (params: PaginatedParams) =>
    [...GROUP_EXERCISES_KEYS.all, "list", params] as const,
  detail: (id: string) => [...GROUP_EXERCISES_KEYS.all, "detail", id] as const,
} as const;

export const EXERCISES_KEYS = {
  all: ["exercises"] as const,
  list: (params: PaginatedParams) =>
    [...EXERCISES_KEYS.all, "list", params] as const,
  detail: (id: string) => [...EXERCISES_KEYS.all, "detail", id] as const,
} as const;

export const EXERCISES_FILTER_SCHEMA = {
  isActive: { apiKey: "isActive", initial: ["1"] },
  exerciseLevel: { apiKey: "exerciseLevel", initial: [] },
  exerciseGroup: { apiKey: "exerciseGroupId", initial: [] },
} as const satisfies FilterSchema;

export const BODY_ZONE_INTENT_HEX: Record<BodyZoneIntent, string> = {
  info: "#3b82f6",
  warning: "#ee9145",
  error: "#ef4459",
};

export const BODY_ZONE_INTENT_CLASSES: Record<
  BodyZoneIntent,
  { chip: string; dot: string }
> = {
  info: { chip: "bg-info/15 text-info", dot: "bg-info" },
  warning: { chip: "bg-warning/15 text-warning", dot: "bg-warning" },
  error: { chip: "bg-error/15 text-error", dot: "bg-error" },
};

export const BACK_ONLY_BODY_ZONES: ReadonlySet<BodyZone> = new Set<BodyZone>([
  "trapezius",
  "upper-back",
  "lower-back",
  "gluteal",
  "hamstring",
]);

export const BODY_ZONE_BLOCK_ORDER: string[] = BODY_ZONE_GROUPS.map(
  (g) => g.label,
);

export const GROUP_EXERCISE_THUMBNAIL_SCALE = 0.14;

export const GROUP_EXERCISE_THUMBNAIL_DEFAULT_FILL = "#BABABA";
