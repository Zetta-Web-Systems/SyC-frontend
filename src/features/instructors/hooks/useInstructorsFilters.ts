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
  const [statusFilter, setStatusFilter] = useState("");
  const [orderByValue, setOrderByValue] = useState("recent");

  const order = ORDER_MAP[orderByValue] ?? ORDER_MAP.recent;

  const params: PaginatedParams = {
    page: toApiPage(pagination.pageIndex),
    size: pagination.pageSize,
    orderBy: order.orderBy,
    orderType: order.orderType,
    search: search || undefined,
    ...(statusFilter && {
      filters: ["user.isActive"],
      filtersValues: [statusFilter],
    }),
  };

  const handleSearch = useCallback((value: string) => {
    setSearch(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleStatusChange = useCallback((value: string) => {
    setStatusFilter(value);
    setPagination((prev) => ({ ...prev, pageIndex: 0 }));
  }, []);

  const handleOrderByChange = useCallback((value: string) => {
    setOrderByValue(value);
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
  };
}
