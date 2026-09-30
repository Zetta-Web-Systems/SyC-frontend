import { formatDateToISO } from "@shared/utils/date.utils";
import type {
  ScheduleCellData,
  ScheduleGrid,
  ScheduleWeek,
  SlotCellData,
  SlotRosterEntry,
} from "../types";

export const RECOVERY_BLOCK = {
  PAST_DATE: "No se pueden registrar recuperaciones en días pasados",
  SLOT_ENDED: "Ese horario ya terminó",
  DAY_CLOSED: "El día está cerrado",
  SLOT_BLOCKED: "El horario está bloqueado esa fecha",
  NOT_ASSIGNABLE: "Ese horario no admite alumnos",
  ALREADY_RECOVERING: "El alumno ya tiene una recuperación ese día",
} as const;

function toClockTime(now: Date): string {
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * Devuelve el motivo por el que la celda no admite una recuperación, o `null`
 * si la admite.
 */
export function getRecoveryBlockReason(
  cell: ScheduleCellData,
  now: Date,
): string | null {
  const today = formatDateToISO(now);

  if (cell.date < today) return RECOVERY_BLOCK.PAST_DATE;
  if (cell.kind === "closed") return RECOVERY_BLOCK.DAY_CLOSED;
  if (cell.kind === "blocked") return RECOVERY_BLOCK.SLOT_BLOCKED;
  if (cell.kind !== "slot") return RECOVERY_BLOCK.NOT_ASSIGNABLE;

  if (cell.date === today && cell.endTime <= toClockTime(now)) {
    return RECOVERY_BLOCK.SLOT_ENDED;
  }

  return null;
}

/**
 * Celdas de la semana que admiten una recuperación, ordenadas por día y hora.
 *
 * INFO: Al ofrecer sólo celdas reales de la grilla es imposible mandar un horario
 * que no sea del día elegido, que es el bug silencioso que el backend no valida.
 */
export function getAvailableRecoveryCells(
  grid: ScheduleGrid,
  now: Date,
): SlotCellData[] {
  const cells = grid.rows
    .flatMap((row) => row.cells)
    .filter(
      (cell): cell is SlotCellData =>
        cell.kind === "slot" && getRecoveryBlockReason(cell, now) === null,
    );

  return cells.sort(
    (a, b) =>
      a.date.localeCompare(b.date) || a.startTime.localeCompare(b.startTime),
  );
}

export function countRecoveries(roster: SlotRosterEntry[]): number {
  return roster.filter((entry) => entry.kind === "recovery").length;
}

/**
 * Alumnos que ya tienen una recuperación esa fecha. El backend valida por
 * alumno + día (no por alumno + horario), así que el front filtra igual.
 */
export function getMembersWithRecoveryOnDate(
  week: ScheduleWeek | undefined,
  date: string,
): Set<string> {
  const memberIds = new Set<string>();
  if (!week) return memberIds;

  for (const recovery of week.recoveries) {
    if (recovery.date === date) memberIds.add(recovery.member.id);
  }

  return memberIds;
}
