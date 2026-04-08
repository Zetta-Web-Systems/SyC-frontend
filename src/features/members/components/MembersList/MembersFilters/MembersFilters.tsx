import { useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import {
  STATUS_FILTER_OPTIONS,
  TRAINING_GOAL_FILTER_OPTIONS,
} from "../../../constants";

interface MembersFiltersProps {
  onSearch: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
  actions?: ReactNode;
}

export function MembersFilters({
  onSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  actions,
}: MembersFiltersProps) {
  const handleChange = useCallback(
    (key: string) => (values: string[]) => onFilterChange(key, values),
    [onFilterChange],
  );

  const filterConfigs = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "status",
        label: "Estado",
        options: STATUS_FILTER_OPTIONS,
        selected: filters.status ?? [],
        onChange: handleChange("status"),
        multiple: false,
        searchable: false,
      },
      {
        key: "trainingGoal",
        label: "Objetivo",
        options: TRAINING_GOAL_FILTER_OPTIONS,
        selected: filters.trainingGoal ?? [],
        onChange: handleChange("trainingGoal"),
        multiple: false,
        searchable: false,
      },
    ],
    [filters, handleChange],
  );

  return (
    <DataTableToolbar
      filters={filterConfigs}
      searchPlaceholder="Buscar"
      onSearch={onSearch}
      onClearAll={onClearAllFilters}
      actions={actions}
    />
  );
}

MembersFilters.displayName = "MembersFilters";
