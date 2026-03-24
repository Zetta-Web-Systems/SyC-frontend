import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "@shared/ui";
import { PageButton, NavButton } from "@shared/components/DataTable";
import {
  PAGE_SIZE_OPTIONS,
  MAX_VISIBLE_PAGES,
  MAX_VISIBLE_PAGES_MOBILE,
} from "@shared/constants/pagination.constants";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

function getVisiblePages(
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
    if (end < pageCount - 1) pages.push(-1);
    pages.push(pageCount);
  }

  return pages;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();
  const currentPage = pageIndex + 1;

  const startRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1;
  const endRow = Math.min(startRow + pageSize - 1, rowCount);

  const visiblePages = getVisiblePages(
    currentPage,
    pageCount,
    MAX_VISIBLE_PAGES,
  );
  const visiblePagesMobile = getVisiblePages(
    currentPage,
    pageCount,
    MAX_VISIBLE_PAGES_MOBILE,
  );

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 md:flex-row md:justify-between md:gap-4">
      <div className="hidden items-center gap-2 text-sm text-neutral-600 md:flex">
        <Select
          value={String(pageSize)}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
          size="sm"
          className="w-18"
        >
          {PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={String(size)}>
              {size}
            </option>
          ))}
        </Select>
        <span>Filas por pagina</span>
      </div>

      <span className="text-sm font-medium text-neutral-600">
        {startRow} - {endRow} de {rowCount}
      </span>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
        </NavButton>

        <div className="hidden items-center gap-1 md:flex">
          {visiblePages.map((page, i) =>
            page === -1 ? (
              <span
                key={`ellipsis-${i}`}
                className="flex h-8 w-6 items-center justify-center text-sm text-neutral-400"
              >
                ...
              </span>
            ) : (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={() => table.setPageIndex(page - 1)}
              />
            ),
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {visiblePagesMobile.map((page, i) =>
            page === -1 ? (
              <span
                key={`ellipsis-m-${i}`}
                className="flex h-8 w-6 items-center justify-center text-sm text-neutral-400"
              >
                ...
              </span>
            ) : (
              <PageButton
                key={page}
                page={page}
                isActive={page === currentPage}
                onClick={() => table.setPageIndex(page - 1)}
              />
            ),
          )}
        </div>

        <NavButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Pagina siguiente"
        >
          <ChevronRight size={16} aria-hidden="true" />
        </NavButton>
      </div>
    </div>
  );
}

DataTablePagination.displayName = "DataTablePagination";
