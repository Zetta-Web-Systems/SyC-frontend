import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption } from "@shared/types/datatable.types";

export const MEMBERS_KEYS = {
  all: ["members"] as const,
  list: (params: PaginatedParams) =>
    [...MEMBERS_KEYS.all, "list", params] as const,
} as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const TrainingGoal = {
  BODY_RECOMPOSITION: "BODY_RECOMPOSITION",
  GENERAL_HEALTH: "GENERAL_HEALTH",
  FUNCTIONAL_INDEPENDENCE: "FUNCTIONAL_INDEPENDENCE",
} as const;

export type TrainingGoal = (typeof TrainingGoal)[keyof typeof TrainingGoal];

export const TRAINING_GOAL_LABELS: Record<TrainingGoal, string> = {
  [TrainingGoal.BODY_RECOMPOSITION]: "Recomposición corporal",
  [TrainingGoal.GENERAL_HEALTH]: "Salud general",
  [TrainingGoal.FUNCTIONAL_INDEPENDENCE]: "Independencia funcional",
};
