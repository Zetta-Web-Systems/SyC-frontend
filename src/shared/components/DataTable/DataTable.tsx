import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
  SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { LoadingState } from "@shared/components/LoadingState/LoadingState";
import { DataTablePagination } from "./DataTablePagination";

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  isLoading?: boolean;
  noResultsMessage?: string;
  showPagination?: boolean;
}

export function DataTable<TData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  isLoading = false,
  noResultsMessage = "No se encontraron resultados.",
  showPagination = true,
}: DataTableProps<TData>) {
  const hasSorting = !!onSortingChange;

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
      ...(hasSorting && { sorting }),
    },
    onPaginationChange,
    ...(hasSorting && { onSortingChange }),
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr
                key={headerGroup.id}
                className="border-b border-primary-100 bg-primary-500"
              >
                {headerGroup.headers.map((header) => {
                  const canSort = hasSorting && header.column.getCanSort();
                  const sorted = header.column.getIsSorted();

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white",
                        "border-l border-primary-100 first:border-l-0",
                        canSort && "cursor-pointer select-none",
                      )}
                      onClick={
                        canSort
                          ? header.column.getToggleSortingHandler()
                          : undefined
                      }
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex items-center justify-center gap-1.5">
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                          {canSort && (
                            <span className="text-neutral-400">
                              {sorted === "asc" ? (
                                <ArrowUp size={14} aria-hidden="true" />
                              ) : sorted === "desc" ? (
                                <ArrowDown size={14} aria-hidden="true" />
                              ) : (
                                <ArrowUpDown size={14} aria-hidden="true" />
                              )}
                            </span>
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-0">
                  <LoadingState message="Cargando..." />
                </td>
              </tr>
            ) : table.getRowModel().rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-4 py-12 text-center text-sm text-neutral-400"
                >
                  {noResultsMessage}
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-primary-50/50"
                >
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      className={cn(
                        "px-4 py-4 text-center text-neutral-700",
                        "border-l border-neutral-200 first:border-l-0",
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </div>
  );
}

DataTable.displayName = "DataTable";
