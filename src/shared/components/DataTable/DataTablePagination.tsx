import type { Table } from "@tanstack/react-table";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "@shared/ui";
import { PageButton, NavButton } from "@shared/components/DataTable";
import {
  PAGE_SIZE_OPTIONS,
  MAX_VISIBLE_PAGES,
  MAX_VISIBLE_PAGES_MOBILE,
} from "@shared/constants/pagination.constants";
import { getVisiblePages } from "@shared/utils/pagination.utils";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

interface PageButtonsProps {
  pages: number[];
  currentPage: number;
  onPageChange: (page: number) => void;
}

function PageButtons({ pages, currentPage, onPageChange }: PageButtonsProps) {
  return pages.map((page) =>
    page < 0 ? (
      <span
        key={page}
        className="flex h-8 w-8 items-center justify-center text-sm text-neutral-400"
      >
        ...
      </span>
    ) : (
      <PageButton
        key={page}
        page={page}
        isActive={page === currentPage}
        onClick={() => onPageChange(page - 1)}
      />
    ),
  );
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const rowCount = table.getRowCount();
  const currentPage = pageIndex + 1;

  if (rowCount === 0) return null;

  const rangeStart = pageIndex * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, rowCount);

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

  const handlePageChange = (pageIdx: number) => table.setPageIndex(pageIdx);

  return (
    <div className="flex items-center justify-between px-1 py-3">
      <span className="hidden whitespace-nowrap text-sm text-neutral-500 md:inline">
        Mostrando {rangeStart}-{rangeEnd} de {rowCount}
      </span>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
        </NavButton>

        <div className="hidden items-center gap-1 md:flex">
          <PageButtons
            pages={visiblePages}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <PageButtons
            pages={visiblePagesMobile}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>

        <NavButton
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Pagina siguiente"
        >
          <span className="hidden sm:inline">Siguiente</span>
          <ChevronRight size={16} aria-hidden="true" />
        </NavButton>
      </div>

      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span className="hidden whitespace-nowrap lg:inline">
          Items por pagina:
        </span>
        <div className="w-18">
          <Select
            value={String(pageSize)}
            onChange={(e) => table.setPageSize(Number(e.target.value))}
            size="sm"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={String(size)}>
                {size}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}

DataTablePagination.displayName = "DataTablePagination";
