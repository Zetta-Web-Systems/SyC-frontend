import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { CalendarDays, Pencil, UserCheck, UserX } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Button } from "@shared/ui";
import type { ViewMode } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { INSTRUCTOR_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { Instructor } from "../../types";
import { instructorsColumns } from "./instructorsTable.columns";
import { InstructorCard } from "./InstructorCard";

interface InstructorsTableProps {
  data: Instructor[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  viewMode: ViewMode;
  onEdit: (instructor: Instructor) => void;
  onDelete: (instructor: Instructor) => void;
  onRestore: (instructor: Instructor) => void;
}

export function InstructorsTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  viewMode,
  onEdit,
  onDelete,
  onRestore,
}: InstructorsTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: INSTRUCTOR_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<Instructor, unknown>[]>(
    () => [
      ...instructorsColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const instructor = row.original;

          return (
            <div className="flex place-content-center gap-1">
              {instructor.isActive ? (
                <>
                  <Button
                    variant="ghost"
                    intent="secondary"
                    size="icon"
                    aria-label={`Editar profesor ${instructor.name} ${instructor.lastname}`}
                    onClick={() => onEdit(instructor)}
                  >
                    <Pencil size={16} aria-hidden="true" color="green" />
                  </Button>
                  <Link
                    to="/attendances"
                    search={{
                      type: "INSTRUCTOR" as const,
                      personId: instructor.personId,
                    }}
                  >
                    <Button
                      variant="ghost"
                      intent="secondary"
                      size="icon"
                      aria-label={`Ver asistencias de ${instructor.name} ${instructor.lastname}`}
                    >
                      <CalendarDays size={16} aria-hidden="true" />
                    </Button>
                  </Link>
                  <Button
                    variant="ghost"
                    intent="danger"
                    size="icon"
                    aria-label={`Eliminar profesor ${instructor.name} ${instructor.lastname}`}
                    onClick={() => onDelete(instructor)}
                  >
                    <UserX size={16} aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  intent="secondary"
                  size="icon"
                  aria-label={`Restaurar profesor ${instructor.name} ${instructor.lastname}`}
                  onClick={() => onRestore(instructor)}
                >
                  <UserCheck size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onRestore],
  );

  const handlePageIndexChange = useCallback(
    (pageIndex: number) => {
      onPaginationChange((prev) => ({ ...prev, pageIndex }));
    },
    [onPaginationChange],
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      onPaginationChange({ pageIndex: 0, pageSize });
    },
    [onPaginationChange],
  );

  const cardList = (
    <>
      <DataCardList
        data={data}
        isLoading={isLoading}
        noResultsMessage="No se encontraron profesores."
        className="flex-row flex-wrap justify-center"
        renderCard={(instructor) => (
          <div key={instructor.id} className="w-full sm:w-80">
            <InstructorCard
              instructor={instructor}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          </div>
        )}
      />
      <StandalonePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={rowCount}
        onPageIndexChange={handlePageIndexChange}
        onPageSizeChange={handlePageSizeChange}
      />
    </>
  );

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop */}
      <div className="hidden md:block">
        {viewMode === "table" ? (
          <DataTable
            columns={columns}
            data={data}
            rowCount={rowCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isLoading={isLoading}
            noResultsMessage="No se encontraron profesores."
            showPagination={true}
            renderPagination={(table) => <DataTablePagination table={table} />}
          />
        ) : (
          cardList
        )}
      </div>

      {/* Mobile */}
      <div className="md:hidden">{cardList}</div>
    </div>
  );
}

InstructorsTable.displayName = "InstructorsTable";
