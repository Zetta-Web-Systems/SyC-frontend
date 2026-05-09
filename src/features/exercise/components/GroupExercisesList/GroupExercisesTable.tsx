import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@shared/ui";
import type { ViewMode } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { GROUP_EXERCISE_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { ExerciseGroup } from "../../types";
import { groupExercisesColumns } from "./GroupExercisesTable.columns";
import { GroupExerciseCard } from "../common/GroupExerciseCard";

interface GroupExercisesTableProps {
  data: ExerciseGroup[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onEdit: (group: ExerciseGroup) => void;
  onDelete: (group: ExerciseGroup) => void;
  viewMode?: ViewMode;
}

export function GroupExercisesTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  onEdit,
  onDelete,
  viewMode = "table",
}: GroupExercisesTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: GROUP_EXERCISE_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<ExerciseGroup, unknown>[]>(
    () => [
      ...groupExercisesColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const group = row.original;

          return (
            <div className="flex place-content-center gap-1">
              <Button
                variant="ghost"
                intent="success"
                size="icon"
                aria-label={`Editar grupo de ejercicios ${group.name}`}
                onClick={() => onEdit(group)}
              >
                <Pencil size={16} aria-hidden="true" color="green" />
              </Button>
              <Button
                variant="ghost"
                intent="danger"
                size="icon"
                aria-label={`Eliminar grupo de ejercicios ${group.name}`}
                onClick={() => onDelete(group)}
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete],
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
        noResultsMessage="No se encontraron grupos de ejercicios."
        className="flex-row flex-wrap justify-center"
        renderCard={(group) => (
          <div key={group.id} className="w-full sm:w-96">
            <GroupExerciseCard
              group={group}
              onEdit={onEdit}
              onDelete={onDelete}
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
            noResultsMessage="No se encontraron grupos de ejercicios."
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

GroupExercisesTable.displayName = "GroupExercisesTable";
