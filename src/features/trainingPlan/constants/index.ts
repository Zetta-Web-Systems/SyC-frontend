import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

export const TRAINING_PLANS_KEYS = {
  all: ["training-plans"] as const,
  list: (params: PaginatedParams) =>
    [...TRAINING_PLANS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...TRAINING_PLANS_KEYS.all, "detail", id] as const,
} as const;

export const TRAINING_PLANS_ORDER_BY = "startDate";

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const TRAINING_PLANS_FILTER_SCHEMA = {
  status: { apiKey: "isActive", initial: ["1"] },
} as const satisfies FilterSchema;

export const DayName = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miercoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sabado",
  SUNDAY: "Domingo",
} as const;

export type DayName = (typeof DayName)[keyof typeof DayName];

export { TRAINING_PLAN_OB, OB_BLOCK_TONE } from "./trainingPlanOB";
export type { TrainingPlanOBEntry, OBBlockTone } from "./trainingPlanOB";
