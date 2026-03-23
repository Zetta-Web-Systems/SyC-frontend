const DEFAULT_LOCALE = "es-AR";

/**
 * Formatea una fecha o un objeto Date en una cadena de fecha localizada.
 * Ejemplo: "23/03/2026"
 */
export function formatDate(
  date: string | Date,
  locale: string = DEFAULT_LOCALE,
): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  return parsed.toLocaleDateString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
}

/**
 * Formatea una cadena de fecha o un objeto Date en una cadena de fecha y hora localizada.
 * Ejemplo: "23/03/2026, 14:30"
 */
export function formatDateTime(
  date: string | Date,
  locale: string = DEFAULT_LOCALE,
): string {
  const parsed = typeof date === "string" ? new Date(date) : date;

  return parsed.toLocaleString(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}
