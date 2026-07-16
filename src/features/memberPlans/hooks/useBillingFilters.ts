import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import {
  DEFAULT_PAGE_SIZE,
  ORDER_TYPE,
} from "@shared/constants/pagination.constants";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";
import { useFilters } from "@shared/hooks/useFilters";
import { BILLING_FILTER_SCHEMA } from "../constants";

export function useBillingFilters(initialSearch?: string) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState(initialSearch ?? "");

  const {
    filters,
    filterEntries,
    handleFilterChange: baseFilterChange,
    handleClearAllFilters: baseClearAll,
  } = useFilters(BILLING_FILTER_SCHEMA);

  // Por defecto, ordena por estado DESC: trae vencidas y pendientes primero.
  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    orderBy: "feeState",
    orderType: ORDER_TYPE.DESC,
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
      baseFilterChange(key as keyof typeof BILLING_FILTER_SCHEMA, values);
      resetPage();
    },
    [baseFilterChange, resetPage],
  );

  const handleClearSearch = useCallback(() => {
    setSearch("");
    resetPage();
  }, [resetPage]);

  const handleClearAllFilters = useCallback(() => {
    baseClearAll();
    setSearch("");
    resetPage();
  }, [baseClearAll, resetPage]);

  return {
    params,
    pagination,
    setPagination,
    filters,
    search,
    handleSearch,
    handleClearSearch,
    handleFilterChange,
    handleClearAllFilters,
  };
}
