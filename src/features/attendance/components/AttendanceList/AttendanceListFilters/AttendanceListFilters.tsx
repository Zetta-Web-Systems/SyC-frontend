import { useMemo } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import type { ExtraFilterChip } from "@shared/types/datatable.types";
import type { DateFilterDropdownProps } from "@shared/ui";
import {
  MONTH_OPTIONS,
  PERSON_TYPE_SINGULAR_LABELS,
  type AttendanceType,
} from "../../../constants";
import { getYearOptions } from "@features/attendance/utils";

interface AttendanceListFiltersProps {
  searchValue: string;
  monthFilter: string[];
  yearFilter: string[];
  dateFilter: Date | null;
  type: AttendanceType;
  personName?: string;
  onSearch: (value: string) => void;
  onSearchClear: () => void;
  onMonthChange: (selected: string[]) => void;
  onYearChange: (selected: string[]) => void;
  onDateChange: (date: Date | null) => void;
  onClearAllFilters: () => void;
  onPersonClear?: () => void;
  actions?: ReactNode;
}

export function AttendanceListFilters({
  searchValue,
  monthFilter,
  yearFilter,
  dateFilter,
  type,
  personName,
  onSearch,
  onSearchClear,
  onMonthChange,
  onYearChange,
  onDateChange,
  onClearAllFilters,
  onPersonClear,
  actions,
}: AttendanceListFiltersProps) {
  const yearOptions = useMemo(() => getYearOptions(), []);
  const dateFilterConfig = useMemo<Omit<DateFilterDropdownProps, "className">>(
    () => ({
      label: "Fecha",
      value: dateFilter,
      onChange: onDateChange,
    }),
    [dateFilter, onDateChange],
  );

  const filters = useMemo<ToolbarFilterConfig[]>(
    () => [
      {
        key: "month",
        label: "Mes",
        options: MONTH_OPTIONS,
        selected: monthFilter,
        onChange: onMonthChange,
        multiple: false,
        searchable: false,
        disabled: dateFilter !== null,
      },
      {
        key: "year",
        label: "Año",
        options: yearOptions,
        selected: yearFilter,
        onChange: onYearChange,
        multiple: false,
        searchable: false,
        disabled: dateFilter !== null,
      },
    ],
    [
      monthFilter,
      yearFilter,
      onMonthChange,
      onYearChange,
      dateFilter,
      yearOptions,
    ],
  );

  const extraChips = useMemo<ExtraFilterChip[]>(() => {
    if (!personName || !onPersonClear) return [];
    return [
      {
        key: "person",
        label: PERSON_TYPE_SINGULAR_LABELS[type],
        value: personName,
        onRemove: onPersonClear,
      },
    ];
  }, [personName, type, onPersonClear]);

  return (
    <DataTableToolbar
      filters={filters}
      dateFilter={dateFilterConfig}
      searchPlaceholder="Buscar"
      searchValue={searchValue}
      onSearch={onSearch}
      onSearchClear={onSearchClear}
      extraChips={extraChips}
      // onExportPDF={() => {}}
      // onExportExcel={() => {}}
      onClearAll={onClearAllFilters}
      actions={actions}
    />
  );
}

AttendanceListFilters.displayName = "AttendanceListFilters";
