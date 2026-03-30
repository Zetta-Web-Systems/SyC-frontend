import type { OrderType } from "@shared/constants/pagination.constants";

export interface PaginatedParams {
  page: number;
  size: number;
  orderBy?: string;
  orderType?: OrderType;
  search?: string;
  filters?: string[];
  filtersValues?: string[];
}

export interface PaginationMeta {
  total: number;
  page: number;
  size: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: PaginationMeta;
}
