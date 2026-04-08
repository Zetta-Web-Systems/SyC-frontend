import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type { PaginatedParams } from "@shared/types/pagination.types";
import type { ViewMode } from "@shared/ui";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";
import { useFilters } from "@shared/hooks/useFilters";
import { INSTRUCTORS_FILTER_SCHEMA } from "../constants/instructors.constants";

export function useInstructorsFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [orderByValue, setOrderByValue] = useState("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const {
    filters,
    filterEntries,
    handleFilterChange: baseFilterChange,
    handleClearAllFilters: baseClearAll,
  } = useFilters(INSTRUCTORS_FILTER_SCHEMA);

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    search: search || undefined,
    ...splitFilterEntries(filterEntries),
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
      baseFilterChange(key as keyof typeof INSTRUCTORS_FILTER_SCHEMA, values);
      resetPage();
    },
    [baseFilterChange, resetPage],
  );

  const handleOrderByChange = useCallback(
    (value: string) => {
      setOrderByValue(value);
      resetPage();
    },
    [resetPage],
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
    orderByValue,
    viewMode,
    setViewMode,
    handleSearch,
    handleFilterChange,
    handleOrderByChange,
    handleClearAllFilters,
  };
}
