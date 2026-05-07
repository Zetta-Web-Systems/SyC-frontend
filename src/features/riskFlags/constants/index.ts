import type { PaginatedParams } from "@shared/types/pagination.types";
import type { FilterOption, FilterSchema } from "@shared/types/filters.types";

export const RISK_FLAGS_KEYS = {
  all: ["riskFlags"] as const,
  list: (params: PaginatedParams) =>
    [...RISK_FLAGS_KEYS.all, "list", params] as const,
  detail: (id: string) => [...RISK_FLAGS_KEYS.all, "detail", id] as const,
} as const;

export const STATUS_FILTER_OPTIONS: FilterOption[] = [
  { label: "Activos", value: "1" },
  { label: "Inactivos", value: "0" },
];

export const RISK_FLAGS_FILTER_SCHEMA = {
  status: { apiKey: "isActive", initial: ["1"] },
} as const satisfies FilterSchema;
