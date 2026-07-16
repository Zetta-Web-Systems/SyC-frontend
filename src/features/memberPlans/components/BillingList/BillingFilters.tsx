import { useMemo, useCallback } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import {
  FEE_STATE_FILTER_OPTIONS,
  MEMBER_PLAN_TYPE_FILTER_OPTIONS,
} from "../../constants";

interface BillingFiltersProps {
  searchValue?: string;
  onSearch: (value: string) => void;
  onSearchClear?: () => void;
  filters: Record<string, string[]>;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
}

export function BillingFilters({
  searchValue,
  onSearch,
  onSearchClear,
  filters,
  onFilterChange,
  onClearAllFilters,
}: BillingFiltersProps) {
  const handleChange = useCallback(
    (key: string) => (values: string[]) => onFilterChange(key, values),
    [onFilterChange],
  );

  const filterConfigs = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "feeState",
        label: "Estado",
        options: FEE_STATE_FILTER_OPTIONS,
        selected: filters.feeState ?? [],
        onChange: handleChange("feeState"),
        multiple: false,
        searchable: false,
      },
      {
        key: "memberPlanType",
        label: "Tipo de plan",
        options: MEMBER_PLAN_TYPE_FILTER_OPTIONS,
        selected: filters.memberPlanType ?? [],
        onChange: handleChange("memberPlanType"),
        multiple: false,
        searchable: false,
      },
    ],
    [filters, handleChange],
  );

  return (
    <DataTableToolbar
      filters={filterConfigs}
      searchPlaceholder="Buscar por alumno"
      searchValue={searchValue}
      onSearch={onSearch}
      onSearchClear={onSearchClear}
      onClearAll={onClearAllFilters}
    />
  );
}

BillingFilters.displayName = "BillingFilters";
