import type { PaginatedParams } from "@shared/types/pagination.types";

export const INSTRUCTORS_KEYS = {
  all: ["instructors"] as const,
  list: (params: PaginatedParams) =>
    [...INSTRUCTORS_KEYS.all, "list", params] as const,
} as const;
