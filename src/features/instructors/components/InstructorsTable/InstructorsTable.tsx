import { useMemo } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Pencil, UserCheck, UserX } from "lucide-react";
import { Button } from "@shared/ui";
import { DataTable } from "@shared/components/DataTable";
import { DataCardList } from "@shared/components/DataTable";
import { DataTablePagination } from "@shared/components/DataTable";
import { useReactTable, getCoreRowModel } from "@tanstack/react-table";
import type { Instructor } from "../../types";
import { instructorsColumns } from "./instructorsTable.columns";
import { InstructorCard } from "./InstructorCard";

interface InstructorsTableProps {
  data: Instructor[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
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
  onEdit,
  onDelete,
  onRestore,
}: InstructorsTableProps) {
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
                    <Pencil size={16} aria-hidden="true" />
                  </Button>
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

  const table = useReactTable({
    data,
    columns,
    rowCount,
    state: { pagination },
    onPaginationChange,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
  });

  return (
    <div className="flex flex-col gap-3">
      {/* Desktop */}
      <div className="hidden md:block">
        <DataTable
          columns={columns}
          data={data}
          rowCount={rowCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          isLoading={isLoading}
          noResultsMessage="No se encontraron profesores."
          showPagination={false}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">
        <DataCardList
          data={data}
          isLoading={isLoading}
          noResultsMessage="No se encontraron profesores."
          renderCard={(instructor) => (
            <InstructorCard
              key={instructor.id}
              instructor={instructor}
              onEdit={onEdit}
              onDelete={onDelete}
              onRestore={onRestore}
            />
          )}
        />
      </div>

      <DataTablePagination table={table} />
    </div>
  );
}

InstructorsTable.displayName = "InstructorsTable";
