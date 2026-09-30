import { getApiErrorMessage } from "@shared/api/apiError";
import { formatDate, formatDateToISO } from "@shared/utils/date.utils";
import type { CalendarClosure, ScheduleDayInfo } from "../types";
import { addDays, parseISODate } from "./scheduleWeek";

export function eachDateInRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  let date = parseISODate(startDate);
  let iso = formatDateToISO(date);

  while (iso <= endDate) {
    dates.push(iso);
    date = addDays(date, 1);
    iso = formatDateToISO(date);
  }

  return dates;
}

function isSameClosure(a: CalendarClosure, b: CalendarClosure): boolean {
  return a.type === b.type && (a.reason ?? null) === (b.reason ?? null);
}

function isNextDay(previous: string, current: string): boolean {
  return formatDateToISO(addDays(parseISODate(previous), 1)) === current;
}

export function groupConsecutiveClosures(
  days: ScheduleDayInfo[],
): ScheduleDayInfo[] {
  const sorted = [...days].sort((a, b) => a.date.localeCompare(b.date));
  const groupedByDate = new Map<string, CalendarClosure>();

  let run: { closure: CalendarClosure; dates: string[] } | null = null;

  function closeRun() {
    if (!run) return;

    const grouped: CalendarClosure = {
      ...run.closure,
      startDate: run.dates[0],
      endDate: run.dates[run.dates.length - 1],
    };

    for (const date of run.dates) groupedByDate.set(date, grouped);
    run = null;
  }

  for (const day of sorted) {
    const { closure } = day;

    if (!closure) {
      closeRun();
      continue;
    }

    const previousDate = run?.dates[run.dates.length - 1];

    if (
      run &&
      previousDate &&
      isSameClosure(run.closure, closure) &&
      isNextDay(previousDate, day.date)
    ) {
      run.dates.push(day.date);
      continue;
    }

    closeRun();
    run = { closure, dates: [day.date] };
  }

  closeRun();

  return sorted.map((day) => {
    const grouped = groupedByDate.get(day.date);
    return grouped ? { ...day, closure: grouped } : day;
  });
}

function buildFailureMessage(
  done: readonly string[],
  failed: string,
  error: unknown,
): string {
  const doneNote =
    done.length > 0
      ? `El cierre fue quitado de: ${done.map(formatDate).join(", ")}. `
      : "";

  return `${doneNote}No se pudo quitar el del ${formatDate(failed)}: ${getApiErrorMessage(error)}`;
}

/**
 * Un cierre de varios días son varias llamadas, porque el backend borra por fecha.
 * Si una falla se corta ahí, y el error dice qué días quedaron abiertos.
 */
export async function runClosureDeletion(
  dates: readonly string[],
  run: (date: string) => Promise<void>,
): Promise<void> {
  const done: string[] = [];

  for (const date of dates) {
    try {
      await run(date);
      done.push(date);
    } catch (error) {
      throw new Error(buildFailureMessage(done, date, error));
    }
  }
}
