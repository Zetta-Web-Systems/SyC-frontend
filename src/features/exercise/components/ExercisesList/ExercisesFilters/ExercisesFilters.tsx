import { useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import {
  EXERCISE_ACTIVE_FILTER_OPTIONS,
  EXERCISE_LEVEL_OPTIONS,
} from "../../../constants";

interface ExercisesFiltersProps {
  onSearch: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
  actions?: ReactNode;
}

export function ExercisesFilters({
  onSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  actions,
}: ExercisesFiltersProps) {
  const handleChange = useCallback(
    (key: string) => (values: string[]) => onFilterChange(key, values),
    [onFilterChange],
  );

  const filterConfigs = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "isActive",
        label: "Estado",
        options: EXERCISE_ACTIVE_FILTER_OPTIONS,
        selected: filters.isActive ?? [],
        onChange: handleChange("isActive"),
        multiple: false,
        searchable: false,
      },
      {
        key: "exerciseLevel",
        label: "Nivel",
        options: EXERCISE_LEVEL_OPTIONS,
        selected: filters.exerciseLevel ?? [],
        onChange: handleChange("exerciseLevel"),
        multiple: true,
        searchable: false,
      },
    ],
    [filters, handleChange],
  );

  return (
    <DataTableToolbar
      filters={filterConfigs}
      searchPlaceholder="Buscar por nombre"
      onSearch={onSearch}
      onClearAll={onClearAllFilters}
      actions={actions}
    />
  );
}

ExercisesFilters.displayName = "ExercisesFilters";
