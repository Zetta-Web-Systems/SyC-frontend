interface LastLoginInfo {
  label: string;
  intent: "success" | "info" | "warning" | "error" | "neutral";
}

const DEFAULT_LOCALE = "es-AR";

// Cache de formatters (mejora performance)
const dateFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
});

const dateShortFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "short",
});

const dayMonthFormatter = new Intl.DateTimeFormat(DEFAULT_LOCALE, {
  day: "2-digit",
  month: "2-digit",
});

// Helper centralizado
function parseDate(input: string | number | Date): Date {
  if (typeof input === "string") {
    const normalized = /^\d{4}-\d{2}-\d{2}$/.test(input)
      ? `${input}T00:00:00`
      : input;
    const parsed = new Date(normalized);
    if (isNaN(parsed.getTime())) throw new Error(`Invalid date: ${input}`);
    return parsed;
  }

  if (typeof input === "number") {
    const parsed = new Date(input);
    if (isNaN(parsed.getTime())) throw new Error(`Invalid date: ${input}`);
    return parsed;
  }

  if (isNaN(input.getTime())) throw new Error(`Invalid date: ${input}`);
  return input;
}

/**
 * Formatea una fecha en una cadena localizada según el locale configurado.
 * Acepta tanto un objeto Date como un string parseable por el constructor de Date.
 * @example
 * formatDate("2026-03-23") => "23/03/2026"
 */
export function formatDate(date: string | number | Date): string {
  return dateFormatter.format(parseDate(date));
}

/**
 * Formatea una fecha con información de hora en una cadena localizada.
 * Incluye día, mes, año, hora y minutos.
 * @example
 * formatDateTime("2026-03-23T14:30:00") => "23/03/2026, 14:30"
 */
export function formatDateTime(date: string | number | Date): string {
  return dateTimeFormatter.format(parseDate(date));
}

/**
 * Formatea una fecha en formato corto día + mes abreviado.
 * Útil para ejes temporales en gráficos.
 * @example
 * formatDateShort("2026-03-23") => "23 mar"
 */
export function formatDateShort(date: string | number | Date): string {
  return dateShortFormatter.format(parseDate(date));
}

/**
 * Formatea una fecha en formato numérico día/mes, sin año.
 * @example
 * formatDayMonth("2026-06-03") => "03/06"
 */
export function formatDayMonth(date: string | number | Date): string {
  return dayMonthFormatter.format(parseDate(date));
}

/**
 * Convierte una hora en formato "HH:MM:SS" a segundos totales desde medianoche.
 * Lanza un error si el formato es inválido.
 * @example
 * parseTimeToSeconds("01:30:00") => 5400
 */
function parseTimeToSeconds(time: string): number {
  const parts = time.split(":").map(Number);

  if (parts.length !== 3 || parts.some(isNaN)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  const [h, m, s] = parts;

  return h * 3600 + m * 60 + s;
}

/**
 * Calcula la duración entre dos horarios y la devuelve en formato legible.
 * Soporta cruce de medianoche (por ejemplo, entrada 23:00 y salida 01:00).
 * @returns Una cadena como:
 * - "1h 45m"
 * - "45m"
 * - "30s"
 * @example
 * formatDuration("14:00:00", "15:30:00") => "1h 30m"
 */
export function formatDuration(
  arrivalTime: string,
  departureTime: string,
): string {
  let diff =
    parseTimeToSeconds(departureTime) - parseTimeToSeconds(arrivalTime);

  if (diff < 0) diff += 86400;

  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;

  if (h) return m ? `${h}h ${m}m` : `${h}h`;
  if (m) return `${m}m`;
  return `${s}s`;
}

/**
 * Formatea una hora en formato "HH:MM:SS" a una versión corta "HH:MM".
 * Lanza un error si el formato no es válido.
 * @example
 * formatTimeShort("14:30:00") => "14:30"
 */
export function formatTimeShort(time: string): string {
  if (!/^\d{2}:\d{2}(:\d{2})?$/.test(time)) {
    throw new Error(`Invalid time format: ${time}`);
  }

  return time.slice(0, 5);
}

/**
 * Normaliza una fecha a medianoche en hora local, eliminando la componente horaria.
 * Esto es esencial para calcular diferencias en días calendario de forma correcta,
 * independientemente de la zona horaria o la hora del día.
 */
function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/**
 * Utilidad para formatear la información de la última conexión / fecha relativa.
 *
 * @example
 * - "HOY a las HH:MM" (verde) si fue hoy y tiene hora.
 * - "HOY" (verde) si es una fecha sin hora y es hoy.
 * - "Hace 1 día" (azul) si fue ayer.
 */
export function getLastLoginInfo(lastLoginAt: string | null): LastLoginInfo {
  if (!lastLoginAt) {
    return { label: "NUNCA", intent: "error" };
  }

  const loginDate = new Date(lastLoginAt);
  const now = new Date();

  const diffDays = Math.round(
    (startOfDay(now).getTime() - startOfDay(loginDate).getTime()) / MS_PER_DAY,
  );

  if (diffDays === 0) {
    const hasTime = lastLoginAt.includes("T") || lastLoginAt.includes(" ");
    if (hasTime) {
      const time = loginDate.toLocaleTimeString("es-AR", {
        hour: "2-digit",
        minute: "2-digit",
      });
      return { label: `HOY a las ${time}`, intent: "success" };
    }
    return { label: "HOY", intent: "success" };
  }

  if (diffDays >= 1 && diffDays <= 5) {
    return {
      label: `Hace ${diffDays} día${diffDays > 1 ? "s" : ""}`,
      intent: "info",
    };
  }

  if (diffDays >= 6 && diffDays <= 29) {
    return { label: `Hace ${diffDays} días`, intent: "warning" };
  }

  return { label: "Hace 30+ días", intent: "error" };
}

/**
 * Formatea una fecha a formato ISO (YYYY-MM-DD) en hora local.
 * @param date Fecha a formatear. Puede ser un objeto Date o un string parseable por el constructor de Date.
 */
export function formatDateToISO(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}
