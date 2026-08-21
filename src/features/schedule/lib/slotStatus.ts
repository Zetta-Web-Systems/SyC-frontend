import {
  AFTERNOON_START_HOUR,
  SHIFT,
  SLOT_DURATION_MINUTES,
  SLOT_STATUS,
  type Shift,
  type SlotStatus,
} from "../constants";

const MINUTES_PER_HOUR = 60;
const HOURS_PER_DAY = 24;

function parseTime(startTime: string): { hours: number; minutes: number } {
  const [hours, minutes] = startTime.split(":").map(Number);
  return { hours, minutes };
}

export function normalizeTime(time: string): string {
  const { hours, minutes } = parseTime(time);
  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

export function getSlotStatus(assigned: number, capacity: number): SlotStatus {
  if (assigned > capacity) return SLOT_STATUS.OVER;
  if (assigned >= capacity) return SLOT_STATUS.FULL;
  if (capacity - assigned === 1) return SLOT_STATUS.LAST;
  return SLOT_STATUS.AVAILABLE;
}

export function getShift(startTime: string): Shift {
  const { hours } = parseTime(startTime);
  return hours < AFTERNOON_START_HOUR ? SHIFT.MORNING : SHIFT.AFTERNOON;
}

export function getSlotEndTime(startTime: string): string {
  const { hours, minutes } = parseTime(startTime);
  const total = hours * MINUTES_PER_HOUR + minutes + SLOT_DURATION_MINUTES;
  const endHours = Math.floor(total / MINUTES_PER_HOUR) % HOURS_PER_DAY;
  const endMinutes = total % MINUTES_PER_HOUR;

  return `${String(endHours).padStart(2, "0")}:${String(endMinutes).padStart(2, "0")}`;
}

export function formatSlotTime(time: string): string {
  const { hours, minutes } = parseTime(time);
  return `${hours}.${String(minutes).padStart(2, "0")}`;
}

export function formatSlotRange(startTime: string, endTime: string): string {
  return `${formatSlotTime(startTime)}–${formatSlotTime(endTime)}`;
}
