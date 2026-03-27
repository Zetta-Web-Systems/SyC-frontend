import { useMemo } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import { STATUS_FILTER_OPTIONS } from "../../constants/instructors.constants";

interface InstructorsFiltersProps {
  onSearch: (value: string) => void;
  statusFilter: string[];
  onStatusChange: (selected: string[]) => void;
  onClearAllFilters: () => void;
}

export function InstructorsFilters({
  onSearch,
  statusFilter,
  onStatusChange,
  onClearAllFilters,
}: InstructorsFiltersProps) {
  const filters = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "status",
        label: "Estado",
        options: STATUS_FILTER_OPTIONS,
        selected: statusFilter,
        onChange: onStatusChange,
        multiple: false,
        searchable: false,
      },
    ],
    [statusFilter, onStatusChange],
  );

  return (
    <DataTableToolbar
      filters={filters}
      searchPlaceholder="Buscar"
      onSearch={onSearch}
      onClearAll={onClearAllFilters}
      // onExportExcel={() => {}}
      // onExportPdf={() => {}}
    />
  );
}

InstructorsFilters.displayName = "InstructorsFilters";
