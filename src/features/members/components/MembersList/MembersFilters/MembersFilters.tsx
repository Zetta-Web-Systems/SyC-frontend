import { useMemo } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import { STATUS_FILTER_OPTIONS } from "../../../constants";

interface MembersFiltersProps {
  onSearch: (value: string) => void;
  statusFilter: string[];
  onStatusChange: (selected: string[]) => void;
  onClearAllFilters: () => void;
  actions?: ReactNode;
}

export function MembersFilters({
  onSearch,
  statusFilter,
  onStatusChange,
  onClearAllFilters,
  actions,
}: MembersFiltersProps) {
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
      actions={actions}
    />
  );
}

MembersFilters.displayName = "MembersFilters";
