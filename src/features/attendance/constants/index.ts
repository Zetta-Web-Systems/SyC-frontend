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
