import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type { PaginatedParams } from "@shared/types/pagination.types";
import type { ViewMode } from "@shared/ui";
import { toApiPage } from "@shared/utils/pagination.utils";

export function useGroupExercisesFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [orderByValue, setOrderByValue] = useState("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    search: search || undefined,
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

  const handleOrderByChange = useCallback(
    (value: string) => {
      setOrderByValue(value);
      resetPage();
    },
    [resetPage],
  );

  return {
    params,
    pagination,
    setPagination,
    search,
    orderByValue,
    viewMode,
    setViewMode,
    handleSearch,
    handleOrderByChange,
  };
}
