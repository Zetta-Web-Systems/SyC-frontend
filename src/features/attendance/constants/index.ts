import type { BadgeProps } from "@shared/ui";
import type { FilterOption } from "@shared/types/filters.types";
import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FeeDueStatus } from "@features/memberPlans";

export const ATTENDANCE_KEYS = {
  all: ["attendance"] as const,
  list: (params: PaginatedParams) =>
    [...ATTENDANCE_KEYS.all, "list", params] as const,
} as const;

export const DNI_MIN_LENGTH = 7;
export const DNI_MAX_LENGTH = 8;

export const LONG_PRESS_DURATION = 1500;

export const DEPARTURE_FILTER_OPTIONS: FilterOption[] = [
  { label: "Registrada", value: "true" },
  { label: "Sin registrar", value: "false" },
];

export const DEPARTURE_STATE = {
  IN_PROGRESS: "in_progress",
  NOT_REGISTERED: "not_registered",
} as const;

export type DepartureState =
  (typeof DEPARTURE_STATE)[keyof typeof DEPARTURE_STATE];

export const DEPARTURE_STATE_LABELS: Record<DepartureState, string> = {
  in_progress: "En curso",
  not_registered: "Sin registrar",
};

export const DEPARTURE_STATE_INTENT: Record<
  DepartureState,
  BadgeProps["intent"]
> = {
  in_progress: "success",
  not_registered: "neutral",
};

export const YEAR_FILTER_YEARS_BACK = 2;

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
  REPEAT: "repeat",
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

export const MOOD_INTENT: Record<Mood, BadgeProps["intent"]> = {
  motivated: "success",
  energetic: "violet",
  tired: "warning",
  sore: "error",
  unmotivated: "neutral",
};

export const ATTENDANCE_STATUS = {
  PRESENT: "present",
  ABSENT: "absent",
} as const;

export type AttendanceStatus =
  (typeof ATTENDANCE_STATUS)[keyof typeof ATTENDANCE_STATUS];

export const ATTENDANCE_STATUS_LABELS: Record<AttendanceStatus, string> = {
  present: "Presente",
  absent: "Ausente",
};

export const ATTENDANCE_STATUS_INTENT: Record<
  AttendanceStatus,
  BadgeProps["intent"]
> = {
  present: "success",
  absent: "error",
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

export const PERSON_TYPE_INTENT: Record<AttendanceType, BadgeProps["intent"]> =
  {
    INSTRUCTOR: "info",
    MEMBER: "neutral",
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

export const CHECK_IN_TIMEOUTS = {
  idleDni: 20_000,
} as const;

export const MOOD_SECONDS = 30;

export const RESULT_SECONDS = {
  calm: 10,
  attention: 15,
} as const;

export const MOOD_CHOICE_FEEDBACK_MS = 450;

export const MOOD_ORDER: Mood[] = [
  MOOD.MOTIVATED,
  MOOD.ENERGETIC,
  MOOD.TIRED,
  MOOD.SORE,
  MOOD.UNMOTIVATED,
];

export const CHECK_IN_ERROR_MESSAGES = {
  NOT_FOUND: "No encontramos ese DNI. Revisá el número o avisale al profe.",
  TOO_SOON:
    "Ya marcaste hace un ratito. Esperá unos minutos y volvé a intentar.",
  OFFLINE: "No pudimos conectarnos. Probá de nuevo en un momento.",
} as const;

export type FeeStatusIntent = FeeDueStatus["intent"] | "neutral";

export const FEE_STATUS_FRAME: Record<FeeStatusIntent, string> = {
  success: "border-success",
  warning: "border-warning",
  info: "border-info",
  error: "border-error",
  neutral: "border-neutral-300",
};

export const FEE_STATUS_BAND: Record<FeeStatusIntent, string> = {
  success: "bg-success text-white",
  warning: "bg-warning text-neutral-900",
  info: "bg-info text-white",
  error: "bg-error text-white",
  neutral: "bg-neutral-100 text-neutral-900",
};

export const FEE_STATUS_INK: Record<FeeStatusIntent, string> = {
  success: "text-emerald-700",
  warning: "text-orange-700",
  info: "text-blue-700",
  error: "text-rose-700",
  neutral: "text-neutral-900",
};

export const WEEKDAY_NAMES = [
  "domingo",
  "lunes",
  "martes",
  "miércoles",
  "jueves",
  "viernes",
  "sábado",
] as const;

export const MONTH_NAMES = [
  "enero",
  "febrero",
  "marzo",
  "abril",
  "mayo",
  "junio",
  "julio",
  "agosto",
  "septiembre",
  "octubre",
  "noviembre",
  "diciembre",
] as const;

export const KIOSK_LOGO_SRC = "/images/attendance/attendance-image.png";
