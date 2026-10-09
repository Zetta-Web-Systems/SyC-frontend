import type { ScheduleDay } from "../constants";
import type { TimeSlot } from "../types";
import { formatDayList } from "./scheduleDays";
import { formatSlotRange, normalizeTime } from "./slotStatus";

interface OverlapQuery {
  startTime: string;
  endTime: string;
  days?: readonly ScheduleDay[];
  excludedSlotIds?: ReadonlySet<string>;
}

function overlaps(
  startA: string,
  endA: string,
  startB: string,
  endB: string,
): boolean {
  return startA < endB && startB < endA;
}

/**
 * Sirve para avisar antes de disparar las llamadas, en vez de mandar cinco POST y que el backend rechace el tercero.
 */
export function findOverlappingSlots(
  slots: TimeSlot[],
  query: OverlapQuery,
): TimeSlot[] {
  const startTime = normalizeTime(query.startTime);
  const endTime = normalizeTime(query.endTime);

  return slots.filter((slot) => {
    if (query.excludedSlotIds?.has(slot.id)) return false;
    if (query.days && !query.days.includes(slot.dayOfWeek)) return false;

    return overlaps(
      startTime,
      endTime,
      normalizeTime(slot.startTime),
      normalizeTime(slot.endTime),
    );
  });
}

export function describeSlotDays(slots: TimeSlot[]): string {
  return formatDayList(slots.map((slot) => slot.dayOfWeek));
}

export function describeSlotRanges(slots: TimeSlot[]): string {
  const ranges = slots.map((slot) =>
    formatSlotRange(slot.startTime, slot.endTime),
  );

  if (ranges.length <= 1) return ranges.join("");

  return `${ranges.slice(0, -1).join(", ")} y ${ranges.at(-1)}`;
}
