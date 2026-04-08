import type { FilterEntry } from "@shared/types/pagination.types";

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterFieldConfig {
  apiKey: string;
  initial: string[];
}

export type FilterSchema = Record<string, FilterFieldConfig>;

export interface UseFiltersReturn<Keys extends string> {
  filters: Record<Keys, string[]>;
  filterEntries: FilterEntry[];
  handleFilterChange: (key: Keys, values: string[]) => void;
  handleClearAllFilters: () => void;
  hasActiveFilters: boolean;
}
