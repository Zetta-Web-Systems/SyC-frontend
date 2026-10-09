import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type {
  PaginatedParams,
  FilterEntry,
} from "@shared/types/pagination.types";
import type { ViewMode } from "@shared/ui";
import { formatDateToISO } from "@shared/utils/date.utils";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";
import type { AttendanceType } from "../../constants";
import { registersDeparture } from "../../utils";

interface UseAttendanceFiltersOptions {
  type: AttendanceType;
  initialPersonId?: string;
}

export function useAttendanceFilters(options: UseAttendanceFiltersOptions) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [monthFilter, setMonthFilter] = useState<string[]>([]);
  const [yearFilter, setYearFilter] = useState<string[]>([]);
  const [prevMonth, setPrevMonth] = useState<string[]>([]);
  const [prevYear, setPrevYear] = useState<string[]>([]);
  const [dateFilter, setDateFilter] = useState<Date | null>(null);
  const [departureFilter, setDepartureFilter] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const scopeKey = `${options.type}|${options.initialPersonId ?? ""}`;
  const [prevScopeKey, setPrevScopeKey] = useState(scopeKey);
  if (scopeKey !== prevScopeKey) {
    setPrevScopeKey(scopeKey);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }

  const filterEntries: FilterEntry[] = [
    { key: "person.type", value: options.type },
  ];

  if (options.initialPersonId) {
    filterEntries.push({ key: "person.id", value: options.initialPersonId });
  }

  if (registersDeparture(options.type) && departureFilter.length > 0) {
    filterEntries.push({
      key: "departureRegistered",
      value: departureFilter[0],
    });
  }

  if (dateFilter) {
    filterEntries.push({
      key: "attendanceDate",
      value: formatDateToISO(dateFilter),
    });
  } else {
    if (monthFilter.length > 0) {
      filterEntries.push({ key: "month", value: monthFilter[0] });
    }
    if (yearFilter.length > 0) {
      filterEntries.push({ key: "year", value: yearFilter[0] });
    }
  }

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    search: search || undefined,
    ...splitFilterEntries(filterEntries),
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleMonthChange = useCallback((values: string[]) => {
    setMonthFilter(values);
    setDateFilter(null);
    setPrevMonth(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleYearChange = useCallback((values: string[]) => {
    setYearFilter(values);
    setDateFilter(null);
    setPrevYear(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleDateChange = useCallback(
    (date: Date | null) => {
      if (date) {
        setPrevMonth(monthFilter);
        setPrevYear(yearFilter);
        setMonthFilter([]);
        setYearFilter([]);
      } else {
        setMonthFilter(prevMonth);
        setYearFilter(prevYear);
      }
      setDateFilter(date);
      setPagination((prev) => ({ ...prev, pageIndex: 0 }));
    },
    [monthFilter, yearFilter, prevMonth, prevYear],
  );

  const handleDepartureChange = useCallback((values: string[]) => {
    setDepartureFilter(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setPrevMonth([]);
    setPrevYear([]);
    setMonthFilter([]);
    setYearFilter([]);
    setDateFilter(null);
    setDepartureFilter([]);
    setSearch("");
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    params,
    pagination,
    setPagination,
    search,
    monthFilter,
    yearFilter,
    dateFilter,
    departureFilter,
    viewMode,
    setViewMode,
    handleSearch,
    clearSearch,
    handleMonthChange,
    handleYearChange,
    handleDateChange,
    handleDepartureChange,
    handleClearAllFilters,
  };
}
