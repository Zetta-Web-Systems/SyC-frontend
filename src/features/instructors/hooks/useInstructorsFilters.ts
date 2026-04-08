import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import type {
  PaginatedParams,
  FilterEntry,
} from "@shared/types/pagination.types";
import type { ViewMode } from "@shared/ui";
import { toApiPage, splitFilterEntries } from "@shared/utils/pagination.utils";

export function useInstructorsFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>(["1"]);
  const [orderByValue, setOrderByValue] = useState("recent");
  const [viewMode, setViewMode] = useState<ViewMode>("table");

  const filterEntries: FilterEntry[] = [];

  if (statusFilter.length > 0) {
    filterEntries.push({ key: "user.isActive", value: statusFilter[0] });
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

  const handleStatusChange = useCallback((values: string[]) => {
    setStatusFilter(values);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleOrderByChange = useCallback((value: string) => {
    setOrderByValue(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setStatusFilter([]);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  return {
    params,
    pagination,
    setPagination,
    search,
    statusFilter,
    orderByValue,
    viewMode,
    setViewMode,
    handleSearch,
    handleStatusChange,
    handleOrderByChange,
    handleClearAllFilters,
  };
}
