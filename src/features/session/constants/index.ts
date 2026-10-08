import type { BadgeProps } from "@shared/ui";

type BadgeIntent = NonNullable<BadgeProps["intent"]>;

export const SESSION_BACKEND_READY = {
  registerSession: false,
  registerSessionAsAdmin: false,
  boardFinishInfo: false,
  undoExecution: true,
  standaloneObservation: true,
  stableCurrentDay: false,
  dayProgress: false,
  registerPresence: false,
  absentFromPresent: false,
} as const;

export const ATTENDANCE_STATE = {
  PRESENT: "present",
  PENDING: "pending",
  ABSENT: "absent",
} as const;

export type AttendanceState =
  (typeof ATTENDANCE_STATE)[keyof typeof ATTENDANCE_STATE];

export const ATTENDANCE_STATE_DTO = {
  PRESENT: "Presente",
  PENDING: "Pendiente",
  ABSENT: "Ausente",
} as const;

export type AttendanceStateDto =
  (typeof ATTENDANCE_STATE_DTO)[keyof typeof ATTENDANCE_STATE_DTO];

export const ATTENDANCE_STATE_ORDER: AttendanceState[] = [
  ATTENDANCE_STATE.PRESENT,
  ATTENDANCE_STATE.PENDING,
  ATTENDANCE_STATE.ABSENT,
];

export const ATTENDANCE_STATE_LABELS: Record<AttendanceState, string> = {
  present: "Presente",
  pending: "Pendiente",
  absent: "Ausente",
};

export const ATTENDANCE_STATE_PLURAL_LABELS: Record<AttendanceState, string> = {
  present: "Presentes",
  pending: "Pendientes",
  absent: "Ausentes",
};

export const ATTENDANCE_STATE_INTENT: Record<AttendanceState, BadgeIntent> = {
  present: "success",
  pending: "neutral",
  absent: "error",
};

export const ATTENDANCE_GROUP_LABELS: Record<AttendanceState, string> = {
  present: "En sala",
  pending: "Por llegar",
  absent: "Ausentes",
};

export const ATTENDANCE_GROUP_GRID: Record<AttendanceState, string> = {
  present: "gap-4 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4",
  pending: "gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
  absent: "gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
};

export const MEMBER_AVATAR_SIZE = {
  MD: "md",
  LG: "lg",
  XL: "xl",
} as const;

export type MemberAvatarSize =
  (typeof MEMBER_AVATAR_SIZE)[keyof typeof MEMBER_AVATAR_SIZE];

export const MEMBER_AVATAR_WRAPPER: Record<MemberAvatarSize, string> = {
  md: "size-13",
  lg: "size-15.5",
  xl: "size-18",
};

export const MEMBER_AVATAR_BADGE: Record<MemberAvatarSize, string> = {
  md: "size-4 [&>svg]:size-2.5",
  lg: "size-5 [&>svg]:size-3",
  xl: "size-6 [&>svg]:size-3.5",
};

export const MEMBER_AVATAR_BADGE_TONE: Record<AttendanceState, string> = {
  present: "bg-success",
  pending: "bg-neutral-400",
  absent: "bg-error",
};

export const SESSION_POSITION = {
  PREV: "prev",
  CURRENT: "current",
  NEXT: "next",
} as const;

export type SessionPosition =
  (typeof SESSION_POSITION)[keyof typeof SESSION_POSITION];

export const SESSION_POSITION_ORDER: SessionPosition[] = [
  SESSION_POSITION.PREV,
  SESSION_POSITION.CURRENT,
  SESSION_POSITION.NEXT,
];

export const SESSION_SEARCH_ORDER: SessionPosition[] = [
  SESSION_POSITION.CURRENT,
  SESSION_POSITION.PREV,
  SESSION_POSITION.NEXT,
];

export const SESSION_POSITION_TITLE: Record<SessionPosition, string> = {
  prev: "Turno anterior",
  current: "Turno en curso",
  next: "Próximo turno",
};

export const SESSION_EMPTY_MESSAGE: Record<SessionPosition, string> = {
  prev: "No hubo turnos antes en el día",
  current: "Ya no quedan turnos por hoy",
  next: "No hay más turnos hoy",
};

export const SESSION_VIEW = {
  BOARD: "board",
  ROOM: "room",
} as const;

export type SessionView = (typeof SESSION_VIEW)[keyof typeof SESSION_VIEW];

export const SESSION_VIEW_ORDER: SessionView[] = [
  SESSION_VIEW.BOARD,
  SESSION_VIEW.ROOM,
];

export const SESSION_VIEW_LABELS: Record<SessionView, string> = {
  board: "Pizarra",
  room: "Sala",
};

export const SESSION_REFETCH_INTERVAL = 60_000;

export const SESSION_SEARCH_DELAY_MS = 150;

export const SESSION_ROOM_COLUMNS_QUERY = "(min-width: 64rem)";

export const SESSION_KEYS = {
  all: ["session"] as const,
  boards: () => [...SESSION_KEYS.all, "board"] as const,
  board: (position: SessionPosition) =>
    [...SESSION_KEYS.boards(), position] as const,
  planDays: () => [...SESSION_KEYS.all, "planDay"] as const,
  planDay: (memberId: string, week: number, day: number) =>
    [...SESSION_KEYS.planDays(), memberId, week, day] as const,
};

export const EXECUTION_STATUS = {
  PENDING: "pending",
  DONE: "done",
  SKIPPED: "skipped",
} as const;

export type ExecutionStatus =
  (typeof EXECUTION_STATUS)[keyof typeof EXECUTION_STATUS];

export const EXECUTION_STATUS_LABELS: Record<ExecutionStatus, string> = {
  pending: "Ahora",
  done: "Hecho",
  skipped: "No pudo",
};

export const PREVIOUS_EXECUTION_LABELS: Record<ExecutionStatus, string> = {
  pending: "Sin registrar",
  done: "Realizado",
  skipped: "No pudo",
};

export const EXECUTION_STATUS_INTENT: Record<ExecutionStatus, BadgeIntent> = {
  pending: "neutral",
  done: "success",
  skipped: "warning",
};

export const EXECUTION_STATUS_TEXT: Record<ExecutionStatus, string> = {
  pending: "text-primary-600",
  done: "text-success",
  skipped: "text-warning",
};

export const EXECUTION_STATUS_BORDER: Record<ExecutionStatus, string> = {
  pending: "border-primary-300",
  done: "border-success/50",
  skipped: "border-warning/50",
};

export const EXECUTION_ACTION_TONE: Record<
  Exclude<ExecutionStatus, typeof EXECUTION_STATUS.PENDING>,
  string
> = {
  done: "border-success/60 bg-success/10 text-success hover:bg-success/15 active:bg-success/20 focus-visible:ring-success",
  skipped:
    "border-warning/60 bg-warning/10 text-warning hover:bg-warning/15 active:bg-warning/20 focus-visible:ring-warning",
};

export const EXECUTION_ROW_TONE: Record<ExecutionStatus, string> = {
  pending: "border-neutral-200 bg-white hover:border-primary-300",
  done: "border-transparent bg-success/5 hover:bg-success/10",
  skipped: "border-transparent bg-warning/5 hover:bg-warning/10",
};
