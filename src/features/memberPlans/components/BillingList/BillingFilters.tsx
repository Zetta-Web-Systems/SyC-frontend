import { useMemo, useCallback } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type {
  ExtraFilterChip,
  ToolbarFilterConfig,
} from "@shared/types/datatable.types";
import {
  FEE_STATE_FILTER_OPTIONS,
  MEMBER_PLAN_TYPE_FILTER_OPTIONS,
} from "../../constants";

interface BillingFiltersProps {
  searchValue?: string;
  onSearch: (value: string) => void;
  onSearchClear?: () => void;
  filters: Record<string, string[]>;
  memberName?: string;
  onFilterChange: (key: string, values: string[]) => void;
  onClearAllFilters: () => void;
}

export function BillingFilters({
  searchValue,
  onSearch,
  onSearchClear,
  filters,
  memberName,
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

  const extraChips = useMemo<ExtraFilterChip[]>(() => {
    if (!filters.memberId?.length) return [];

    return [
      {
        key: "memberId",
        label: "Alumno",
        value: memberName ?? "Seleccionado",
        onRemove: () => onFilterChange("memberId", []),
      },
    ];
  }, [filters.memberId, memberName, onFilterChange]);

  return (
    <DataTableToolbar
      filters={filterConfigs}
      extraChips={extraChips}
      searchPlaceholder="Buscar por alumno"
      searchValue={searchValue}
      onSearch={onSearch}
      onSearchClear={onSearchClear}
      onClearAll={onClearAllFilters}
    />
  );
}

BillingFilters.displayName = "BillingFilters";
