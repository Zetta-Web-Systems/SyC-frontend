import { formatDateToISO } from "@shared/utils/date.utils";
import { SCHEDULE_DAYS, type ScheduleDay } from "../constants";

const DAYS_PER_WEEK = 7;
const MONDAY = 1;
const LOCALE = "es-AR";

const dayFormatter = new Intl.DateTimeFormat(LOCALE, { day: "numeric" });
const dayShortMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "short",
});
const dayLongMonthFormatter = new Intl.DateTimeFormat(LOCALE, {
  day: "numeric",
  month: "long",
});

export function parseISODate(date: string): Date {
  return new Date(`${date}T00:00:00`);
}

export function addDays(date: Date, amount: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

export function addWeeks(date: Date, amount: number): Date {
  return addDays(date, amount * DAYS_PER_WEEK);
}

export function startOfWeek(date: Date): Date {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  const offset = (result.getDay() - MONDAY + DAYS_PER_WEEK) % DAYS_PER_WEEK;
  return addDays(result, -offset);
}

export function getWeekRange(anchor: Date): { from: string; to: string } {
  const monday = startOfWeek(anchor);
  return {
    from: formatDateToISO(monday),
    to: formatDateToISO(addDays(monday, SCHEDULE_DAYS.length - 1)),
  };
}

export function getWeekdays(
  from: string,
): { date: string; dayOfWeek: ScheduleDay }[] {
  const monday = parseISODate(from);
  return SCHEDULE_DAYS.map((dayOfWeek, index) => ({
    date: formatDateToISO(addDays(monday, index)),
    dayOfWeek,
  }));
}

export function formatWeekRange(from: string, to: string): string {
  const start = parseISODate(from);
  const end = parseISODate(to);
  const sameMonth = start.getMonth() === end.getMonth();

  const startLabel = sameMonth
    ? dayFormatter.format(start)
    : dayShortMonthFormatter.format(start);

  return `${startLabel} — ${dayShortMonthFormatter.format(end)}`;
}

export function formatWeekDescription(from: string, to: string): string {
  const start = parseISODate(from);
  const end = parseISODate(to);
  const sameMonth = start.getMonth() === end.getMonth();

  const startLabel = sameMonth
    ? dayFormatter.format(start)
    : dayLongMonthFormatter.format(start);

  return `Semana del ${startLabel} al ${dayLongMonthFormatter.format(end)}`;
}

export function isDateInRange(date: string, from: string, to: string): boolean {
  return date >= from && date <= to;
}
