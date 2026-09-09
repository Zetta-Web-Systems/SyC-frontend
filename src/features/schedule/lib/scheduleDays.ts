import { SCHEDULE_DAY_LABELS, type ScheduleDay } from "../constants";

/** "Lunes", "Lunes y Martes", "Lunes, Martes y Viernes". */
export function formatDayList(days: readonly ScheduleDay[]): string {
  const labels = [...new Set(days)].map((day) => SCHEDULE_DAY_LABELS[day]);

  if (labels.length <= 1) return labels.join("");

  return `${labels.slice(0, -1).join(", ")} y ${labels.at(-1)}`;
}
