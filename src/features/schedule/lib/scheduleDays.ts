import {
  SCHEDULE_DAY_LABELS,
  SCHEDULE_DAYS,
  type ScheduleDay,
} from "../constants";

/** "Lunes", "Lunes y Martes", "Lunes, Martes y Viernes". */
export function formatDayList(days: readonly ScheduleDay[]): string {
  const labels = [...new Set(days)].map((day) => SCHEDULE_DAY_LABELS[day]);

  if (labels.length <= 1) return labels.join("");

  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}`;
}

/** "de lunes a viernes", "los lunes y miércoles" — para una selección de días. */
export function describeDaySelection(days: readonly ScheduleDay[]): string {
  if (days.length === 0) return "";
  if (days.length === SCHEDULE_DAYS.length) return "de lunes a viernes";

  return `los ${formatDayList(days).toLowerCase()}`;
}
