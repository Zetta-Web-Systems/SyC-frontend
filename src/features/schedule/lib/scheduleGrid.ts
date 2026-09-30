import { DEFAULT_SLOT_CAPACITY, type ScheduleDay } from "../constants";
import type {
  CalendarClosure,
  MemberTurn,
  RecoveryTurn,
  ScheduleCellData,
  ScheduleDayInfo,
  ScheduleGrid,
  ScheduleRow,
  ScheduleWeek,
  SlotRosterEntry,
  TimeSlot,
  TimeSlotOverride,
} from "../types";
import { findOverlappingSlots } from "./scheduleOverlap";
import { getShift, getSlotStatus, normalizeTime } from "./slotStatus";

const NOT_ASSIGNABLE_CAPACITY = 0;

interface RowContext {
  startTime: string;
  endTime: string;
  capacity: number;
}

function rowKey(startTime: string, endTime: string): string {
  return `${startTime}|${endTime}`;
}

function slotKey(
  dayOfWeek: string,
  startTime: string,
  endTime: string,
): string {
  return `${dayOfWeek}|${startTime}|${endTime}`;
}

function overrideKey(timeSlotId: string, date: string): string {
  return `${timeSlotId}|${date}`;
}

function recoveryKey(timeSlotId: string, date: string): string {
  return `${timeSlotId}|${date}`;
}

function buildRoster(turns: MemberTurn[], capacity: number): SlotRosterEntry[] {
  return turns
    .filter((turn) => turn.isActive)
    .map((turn, index) => ({
      kind: "turn" as const,
      turn,
      isOverturn: index >= capacity,
    }));
}

function buildRecoveryEntries(recoveries: RecoveryTurn[]): SlotRosterEntry[] {
  return recoveries.map((recovery) => ({
    kind: "recovery" as const,
    recovery,
  }));
}

function buildCell(
  day: ScheduleDayInfo,
  row: RowContext,
  slot: TimeSlot | undefined,
  turns: MemberTurn[],
  recoveries: RecoveryTurn[],
  override: TimeSlotOverride | undefined,
  closure: CalendarClosure | null | undefined,
  conflicts: TimeSlot[],
): ScheduleCellData {
  const base = {
    id: `${day.date}|${row.startTime}|${row.endTime}`,
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    startTime: row.startTime,
    endTime: row.endTime,
  };

  // Sin TimeSlot no hay nada que cerrar ni bloquear, así que este caso va primero.
  if (!slot) {
    return {
      ...base,
      kind: "unavailable",
      capacity: row.capacity,
      canOpen: !closure,
      conflicts,
    };
  }

  if (closure) return { ...base, kind: "closed", slot, closure };
  if (override) return { ...base, kind: "blocked", slot, override };
  if (slot.capacity === NOT_ASSIGNABLE_CAPACITY) {
    return { ...base, kind: "block", slot };
  }

  const roster = [
    ...buildRoster(turns, slot.capacity),
    ...buildRecoveryEntries(recoveries),
  ];

  return {
    ...base,
    kind: "slot",
    slot,
    roster,
    status: getSlotStatus(roster.length, slot.capacity),
  };
}

export function buildScheduleGrid(
  week: ScheduleWeek,
  visibleDays: readonly ScheduleDay[],
): ScheduleGrid {
  // INFO: Los horarios se filtran junto con los días. Si no, uno de un día oculto
  // (un horario sólo del sábado con el finde apagado) arma igual su fila, vacía de punta a punta.
  const isVisible = new Set(visibleDays);

  const days = week.days
    .filter((day) => isVisible.has(day.dayOfWeek))
    .sort((a, b) => a.date.localeCompare(b.date));

  const slots = week.timeSlots
    .filter((slot) => isVisible.has(slot.dayOfWeek))
    .map((slot) => ({
      ...slot,
      startTime: normalizeTime(slot.startTime),
      endTime: normalizeTime(slot.endTime),
    }));

  const slotsByKey = new Map<string, TimeSlot>();
  for (const slot of slots) {
    slotsByKey.set(slotKey(slot.dayOfWeek, slot.startTime, slot.endTime), slot);
  }

  const turnsBySlot = new Map<string, MemberTurn[]>();
  const sortedTurns = [...week.turns].sort((a, b) => a.id.localeCompare(b.id));
  for (const turn of sortedTurns) {
    const current = turnsBySlot.get(turn.timeSlotId);
    if (current) current.push(turn);
    else turnsBySlot.set(turn.timeSlotId, [turn]);
  }

  const recoveriesByKey = new Map<string, RecoveryTurn[]>();
  const sortedRecoveries = [...week.recoveries].sort((a, b) =>
    a.id.localeCompare(b.id),
  );
  for (const recovery of sortedRecoveries) {
    const key = recoveryKey(recovery.timeSlotId, recovery.date);
    const current = recoveriesByKey.get(key);
    if (current) current.push(recovery);
    else recoveriesByKey.set(key, [recovery]);
  }

  const overridesByKey = new Map<string, TimeSlotOverride>();
  for (const override of week.overrides) {
    overridesByKey.set(
      overrideKey(override.timeSlotId, override.date),
      override,
    );
  }

  // INFO: La fila es el rango completo. Con duraciones libres, 8.00–9.00 y 8.00–8.45
  // son dos filas distintas: si no, comparten etiqueta, id de celda y acciones de fila.
  const rowKeys = [
    ...new Set(slots.map((slot) => rowKey(slot.startTime, slot.endTime))),
  ].sort();

  const rows: ScheduleRow[] = rowKeys.map((key) => {
    const [startTime, endTime] = key.split("|");
    const rowSlots = slots.filter(
      (slot) => slot.startTime === startTime && slot.endTime === endTime,
    );

    // INFO: Para la capacidad se ignoran las celdas no asignables: abrir una celda es abrirla a alumnos, no crear otro bloque de Yoga vacío.
    const row: RowContext = {
      startTime,
      endTime,
      capacity:
        rowSlots.find((slot) => slot.capacity > NOT_ASSIGNABLE_CAPACITY)
          ?.capacity ?? DEFAULT_SLOT_CAPACITY,
    };

    return {
      startTime: row.startTime,
      endTime: row.endTime,
      shift: getShift(startTime),
      cells: days.map((day) => {
        const slot = slotsByKey.get(
          slotKey(day.dayOfWeek, row.startTime, row.endTime),
        );

        // INFO: Con horarios propios de un día (8.00 de lunes a viernes y 8.15 sólo el miércoles),
        // una celda vacía puede estar tapada por otro horario de ese mismo día.
        const conflicts = slot
          ? []
          : findOverlappingSlots(slots, {
              startTime: row.startTime,
              endTime: row.endTime,
              days: [day.dayOfWeek],
            });

        return buildCell(
          day,
          row,
          slot,
          slot ? (turnsBySlot.get(slot.id) ?? []) : [],
          slot
            ? (recoveriesByKey.get(recoveryKey(slot.id, day.date)) ?? [])
            : [],
          slot ? overridesByKey.get(overrideKey(slot.id, day.date)) : undefined,
          day.closure,
          conflicts,
        );
      }),
    };
  });

  return { days, rows };
}
