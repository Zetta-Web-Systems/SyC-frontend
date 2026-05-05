import type { FilterOption } from "@shared/types/filters.types";
import type { PaginatedParams } from "@shared/types/pagination.types";

export const ATTENDANCE_KEYS = {
  all: ["attendance"] as const,
  list: (params: PaginatedParams) =>
    [...ATTENDANCE_KEYS.all, "list", params] as const,
} as const;

export const DNI_MIN_LENGTH = 7;
export const DNI_MAX_LENGTH = 8;

export const RESET_TIMINGS = {
  entry: 6000,
  exit: 6000,
} as const;

export const LONG_PRESS_DURATION = 1500;

export const FALLBACK_MESSAGES = {
  entry: () => `Asistencia registrada correctamente`,
  exit: () => `Egreso registrado correctamente`,
} as const;

export const REQUEST_STATUS = {
  IDLE: "idle",
  LOADING: "loading",
  MOOD_SELECTION: "mood_selection",
  MOOD_LOADING: "mood_loading",
  ERROR: "error",
} as const;

export type RequestStatus =
  (typeof REQUEST_STATUS)[keyof typeof REQUEST_STATUS];

export const ATTENDANCE_ACTION = {
  ENTRY: "entry",
  EXIT: "exit",
} as const;

export type AttendanceAction =
  (typeof ATTENDANCE_ACTION)[keyof typeof ATTENDANCE_ACTION];

export const MOOD = {
  MOTIVATED: "motivated",
  ENERGETIC: "energetic",
  TIRED: "tired",
  SORE: "sore",
  UNMOTIVATED: "unmotivated",
} as const;

export type Mood = (typeof MOOD)[keyof typeof MOOD];

export const MOOD_LABELS: Record<Mood, string> = {
  motivated: "Motivado",
  energetic: "Enérgico",
  tired: "Cansado",
  sore: "Dolorido",
  unmotivated: "Desganado",
};

export const MOOD_EMOJIS: Record<Mood, string> = {
  motivated: "💪",
  energetic: "⚡",
  tired: "😴",
  sore: "🤕",
  unmotivated: "😔",
};

export const MOOD_MESSAGES: Record<Mood, string> = {
  motivated: "¡Hoy es tu día, dale con todo!",
  energetic: "A romperla en el entrenamiento",
  tired: "Vamos tranquilo, lo importante es estar acá",
  sore: "Cuidá la zona, escuchá a tu cuerpo",
  unmotivated: "Un paso a la vez, ya estás acá",
};

export const PERSON_TYPE = {
  INSTRUCTOR: "INSTRUCTOR",
  MEMBER: "MEMBER",
} as const;

export type AttendanceType = (typeof PERSON_TYPE)[keyof typeof PERSON_TYPE];

export const PERSON_TYPE_LABELS: Record<AttendanceType, string> = {
  INSTRUCTOR: "Profesores",
  MEMBER: "Alumnos",
};

export const PERSON_TYPE_SINGULAR_LABELS: Record<AttendanceType, string> = {
  INSTRUCTOR: "Profesor",
  MEMBER: "Alumno",
};

export const MONTH_OPTIONS: FilterOption[] = [
  { label: "Enero", value: "1" },
  { label: "Febrero", value: "2" },
  { label: "Marzo", value: "3" },
  { label: "Abril", value: "4" },
  { label: "Mayo", value: "5" },
  { label: "Junio", value: "6" },
  { label: "Julio", value: "7" },
  { label: "Agosto", value: "8" },
  { label: "Septiembre", value: "9" },
  { label: "Octubre", value: "10" },
  { label: "Noviembre", value: "11" },
  { label: "Diciembre", value: "12" },
];
