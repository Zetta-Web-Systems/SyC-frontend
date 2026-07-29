import { useMemo, useCallback } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type {
  ToolbarFilterConfig,
  ToolbarToggleFilter,
} from "@shared/types/datatable.types";
import { STATUS_FILTER_OPTIONS } from "../../../constants";

interface TrainingPlansFiltersProps {
  onSearch: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
  showTemplates: boolean;
  onToggleTemplates: (checked: boolean) => void;
}

export function TrainingPlansFilters({
  onSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  showTemplates,
  onToggleTemplates,
}: TrainingPlansFiltersProps) {
  const handleChange = useCallback(
    (key: string) => (values: string[]) => onFilterChange(key, values),
    [onFilterChange],
  );

  const filterConfigs = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "state",
        label: "Estado",
        options: STATUS_FILTER_OPTIONS,
        selected: showTemplates ? [] : (filters.state ?? []),
        onChange: handleChange("state"),
        multiple: false,
        searchable: false,
        disabled: showTemplates,
      },
    ],
    [filters, handleChange, showTemplates],
  );

  const toggleFilters = useMemo<ToolbarToggleFilter[]>(
    () => [
      {
        key: "templates",
        label: "Solo plantillas",
        checked: showTemplates,
        onChange: onToggleTemplates,
      },
    ],
    [showTemplates, onToggleTemplates],
  );

  return (
    <DataTableToolbar
      filters={filterConfigs}
      toggleFilters={toggleFilters}
      searchPlaceholder="Buscar por alumno o plantilla"
      onSearch={onSearch}
      onClearAll={onClearAllFilters}
    />
  );
}

TrainingPlansFilters.displayName = "TrainingPlansFilters";
