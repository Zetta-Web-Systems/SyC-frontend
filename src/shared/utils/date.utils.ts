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

// Helper centralizado
function parseDate(input: string | Date): Date {
  const parsed = typeof input === "string" ? new Date(input) : input;

  if (isNaN(parsed.getTime())) {
    throw new Error(`Invalid date: ${input}`);
  }

  return parsed;
}

/**
 * Formatea una fecha en una cadena localizada según el locale configurado.
 * Acepta tanto un objeto Date como un string parseable por el constructor de Date.
 * @example
 * formatDate("2026-03-23") => "23/03/2026"
 */
export function formatDate(date: string | Date): string {
  return dateFormatter.format(parseDate(date));
}

/**
 * Formatea una fecha con información de hora en una cadena localizada.
 * Incluye día, mes, año, hora y minutos.
 * @example
 * formatDateTime("2026-03-23T14:30:00") => "23/03/2026, 14:30"
 */
export function formatDateTime(date: string | Date): string {
  return dateTimeFormatter.format(parseDate(date));
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
