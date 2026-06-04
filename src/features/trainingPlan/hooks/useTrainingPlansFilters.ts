import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";
import { useFilters } from "@shared/hooks/useFilters";
import {
  PlanState,
  TRAINING_PLANS_FILTER_SCHEMA,
  TRAINING_PLANS_ORDER_BY,
} from "../constants";

export function useTrainingPlansFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");

  const {
    filters,
    filterEntries,
    handleFilterChange: baseFilterChange,
    handleClearAllFilters: baseClearAll,
  } = useFilters(TRAINING_PLANS_FILTER_SCHEMA);

  const showTemplates = filters.state?.includes(PlanState.TEMPLATE) ?? false;

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    orderBy: TRAINING_PLANS_ORDER_BY,
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
      baseFilterChange(
        key as keyof typeof TRAINING_PLANS_FILTER_SCHEMA,
        values,
      );
      resetPage();
    },
    [baseFilterChange, resetPage],
  );

  const handleClearAllFilters = useCallback(() => {
    baseClearAll();
    resetPage();
  }, [baseClearAll, resetPage]);

  const handleToggleTemplates = useCallback(
    (checked: boolean) => {
      baseFilterChange("state", checked ? [PlanState.TEMPLATE] : []);
      resetPage();
    },
    [baseFilterChange, resetPage],
  );

  return {
    params,
    pagination,
    setPagination,
    search,
    filters,
    showTemplates,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
    handleToggleTemplates,
  };
}
