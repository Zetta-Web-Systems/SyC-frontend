import type {
  CalendarClosure,
  MemberTurn,
  ScheduleCellData,
  ScheduleDayInfo,
  ScheduleGrid,
  ScheduleRow,
  ScheduleWeek,
  SlotRosterEntry,
  TimeSlot,
  TimeSlotOverride,
} from "../types";
import {
  getShift,
  getSlotEndTime,
  getSlotStatus,
  normalizeTime,
} from "./slotStatus";

const NOT_ASSIGNABLE_CAPACITY = 0;

function slotKey(dayOfWeek: string, startTime: string): string {
  return `${dayOfWeek}|${startTime}`;
}

function overrideKey(timeSlotId: string, date: string): string {
  return `${timeSlotId}|${date}`;
}

function isTurnActiveOn(turn: MemberTurn, date: string): boolean {
  if (!turn.isActive) return false;
  if (turn.startDate > date) return false;
  return !turn.endDate || turn.endDate >= date;
}

function buildRoster(
  turns: MemberTurn[],
  date: string,
  capacity: number,
): SlotRosterEntry[] {
  return turns
    .filter((turn) => isTurnActiveOn(turn, date))
    .map((turn, index) => ({ turn, isOverturn: index >= capacity }));
}

function buildCell(
  day: ScheduleDayInfo,
  startTime: string,
  slot: TimeSlot | undefined,
  turns: MemberTurn[],
  override: TimeSlotOverride | undefined,
  closure: CalendarClosure | null | undefined,
): ScheduleCellData {
  const base = {
    id: `${day.date}|${startTime}`,
    date: day.date,
    dayOfWeek: day.dayOfWeek,
    startTime,
  };

  if (!slot) return { ...base, kind: "unavailable" };
  if (closure) return { ...base, kind: "closed", slot, closure };
  if (override) return { ...base, kind: "blocked", slot, override };
  if (!slot.isActive) return { ...base, kind: "disabled", slot };
  if (slot.capacity === NOT_ASSIGNABLE_CAPACITY) {
    return { ...base, kind: "block", slot };
  }

  const roster = buildRoster(turns, day.date, slot.capacity);

  return {
    ...base,
    kind: "slot",
    slot,
    roster,
    status: getSlotStatus(roster.length, slot.capacity),
  };
}

export function buildScheduleGrid(week: ScheduleWeek): ScheduleGrid {
  const days = [...week.days].sort((a, b) => a.date.localeCompare(b.date));

  const slots = week.timeSlots.map((slot) => ({
    ...slot,
    startTime: normalizeTime(slot.startTime),
  }));

  const slotsByKey = new Map<string, TimeSlot>();
  for (const slot of slots) {
    slotsByKey.set(slotKey(slot.dayOfWeek, slot.startTime), slot);
  }

  const turnsBySlot = new Map<string, MemberTurn[]>();
  const sortedTurns = [...week.turns].sort(
    (a, b) =>
      a.startDate.localeCompare(b.startDate) || a.id.localeCompare(b.id),
  );
  for (const turn of sortedTurns) {
    const current = turnsBySlot.get(turn.timeSlotId);
    if (current) current.push(turn);
    else turnsBySlot.set(turn.timeSlotId, [turn]);
  }

  const overridesByKey = new Map<string, TimeSlotOverride>();
  for (const override of week.overrides) {
    overridesByKey.set(
      overrideKey(override.timeSlotId, override.date),
      override,
    );
  }

  const startTimes = [...new Set(slots.map((slot) => slot.startTime))].sort();

  const rows: ScheduleRow[] = startTimes.map((startTime) => ({
    startTime,
    endTime:
      slots.find((slot) => slot.startTime === startTime)?.endTime ??
      getSlotEndTime(startTime),
    shift: getShift(startTime),
    cells: days.map((day) => {
      const slot = slotsByKey.get(slotKey(day.dayOfWeek, startTime));

      return buildCell(
        day,
        startTime,
        slot,
        slot ? (turnsBySlot.get(slot.id) ?? []) : [],
        slot ? overridesByKey.get(overrideKey(slot.id, day.date)) : undefined,
        day.closure,
      );
    }),
  }));

  return { days, rows };
}
