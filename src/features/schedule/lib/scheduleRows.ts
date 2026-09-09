import { getApiErrorMessage } from "@shared/api/apiError";
import { SCHEDULE_DAY_LABELS, type ScheduleDay } from "../constants";
import type { ScheduleRow, TimeSlot } from "../types";
import { normalizeTime } from "./slotStatus";

interface RowOperationVerbs {
  done: string;
  action: string;
}

export function getSlotsInRow(
  slots: TimeSlot[],
  startTime: string,
): TimeSlot[] {
  const normalized = normalizeTime(startTime);

  return slots.filter((slot) => normalizeTime(slot.startTime) === normalized);
}

function buildFailureMessage(
  doneDays: ScheduleDay[],
  failedDay: ScheduleDay,
  verbs: RowOperationVerbs,
  error: unknown,
): string {
  const doneLabel = doneDays.map((day) => SCHEDULE_DAY_LABELS[day]).join(", ");
  const doneNote = doneLabel
    ? `El horario fue ${verbs.done} correctamente los días: ${doneLabel}. `
    : "";

  return `${doneNote}No se pudo ${verbs.action} el horario del día ${SCHEDULE_DAY_LABELS[failedDay]}: ${getApiErrorMessage(error)}`;
}

/**
 * Aplica una operación día por día sobre una fila del turnero.
 *
 * El backend trabaja sobre una celda por llamada, así que una fila son varias.
 * Si una falla se corta ahí, y el error dice qué días quedaron hechos y en cuál se cortó
 */
export async function runRowOperation<
  TItem extends { dayOfWeek: ScheduleDay },
  TResult,
>(
  items: readonly TItem[],
  run: (item: TItem) => Promise<TResult>,
  verbs: RowOperationVerbs,
): Promise<TResult[]> {
  const results: TResult[] = [];
  const doneDays: ScheduleDay[] = [];

  for (const item of items) {
    try {
      results.push(await run(item));
      doneDays.push(item.dayOfWeek);
    } catch (error) {
      throw new Error(
        buildFailureMessage(doneDays, item.dayOfWeek, verbs, error),
      );
    }
  }

  return results;
}

/** Los días de la semana en los que esa fila tiene un horario abierto. */
export function getRowDays(row: ScheduleRow): ScheduleDay[] {
  return row.cells
    .filter((cell) => cell.kind !== "unavailable")
    .map((cell) => cell.dayOfWeek);
}
