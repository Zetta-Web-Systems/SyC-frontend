import type { FilterOption } from "@shared/types/filters.types";
import { formatTimeShort } from "@shared/utils/date.utils";
import {
  DEPARTURE_STATE,
  PERSON_TYPE,
  YEAR_FILTER_YEARS_BACK,
  type AttendanceType,
  type DepartureState,
} from "../constants";

export function formatAttendanceTime(time?: string | null): string {
  return time ? formatTimeShort(time) : "—";
}

export function registersDeparture(type: AttendanceType): boolean {
  return type === PERSON_TYPE.INSTRUCTOR;
}

export function getDepartureState(
  attendanceDate: string,
  today: string,
): DepartureState {
  return attendanceDate === today
    ? DEPARTURE_STATE.IN_PROGRESS
    : DEPARTURE_STATE.NOT_REGISTERED;
}

export function getYearOptions(
  currentYear: number,
  yearsBack: number = YEAR_FILTER_YEARS_BACK,
): FilterOption[] {
  return Array.from({ length: yearsBack + 1 }, (_, i) => {
    const year = String(currentYear - i);
    return { label: year, value: year };
  });
}
