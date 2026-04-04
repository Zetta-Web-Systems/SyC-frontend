import { useMemo } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import type { DateFilterDropdownProps } from "@shared/ui";
import { MONTH_OPTIONS } from "../../../constants";
import { getYearOptions } from "@features/attendance/utils";

interface AttendanceListFiltersProps {
  onSearch: (value: string) => void;
  monthFilter: string[];
  yearFilter: string[];
  dateFilter: Date | null;
  onMonthChange: (selected: string[]) => void;
  onYearChange: (selected: string[]) => void;
  onDateChange: (date: Date | null) => void;
  onClearAllFilters: () => void;
  actions?: ReactNode;
}

export function AttendanceListFilters({
  onSearch,
  monthFilter,
  yearFilter,
  dateFilter,
  onMonthChange,
  onYearChange,
  onDateChange,
  onClearAllFilters,
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

  return (
    <DataTableToolbar
      filters={filters}
      dateFilter={dateFilterConfig}
      searchPlaceholder="Buscar"
      onSearch={onSearch}
      // onExportPDF={() => {}}
      // onExportExcel={() => {}}
      onClearAll={onClearAllFilters}
      actions={actions}
    />
  );
}

AttendanceListFilters.displayName = "AttendanceListFilters";
