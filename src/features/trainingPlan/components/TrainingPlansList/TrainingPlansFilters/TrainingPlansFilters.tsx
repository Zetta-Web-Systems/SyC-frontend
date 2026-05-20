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
        key: "status",
        label: "Estado",
        options: STATUS_FILTER_OPTIONS,
        selected: filters.status ?? [],
        onChange: handleChange("status"),
        multiple: false,
        searchable: false,
      },
    ],
    [filters, handleChange],
  );

  const toggleFilters = useMemo<ToolbarToggleFilter[]>(
    () => [
      {
        key: "isTemplate",
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
