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
 * Basicamente convierte `filters` y `filtersValues` a keys con notación de corchetes
 * para que Axios los serialice como query params repetidos.
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
    query["filters[]"] = params.filters;
  }

  if (params.filtersValues && params.filtersValues.length > 0) {
    query["filtersValues[]"] = params.filtersValues;
  }

  return query;
}
