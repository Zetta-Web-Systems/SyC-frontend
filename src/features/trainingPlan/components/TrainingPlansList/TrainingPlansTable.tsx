import { useMemo } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { CalendarPlus, Pencil, UserX } from "lucide-react";
import { Button } from "@shared/ui";
import { DataTable, DataTablePagination } from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { TRAINING_PLAN_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { TrainingPlanSimple } from "../../types";
import {
  getTrainingPlanDescription,
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../../utils/trainingPlanKind";
import { trainingPlansColumns } from "./TrainingPlansTable.columns";

interface TrainingPlansTableProps {
  data: TrainingPlanSimple[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onEdit: (trainingPlan: TrainingPlanSimple) => void;
  onDelete: (trainingPlan: TrainingPlanSimple) => void;
  onExtend: (trainingPlan: TrainingPlanSimple) => void;
}

export function TrainingPlansTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  onEdit,
  onDelete,
  onExtend,
}: TrainingPlansTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: TRAINING_PLAN_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<TrainingPlanSimple, unknown>[]>(
    () => [
      ...trainingPlansColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const trainingPlan = row.original;
          const kind = getTrainingPlanKind(trainingPlan);
          const description = getTrainingPlanDescription(trainingPlan);
          const canExtend =
            kind === TRAINING_PLAN_KIND.REGULAR && trainingPlan.isActive;

          return (
            <div className="flex place-content-center gap-1">
              <>
                {canExtend && (
                  <Button
                    variant="ghost"
                    intent="primary"
                    size="icon"
                    aria-label={`Extender ${description}`}
                    onClick={() => onExtend(trainingPlan)}
                  >
                    <CalendarPlus size={16} aria-hidden="true" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  intent="success"
                  size="icon"
                  aria-label={`Editar ${description}`}
                  onClick={() => onEdit(trainingPlan)}
                >
                  <Pencil size={16} aria-hidden="true" color="green" />
                </Button>
                <Button
                  variant="ghost"
                  intent="danger"
                  size="icon"
                  aria-label={`Eliminar ${description}`}
                  onClick={() => onDelete(trainingPlan)}
                >
                  <UserX size={16} aria-hidden="true" />
                </Button>
              </>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onExtend],
  );

  return (
    <DataTable
      columns={columns}
      data={data}
      rowCount={rowCount}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      columnVisibility={columnVisibility}
      onColumnVisibilityChange={setColumnVisibility}
      isLoading={isLoading}
      noResultsMessage="No se encontraron planificaciones."
      showPagination={true}
      renderPagination={(table) => <DataTablePagination table={table} />}
    />
  );
}

TrainingPlansTable.displayName = "TrainingPlansTable";
