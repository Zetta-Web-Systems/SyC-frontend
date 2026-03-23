import type { Table } from "@tanstack/react-table";
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button, Select } from "@shared/ui";
import { PAGE_SIZE_OPTIONS } from "@shared/constants/pagination.constants";

interface DataTablePaginationProps<TData> {
  table: Table<TData>;
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const pageCount = table.getPageCount();
  const currentPage = pageIndex + 1;

  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-2 text-sm text-neutral-500">
        <span>Filas por pagina:</span>
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
      </div>

      <div className="flex items-center gap-2">
        <span className="text-sm text-neutral-500">
          Pagina {currentPage} de {pageCount || 1}
        </span>

        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            intent="neutral"
            size="icon"
            onClick={() => table.firstPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Primera pagina"
          >
            <ChevronsLeft size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            intent="neutral"
            size="icon"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Pagina anterior"
          >
            <ChevronLeft size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            intent="neutral"
            size="icon"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Pagina siguiente"
          >
            <ChevronRight size={16} aria-hidden="true" />
          </Button>
          <Button
            variant="outline"
            intent="neutral"
            size="icon"
            onClick={() => table.lastPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Ultima pagina"
          >
            <ChevronsRight size={16} aria-hidden="true" />
          </Button>
        </div>
      </div>
    </div>
  );
}

DataTablePagination.displayName = "DataTablePagination";
