import { useState, useCallback, useMemo } from "react";
import type { FilterEntry } from "@shared/types/pagination.types";
import type {
  FilterSchema,
  UseFiltersReturn,
} from "@shared/types/filters.types";

function buildState<S extends FilterSchema>(
  schema: S,
  mode: "initial" | "empty",
): Record<keyof S & string, string[]> {
  const state = {} as Record<keyof S & string, string[]>;
  for (const key of Object.keys(schema)) {
    state[key as keyof S & string] =
      mode === "initial" ? schema[key].initial : [];
  }
  return state;
}

export function useFilters<S extends FilterSchema>(
  schema: S,
): UseFiltersReturn<keyof S & string> {
  type Keys = keyof S & string;

  const initialState = useMemo(() => buildState(schema, "initial"), [schema]);
  const emptyState = useMemo(() => buildState(schema, "empty"), [schema]);

  const [filters, setFilters] = useState<Record<Keys, string[]>>(initialState);

  const filterEntries = useMemo<FilterEntry[]>(
    () =>
      Object.entries(filters).flatMap(([key, values]) => {
        const apiKey = schema[key]?.apiKey;
        if (!apiKey || (values as string[]).length === 0) return [];
        return (values as string[]).map((value) => ({ key: apiKey, value }));
      }),
    [filters, schema],
  );

  const handleFilterChange = useCallback((key: Keys, values: string[]) => {
    setFilters((prev) => ({ ...prev, [key]: values }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilters(emptyState);
  }, [emptyState]);

  const hasActiveFilters = useMemo(
    () => Object.values(filters).some((v) => (v as string[]).length > 0),
    [filters],
  );

  return {
    filters,
    filterEntries,
    handleFilterChange,
    handleClearAllFilters,
    hasActiveFilters,
  };
}
