import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { Button } from "@shared/ui";
import type { ViewMode } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { EXERCISE_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { Exercise } from "../../types";
import { exercisesColumns } from "./ExercisesTable.columns";
import { ExerciseCard } from "./ExerciseCard";

interface ExercisesTableProps {
  data: Exercise[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onEdit: (exercise: Exercise) => void;
  onSoftDelete: (exercise: Exercise) => void;
  onPhysicalDelete: (exercise: Exercise) => void;
  onRestore: (exercise: Exercise) => void;
  viewMode?: ViewMode;
}

export function ExercisesTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  onEdit,
  onSoftDelete,
  onPhysicalDelete,
  onRestore,
  viewMode = "table",
}: ExercisesTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: EXERCISE_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<Exercise, unknown>[]>(
    () => [
      ...exercisesColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const exercise = row.original;

          return (
            <div className="flex place-content-center gap-1">
              {exercise.isActive ? (
                <>
                  <Button
                    variant="ghost"
                    intent="success"
                    size="icon"
                    aria-label={`Editar ejercicio ${exercise.name}`}
                    onClick={() => onEdit(exercise)}
                  >
                    <Pencil size={16} aria-hidden="true" color="green" />
                  </Button>
                  <Button
                    variant="ghost"
                    intent="danger"
                    size="icon"
                    aria-label={`Desactivar ejercicio ${exercise.name}`}
                    onClick={() => onSoftDelete(exercise)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    intent="secondary"
                    size="icon"
                    aria-label={`Restaurar ejercicio ${exercise.name}`}
                    onClick={() => onRestore(exercise)}
                  >
                    <RotateCcw size={16} aria-hidden="true" />
                  </Button>
                  <Button
                    variant="ghost"
                    intent="danger"
                    size="icon"
                    aria-label={`Eliminar definitivamente ejercicio ${exercise.name}`}
                    onClick={() => onPhysicalDelete(exercise)}
                  >
                    <X size={16} aria-hidden="true" />
                  </Button>
                </>
              )}
            </div>
          );
        },
      },
    ],
    [onEdit, onSoftDelete, onPhysicalDelete, onRestore],
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
        noResultsMessage="No se encontraron ejercicios."
        className="flex-row flex-wrap justify-center"
        renderCard={(exercise) => (
          <div key={exercise.id} className="w-full sm:w-80">
            <ExerciseCard
              exercise={exercise}
              onEdit={onEdit}
              onSoftDelete={onSoftDelete}
              onPhysicalDelete={onPhysicalDelete}
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
            noResultsMessage="No se encontraron ejercicios."
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
