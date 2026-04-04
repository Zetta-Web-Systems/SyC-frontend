import type { ReactNode } from "react";
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
  Table,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { LoadingState } from "@shared/components/LoadingState/LoadingState";
import { DataTablePagination } from "./DataTablePagination";

type ColumnVisibilityState = Record<string, boolean>;

export interface DataTableProps<TData> {
  columns: ColumnDef<TData, unknown>[];
  data: TData[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  sorting?: SortingState;
  onSortingChange?: OnChangeFn<SortingState>;
  columnVisibility?: ColumnVisibilityState;
  onColumnVisibilityChange?: OnChangeFn<ColumnVisibilityState>;
  isLoading?: boolean;
  noResultsMessage?: string;
  showPagination?: boolean;
  renderPagination?: (table: Table<TData>) => ReactNode;
}

export function DataTable<TData>({
  columns,
  data,
  rowCount,
  pagination,
  onPaginationChange,
  sorting,
  onSortingChange,
  columnVisibility,
  onColumnVisibilityChange,
  isLoading = false,
  noResultsMessage = "No se encontraron resultados.",
  showPagination = true,
  renderPagination,
}: DataTableProps<TData>) {
  const hasSorting = !!onSortingChange;
  const hasColumnVisibility = !!columnVisibility;

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: {
      pagination,
      ...(hasSorting && { sorting }),
      ...(hasColumnVisibility && { columnVisibility }),
    },
    onPaginationChange,
    ...(hasSorting && { onSortingChange }),
    ...(hasColumnVisibility && { onColumnVisibilityChange }),
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
                  const metaClassName = (
                    header.column.columnDef.meta as
                      | { className?: string }
                      | undefined
                  )?.className;

                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className={cn(
                        "px-4 py-3 text-center text-xs font-semibold uppercase tracking-wider text-white",
                        "border-l border-primary-100 first:border-l-0",
                        canSort && "cursor-pointer select-none",
                        metaClassName,
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
                  className="border-b border-neutral-100 transition-colors last:border-b-0 hover:bg-primary-50"
                >
                  {row.getVisibleCells().map((cell) => {
                    const metaClassName = (
                      cell.column.columnDef.meta as
                        | { className?: string }
                        | undefined
                    )?.className;

                    return (
                      <td
                        key={cell.id}
                        className={cn(
                          "px-4 py-4 text-center text-neutral-700",
                          "border-l border-neutral-200 first:border-l-0",
                          metaClassName,
                        )}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showPagination &&
        (renderPagination ? (
          renderPagination(table)
        ) : (
          <DataTablePagination table={table} />
        ))}
    </div>
  );
}

DataTable.displayName = "DataTable";
