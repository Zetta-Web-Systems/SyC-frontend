import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Ban, CalendarPlus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@shared/ui";
import type { ViewMode } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { TRAINING_PLAN_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import { PlanState } from "../../constants";
import type { TrainingPlanSimple } from "../../types";
import {
  getTrainingPlanDescription,
  getTrainingPlanKind,
  TRAINING_PLAN_KIND,
} from "../../lib/trainingPlanKind";
import { TrainingPlanCard } from "../common";
import { trainingPlansColumns } from "./TrainingPlansTable.columns";
import { TrainingPlanCardMenu } from "./TrainingPlanCardMenu";

interface TrainingPlansTableProps {
  data: TrainingPlanSimple[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  showTemplates: boolean;
  viewMode: ViewMode;
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
  showTemplates,
  viewMode,
  onEdit,
  onDelete,
  onExtend,
}: TrainingPlansTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: TRAINING_PLAN_TABLE_VISIBILITY,
  });

  const effectiveColumnVisibility = useMemo(
    () =>
      showTemplates ? { ...columnVisibility, dates: false } : columnVisibility,
    [columnVisibility, showTemplates],
  );

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
          const isCancelled = trainingPlan.state === PlanState.CANCELLED;
          const isCompleted = trainingPlan.state === PlanState.COMPLETED;
          const canExtend = kind === TRAINING_PLAN_KIND.REGULAR && !isCancelled;

          return (
            <div className="flex place-content-center gap-1">
              <>
                {canExtend && (
                  <Button
                    variant="ghost"
                    intent="secondary"
                    size="icon"
                    aria-label={`Extender ${description}`}
                    onClick={() => onExtend(trainingPlan)}
                  >
                    <CalendarPlus size={16} aria-hidden="true" />
                  </Button>
                )}
                {!isCompleted && (
                  <Button
                    variant="ghost"
                    intent="success"
                    size="icon"
                    aria-label={`Editar ${description}`}
                    onClick={() => onEdit(trainingPlan)}
                  >
                    <Pencil size={16} aria-hidden="true" color="green" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  intent="danger"
                  size="icon"
                  aria-label={`${isCancelled ? "Eliminar" : "Cancelar"} ${description}`}
                  onClick={() => onDelete(trainingPlan)}
                >
                  {isCancelled ? (
                    <Trash2 size={16} aria-hidden="true" />
                  ) : (
                    <Ban size={16} aria-hidden="true" />
                  )}
                </Button>
              </>
            </div>
          );
        },
      },
    ],
    [onEdit, onDelete, onExtend],
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
        noResultsMessage="No se encontraron planificaciones."
        className="flex-row flex-wrap justify-center"
        renderCard={(trainingPlan) => (
          <div key={trainingPlan.id} className="w-full sm:w-90">
            <TrainingPlanCard
              plan={trainingPlan}
              actions={
                <TrainingPlanCardMenu
                  trainingPlan={trainingPlan}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onExtend={onExtend}
                />
              }
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
            columnVisibility={effectiveColumnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isLoading={isLoading}
            noResultsMessage="No se encontraron planificaciones."
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

TrainingPlansTable.displayName = "TrainingPlansTable";
