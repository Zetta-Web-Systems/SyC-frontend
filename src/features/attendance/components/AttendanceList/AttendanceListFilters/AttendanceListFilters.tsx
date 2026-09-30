import { useMemo } from "react";
import type { ReactNode } from "react";
import { DataTableToolbar } from "@shared/components/DataTable";
import type { ToolbarFilterConfig } from "@shared/types/datatable.types";
import type { ExtraFilterChip } from "@shared/types/datatable.types";
import type { DateFilterDropdownProps } from "@shared/ui";
import {
  DEPARTURE_FILTER_OPTIONS,
  MONTH_OPTIONS,
  PERSON_TYPE_SINGULAR_LABELS,
  type AttendanceType,
} from "../../../constants";
import { getYearOptions, registersDeparture } from "../../../utils";

interface AttendanceListFiltersProps {
  searchValue: string;
  monthFilter: string[];
  yearFilter: string[];
  dateFilter: Date | null;
  departureFilter: string[];
  type: AttendanceType;
  personName?: string;
  onSearch: (value: string) => void;
  onSearchClear: () => void;
  onMonthChange: (selected: string[]) => void;
  onYearChange: (selected: string[]) => void;
  onDateChange: (date: Date | null) => void;
  onDepartureChange: (selected: string[]) => void;
  onClearAllFilters: () => void;
  onPersonClear?: () => void;
  actions?: ReactNode;
}

export function AttendanceListFilters({
  searchValue,
  monthFilter,
  yearFilter,
  dateFilter,
  departureFilter,
  type,
  personName,
  onSearch,
  onSearchClear,
  onMonthChange,
  onYearChange,
  onDateChange,
  onDepartureChange,
  onClearAllFilters,
  onPersonClear,
  actions,
}: AttendanceListFiltersProps) {
  const yearOptions = useMemo(
    () => getYearOptions(new Date().getFullYear()),
    [],
  );
  const dateFilterConfig = useMemo<Omit<DateFilterDropdownProps, "className">>(
    () => ({
      label: "Fecha",
      value: dateFilter,
      onChange: onDateChange,
    }),
    [dateFilter, onDateChange],
  );

  const filters = useMemo<ToolbarFilterConfig[]>(() => {
    const dateFilters: ToolbarFilterConfig[] = [
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
    ];

    if (!registersDeparture(type)) return dateFilters;

    return [
      ...dateFilters,
      {
        key: "departureRegistered",
        label: "Salida",
        options: DEPARTURE_FILTER_OPTIONS,
        selected: departureFilter,
        onChange: onDepartureChange,
        multiple: false,
        searchable: false,
      },
    ];
  }, [
    monthFilter,
    yearFilter,
    departureFilter,
    onMonthChange,
    onYearChange,
    onDepartureChange,
    dateFilter,
    yearOptions,
    type,
  ]);

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
