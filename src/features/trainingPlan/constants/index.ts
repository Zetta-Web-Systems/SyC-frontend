import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

type BadgeIntent =
  | "success"
  | "warning"
  | "error"
  | "info"
  | "violet"
  | "neutral";

export const TRAINING_PLANS_KEYS = {
  all: ["training-plans"] as const,
  list: (params: PaginatedParams) =>
    [...TRAINING_PLANS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...TRAINING_PLANS_KEYS.all, "detail", id] as const,
  trafficLights: () => [...TRAINING_PLANS_KEYS.all, "traffic-light"] as const,
  trafficLight: (memberId: string, exerciseId: string) =>
    [...TRAINING_PLANS_KEYS.trafficLights(), memberId, exerciseId] as const,
} as const;

export const TRAINING_PLANS_ORDER_BY = "startDate";

export const PlanState = {
  ACTIVE: "Activa",
  SCHEDULED: "Programada",
  COMPLETED: "Completada",
  CANCELLED: "Cancelada",
  TEMPLATE: "Plantilla",
} as const;

export type PlanState = (typeof PlanState)[keyof typeof PlanState];

type PlanStateBadge = { label: string; intent: BadgeIntent };

export const PLAN_STATE_BADGE: Record<PlanState, PlanStateBadge> = {
  [PlanState.ACTIVE]: { label: "Activa", intent: "success" },
  [PlanState.SCHEDULED]: { label: "Programada", intent: "info" },
  [PlanState.COMPLETED]: { label: "Completada", intent: "neutral" },
  [PlanState.CANCELLED]: { label: "Cancelada", intent: "error" },
  [PlanState.TEMPLATE]: { label: "Plantilla", intent: "violet" },
};

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activa", value: PlanState.ACTIVE },
  { label: "Programada", value: PlanState.SCHEDULED },
  { label: "Completada", value: PlanState.COMPLETED },
  { label: "Cancelada", value: PlanState.CANCELLED },
];

export const TRAINING_PLANS_FILTER_SCHEMA = {
  state: { apiKey: "state", initial: [] },
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
