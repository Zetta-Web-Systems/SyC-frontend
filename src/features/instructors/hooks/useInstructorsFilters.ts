import { useState, useCallback } from "react";
import type { PaginationState } from "@tanstack/react-table";
import { DEFAULT_PAGE_SIZE } from "@shared/constants/pagination.constants";
import { toApiPage } from "@shared/utils/pagination.utils";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { ORDER_MAP } from "../constants/instructors.constants";

export function useInstructorsFilters() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [orderByValue, setOrderByValue] = useState("recent");

  const order = ORDER_MAP[orderByValue] ?? ORDER_MAP.recent;

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    orderBy: order.orderBy,
    orderType: order.orderType,
    search: search || undefined,
    ...(statusFilter.length > 0 && {
      filters: ["user.isActive"],
      filtersValues: statusFilter,
    }),
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
    handleSearch,
    handleStatusChange,
    handleOrderByChange,
    handleClearAllFilters,
  };
}
