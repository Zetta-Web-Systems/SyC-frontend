import type { Exercise } from "@features/exercise";
import type { DayName } from "../constants";

export const DRAG_TYPE = {
  LIBRARY: "library-exercise",
  ROW: "day-row",
} as const;

export const DROP_TYPE = {
  DAY_TAB: "day-tab",
  DAY_LIST: "day-list",
  ROW: "day-row",
} as const;

export interface LibraryDragData {
  type: typeof DRAG_TYPE.LIBRARY;
  exercise: Exercise;
}

export interface RowDragData {
  type: typeof DRAG_TYPE.ROW;
  dayName: DayName;
  order: number;
  exerciseId: string;
}

export type ActiveDragData = LibraryDragData | RowDragData;

export interface DayTabDropData {
  type: typeof DROP_TYPE.DAY_TAB;
  dayName: DayName;
}

export interface DayListDropData {
  type: typeof DROP_TYPE.DAY_LIST;
  dayName: DayName;
}

export interface RowDropData {
  type: typeof DROP_TYPE.ROW;
  dayName: DayName;
  order: number;
}

export type DropData = DayTabDropData | DayListDropData | RowDropData;

export function rowId(dayName: DayName, order: number): string {
  return `row:${dayName}:${order}`;
}

export function libraryId(exerciseId: string): string {
  return `library:${exerciseId}`;
}

export function dayTabId(dayName: DayName): string {
  return `day-tab:${dayName}`;
}

export function dayListId(dayName: DayName): string {
  return `day-list:${dayName}`;
}
