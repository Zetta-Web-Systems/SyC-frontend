import type { PaginatedParams } from "@shared/types/pagination.types";

/**
 * Convierte un 0-based pageIndex de TanStack Table a un número de página 1-based para la API.
 */
export function toApiPage(pageIndex: number): number {
  return pageIndex + 1;
}

/**
 * Convierte un número de página 1-based de la API a un 0-based pageIndex de TanStack Table.
 */
export function toTablePageIndex(page: number): number {
  return page - 1;
}

/**
 * Buildea un registro plano de query params a partir de PaginatedParams,
 * adecuado para pasar como `params` de Axios.
 */
export function buildPaginatedParams(
  params: PaginatedParams,
): Record<string, string | number | string[] | undefined> {
  const query: Record<string, string | number | string[] | undefined> = {
    page: params.page,
    size: params.size,
  };

  if (params.orderBy) {
    query.orderBy = params.orderBy;
  }

  if (params.orderType) {
    query.orderType = params.orderType;
  }

  if (params.search) {
    query.search = params.search;
  }

  if (params.filters && params.filters.length > 0) {
    query.filters = params.filters;
  }

  if (params.filtersValues && params.filtersValues.length > 0) {
    query.filtersValues = params.filtersValues;
  }

  return query;
}

/**
 * Calcula qué números de página mostrar en la paginación
 */
export function getVisiblePages(
  currentPage: number,
  pageCount: number,
  maxVisible: number,
): number[] {
  if (pageCount <= maxVisible) {
    return Array.from({ length: pageCount }, (_, i) => i + 1);
  }

  const half = Math.floor(maxVisible / 2);
  let start = currentPage - half;
  let end = currentPage + half;

  if (start < 1) {
    start = 1;
    end = maxVisible;
  }

  if (end > pageCount) {
    end = pageCount;
    start = pageCount - maxVisible + 1;
  }

  const pages: number[] = [];

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push(-1);
  }

  for (let i = start; i <= end; i++) {
    if (!pages.includes(i)) pages.push(i);
  }

  if (end < pageCount) {
    if (end < pageCount - 1) pages.push(-2);
    pages.push(pageCount);
  }

  return pages;
}
