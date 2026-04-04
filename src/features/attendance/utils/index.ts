import type { FilterOption } from "@shared/types/datatable.types";

export function getYearOptions(): FilterOption[] {
  const currentYear = new Date().getFullYear();
  return [currentYear].map((year) => ({
    label: String(year),
    value: String(year),
  }));
}
