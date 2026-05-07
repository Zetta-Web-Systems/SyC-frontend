import { useMemo, useCallback } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import { STATUS_FILTER_OPTIONS } from "../../constants/instructors.constants";

interface InstructorsFiltersProps {
  onSearch: (value: string) => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
  actions?: ReactNode;
}

export function InstructorsFilters({
  onSearch,
  filters,
  onFilterChange,
  onClearAllFilters,
  actions,
}: InstructorsFiltersProps) {
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

InstructorsFilters.displayName = "InstructorsFilters";
