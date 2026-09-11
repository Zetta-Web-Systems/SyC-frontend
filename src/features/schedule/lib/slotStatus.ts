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

function toMinutes(time: string): number {
  const { hours, minutes } = parseTime(time);
  return hours * MINUTES_PER_HOUR + minutes;
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

export function addMinutesToTime(time: string, minutes: number): string {
  const total = toMinutes(time) + minutes;
  const hours = Math.floor(total / MINUTES_PER_HOUR) % HOURS_PER_DAY;

  return `${String(hours).padStart(2, "0")}:${String(total % MINUTES_PER_HOUR).padStart(2, "0")}`;
}

export function getSlotEndTime(startTime: string): string {
  return addMinutesToTime(startTime, SLOT_DURATION_MINUTES);
}

export function getSlotDurationMinutes(
  startTime: string,
  endTime: string,
): number {
  return toMinutes(endTime) - toMinutes(startTime);
}

export function formatSlotDuration(startTime: string, endTime: string): string {
  const minutes = getSlotDurationMinutes(startTime, endTime);
  if (minutes <= 0) return "";

  const hours = Math.floor(minutes / MINUTES_PER_HOUR);
  const rest = minutes % MINUTES_PER_HOUR;

  if (hours === 0) return `${rest} min`;
  if (rest === 0) return `${hours} h`;

  return `${hours} h ${rest} min`;
}

export function formatSlotTime(time: string): string {
  const { hours, minutes } = parseTime(time);
  return `${hours}.${String(minutes).padStart(2, "0")}`;
}

export function formatSlotRange(startTime: string, endTime: string): string {
  return `${formatSlotTime(startTime)}–${formatSlotTime(endTime)}`;
}
