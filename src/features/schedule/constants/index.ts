export const SCHEDULE_DAY = {
  MONDAY: "Lunes",
  TUESDAY: "Martes",
  WEDNESDAY: "Miercoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sabado",
  SUNDAY: "Domingo",
} as const;

export type ScheduleDay = (typeof SCHEDULE_DAY)[keyof typeof SCHEDULE_DAY];

export const SCHEDULE_DAYS: readonly ScheduleDay[] = [
  SCHEDULE_DAY.MONDAY,
  SCHEDULE_DAY.TUESDAY,
  SCHEDULE_DAY.WEDNESDAY,
  SCHEDULE_DAY.THURSDAY,
  SCHEDULE_DAY.FRIDAY,
] as const;

export const SCHEDULE_WEEKEND_DAYS: readonly ScheduleDay[] = [
  SCHEDULE_DAY.SATURDAY,
  SCHEDULE_DAY.SUNDAY,
] as const;

export const SCHEDULE_DAY_LABELS: Record<ScheduleDay, string> = {
  [SCHEDULE_DAY.MONDAY]: "Lunes",
  [SCHEDULE_DAY.TUESDAY]: "Martes",
  [SCHEDULE_DAY.WEDNESDAY]: "Miércoles",
  [SCHEDULE_DAY.THURSDAY]: "Jueves",
  [SCHEDULE_DAY.FRIDAY]: "Viernes",
  [SCHEDULE_DAY.SATURDAY]: "Sábado",
  [SCHEDULE_DAY.SUNDAY]: "Domingo",
};

export const SHIFT = {
  MORNING: "morning",
  AFTERNOON: "afternoon",
} as const;

export type Shift = (typeof SHIFT)[keyof typeof SHIFT];

export const SHIFT_LABELS: Record<Shift, string> = {
  [SHIFT.MORNING]: "Turno Mañana",
  [SHIFT.AFTERNOON]: "Turno Tarde",
};

export const AFTERNOON_START_HOUR = 13;

export const SLOT_DURATION_MINUTES = 60;

export const SLOT_STATUS = {
  AVAILABLE: "available",
  LAST: "last",
  FULL: "full",
  OVER: "over",
} as const;

export type SlotStatus = (typeof SLOT_STATUS)[keyof typeof SLOT_STATUS];

type SlotStatusIntent = "success" | "warning" | "neutral" | "error";

export const SLOT_STATUS_INTENT: Record<SlotStatus, SlotStatusIntent> = {
  [SLOT_STATUS.AVAILABLE]: "success",
  [SLOT_STATUS.LAST]: "warning",
  [SLOT_STATUS.FULL]: "neutral",
  [SLOT_STATUS.OVER]: "error",
};

export const SLOT_STATUS_TINT: Record<SlotStatus, string> = {
  [SLOT_STATUS.AVAILABLE]: "bg-success/15",
  [SLOT_STATUS.LAST]: "bg-warning/15",
  [SLOT_STATUS.FULL]: "bg-neutral-100",
  [SLOT_STATUS.OVER]: "bg-error/15",
};

export const SLOT_STATUS_LABELS: Record<SlotStatus, string> = {
  [SLOT_STATUS.AVAILABLE]: "2 o más disponibles",
  [SLOT_STATUS.LAST]: "1 disponible",
  [SLOT_STATUS.FULL]: "Lleno",
  [SLOT_STATUS.OVER]: "Excedido",
};

export const CLOSURE_TYPE = {
  HOLIDAY: "Feriado",
  VACATION: "Vacaciones",
  OTHER: "Otro",
} as const;

export type ClosureType = (typeof CLOSURE_TYPE)[keyof typeof CLOSURE_TYPE];

export const SLOT_TAG = {
  YOGA: "Yoga",
  NIÑOS: "Niños",
} as const;

export type SlotTag = (typeof SLOT_TAG)[keyof typeof SLOT_TAG];

export const SLOT_TAG_COLORS: Record<SlotTag, string> = {
  [SLOT_TAG.YOGA]: "bg-secondary-500",
  [SLOT_TAG.NIÑOS]: "bg-violet",
};

export const SLOT_TAG_TINT: Record<SlotTag, string> = {
  [SLOT_TAG.YOGA]: "bg-secondary-500/15 text-secondary-700",
  [SLOT_TAG.NIÑOS]: "bg-violet/15 text-violet",
};

export const SCHEDULE_KEYS = {
  all: ["schedule"] as const,
  weeks: () => [...SCHEDULE_KEYS.all, "week"] as const,
  week: (date: string) => [...SCHEDULE_KEYS.weeks(), date] as const,
  unassigned: (search?: string) =>
    [...SCHEDULE_KEYS.all, "unassigned", search] as const,
} as const;

export const CLOSURE_TYPE_OPTIONS: { label: string; value: ClosureType }[] =
  Object.values(CLOSURE_TYPE).map((value) => ({ label: value, value }));

export const DEFAULT_SLOT_CAPACITY = 7;
export const MAX_SLOT_CAPACITY = 50;
export const MIN_SLOT_CAPACITY = 0;
