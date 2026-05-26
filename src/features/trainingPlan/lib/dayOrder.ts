import { DayName } from "../constants";

export const DAY_ORDER = [
  DayName.MONDAY,
  DayName.TUESDAY,
  DayName.WEDNESDAY,
  DayName.THURSDAY,
  DayName.FRIDAY,
  DayName.SATURDAY,
  DayName.SUNDAY,
] as const satisfies readonly DayName[];

export type SortableDay = { dayName: DayName };

export function compareByDayOrder(a: DayName, b: DayName): number {
  return DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b);
}

export function sortDays<T extends SortableDay>(days: T[]): T[] {
  return [...days].sort((a, b) => compareByDayOrder(a.dayName, b.dayName));
}

export function nextFreeDay(used: readonly DayName[]): DayName | undefined {
  const set = new Set<DayName>(used);
  return DAY_ORDER.find((d) => !set.has(d));
}

export function isWeekFull(used: readonly DayName[]): boolean {
  return new Set(used).size >= DAY_ORDER.length;
}

export function dayNumberFromSortedIndex(sortedIndex: number): number {
  return sortedIndex + 1;
}
