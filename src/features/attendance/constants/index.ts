export const DNI_MIN_LENGTH = 7;
export const DNI_MAX_LENGTH = 8;

export const PERSON_TYPE_LABELS: Record<string, string> = {
  INSTRUCTOR: "Profesor",
  STUDENT: "Alumno",
  ADMIN: "Administrador",
};

export const RESET_TIMINGS = {
  entry: 4000,
  exit: 4000,
  error: 5000,
} as const;

export const LONG_PRESS_DURATION = 1500;

export const FALLBACK_MESSAGES = {
  entry: (name: string, lastname: string) => `Bienvenido/a ${name} ${lastname}`,
  exit: (name: string, lastname: string) => `Hasta luego ${name} ${lastname}`,
} as const;
