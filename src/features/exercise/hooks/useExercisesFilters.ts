import { useState, useCallback, useMemo } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type {
  PaginatedParams,
  FilterEntry,
} from "@shared/types/pagination.types";
import type { ViewMode } from "@shared/ui";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";
import { useFilters } from "@shared/hooks/useFilters";
import { EXERCISES_FILTER_SCHEMA } from "../constants";

export function useExercisesFilters(groupId: string) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    filters,
    filterEntries,
    handleFilterChange: baseFilterChange,
    handleClearAllFilters: baseClearAll,
  } = useFilters(EXERCISES_FILTER_SCHEMA);

  // exerciseGroupId es implícito por la URL: lo forzamos en los entries.
  const filterEntriesWithGroup = useMemo<FilterEntry[]>(() => {
    const apiKey = EXERCISES_FILTER_SCHEMA.exerciseGroup.apiKey;
    const withoutGroup = filterEntries.filter((e) => e.key !== apiKey);
    return [...withoutGroup, { key: apiKey, value: groupId }];
  }, [filterEntries, groupId]);

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    search: search || undefined,
    ...splitFilterEntries(filterEntriesWithGroup),
  };

  const resetPage = useCallback(() => {
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleSearch = useCallback(
    (value: string) => {
      setSearch(value);
      resetPage();
    },
    [resetPage],
  );

  const handleFilterChange = useCallback(
    (key: string, values: string[]) => {
      baseFilterChange(key as keyof typeof EXERCISES_FILTER_SCHEMA, values);
      resetPage();
    },
    [baseFilterChange, resetPage],
  );

  const handleClearAllFilters = useCallback(() => {
    baseClearAll();
    resetPage();
  }, [baseClearAll, resetPage]);

  return {
    params,
    pagination,
    setPagination,
    search,
    filters,
    viewMode,
    setViewMode,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
  };
}
