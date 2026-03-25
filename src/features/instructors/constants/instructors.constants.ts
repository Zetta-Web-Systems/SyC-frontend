import type { PaginatedParams } from "@shared/types/pagination.types";

export const INSTRUCTORS_KEYS = {
  all: ["instructors"] as const,
  list: (params: PaginatedParams) =>
    [...INSTRUCTORS_KEYS.all, "list", params] as const,
} as const;

export const STATUS_OPTIONS = [
  { label: "Todos", value: "" },
  { label: "Activo", value: "true" },
  { label: "Inactivo", value: "false" },
] as const;

export const ORDER_OPTIONS = [
  { label: "Mas recientes", value: "recent" },
  { label: "Nombre A-Z", value: "name-asc" },
  { label: "Nombre Z-A", value: "name-desc" },
] as const;

export const ORDER_MAP: Record<
  string,
  { orderBy: string; orderType: "ASC" | "DESC" }
> = {
  recent: { orderBy: "id", orderType: "DESC" },
  "name-asc": { orderBy: "name", orderType: "ASC" },
  "name-desc": { orderBy: "name", orderType: "DESC" },
};
