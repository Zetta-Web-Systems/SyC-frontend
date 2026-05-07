import { ChevronLeft, ChevronRight } from "lucide-react";
import { Select } from "@shared/ui";
import { PageButton } from "./PageButton";
import { NavButton } from "./NavButton";
import {
  PAGE_SIZE_OPTIONS,
  MAX_VISIBLE_PAGES,
  MAX_VISIBLE_PAGES_MOBILE,
} from "@shared/constants/pagination.constants";
import { getVisiblePages } from "@shared/utils/pagination.utils";

export interface StandalonePaginationProps {
  pageIndex: number;
  pageSize: number;
  rowCount: number;
  onPageIndexChange: (pageIndex: number) => void;
  onPageSizeChange: (pageSize: number) => void;
}

interface PageButtonsProps {
  pages: number[];
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
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

export function StandalonePagination({
  pageIndex,
  pageSize,
  rowCount,
  onPageIndexChange,
  onPageSizeChange,
}: StandalonePaginationProps) {
  const pageCount = Math.ceil(rowCount / pageSize);
  const currentPage = pageIndex + 1;

  if (rowCount === 0) return null;

  const rangeStart = pageIndex * pageSize + 1;
  const rangeEnd = Math.min(currentPage * pageSize, rowCount);

  const canPreviousPage = pageIndex > 0;
  const canNextPage = currentPage < pageCount;

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
    <div className="flex items-center justify-between px-1 py-3">
      <span className="hidden whitespace-nowrap text-sm text-neutral-500 md:inline">
        Mostrando {rangeStart}-{rangeEnd} de {rowCount}
      </span>

      <div className="flex items-center gap-1">
        <NavButton
          onClick={() => onPageIndexChange(pageIndex - 1)}
          disabled={!canPreviousPage}
          aria-label="Pagina anterior"
        >
          <ChevronLeft size={16} aria-hidden="true" />
          <span className="hidden sm:inline">Anterior</span>
        </NavButton>

        <div className="hidden items-center gap-1 md:flex">
          <PageButtons
            pages={visiblePages}
            currentPage={currentPage}
            onPageChange={onPageIndexChange}
          />
        </div>

        <div className="flex items-center gap-1 md:hidden">
          <PageButtons
            pages={visiblePagesMobile}
            currentPage={currentPage}
            onPageChange={onPageIndexChange}
          />
        </div>

        <NavButton
          onClick={() => onPageIndexChange(pageIndex + 1)}
          disabled={!canNextPage}
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
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
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

StandalonePagination.displayName = "StandalonePagination";
