import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

export const INSTRUCTORS_KEYS = {
  all: ["instructors"] as const,
  list: (params: PaginatedParams) =>
    [...INSTRUCTORS_KEYS.all, "list", params] as const,
} as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const INSTRUCTORS_FILTER_SCHEMA = {
  status: { apiKey: "isActive", initial: ["1"] },
} as const satisfies FilterSchema;
