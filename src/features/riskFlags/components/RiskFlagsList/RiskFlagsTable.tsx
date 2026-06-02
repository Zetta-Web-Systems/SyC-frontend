import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Pencil, UserCheck, Trash2 } from "lucide-react";
import { Button } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { GuidelineButton } from "@shared/components/Guideline";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { RISK_FLAG_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { RiskFlag } from "../../types";
import { riskFlagsColumns } from "./RiskFlagsTable.columns";
import { RiskFlagCard } from "./RiskFlagCard";

interface RiskFlagsTableProps {
  data: RiskFlag[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onEdit: (riskFlag: RiskFlag) => void;
  onDelete: (riskFlag: RiskFlag) => void;
  onRestore: (riskFlag: RiskFlag) => void;
}

export function RiskFlagsTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  onEdit,
  onDelete,
  onRestore,
}: RiskFlagsTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: RISK_FLAG_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<RiskFlag, unknown>[]>(
    () => [
      ...riskFlagsColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const riskFlag = row.original;

          return (
            <div className="flex place-content-center gap-1">
              {riskFlag.isActive ? (
                <>
                  <Button
                    variant="ghost"
                    intent="success"
                    size="icon"
                    aria-label={`Editar bandera de riesgo ${riskFlag.name}`}
                    onClick={() => onEdit(riskFlag)}
                  >
                    <Pencil size={16} aria-hidden="true" color="green" />
                  </Button>
                  <GuidelineButton
                    guideline={riskFlag.medicalGuideline}
                    riskFlagName={riskFlag.name}
                  />
                  <Button
                    variant="ghost"
                    intent="danger"
                    size="icon"
                    aria-label={`Eliminar bandera de riesgo ${riskFlag.name}`}
                    onClick={() => onDelete(riskFlag)}
                  >
                    <Trash2 size={16} aria-hidden="true" />
                  </Button>
                </>
              ) : (
                <Button
                  variant="ghost"
                  intent="secondary"
                  size="icon"
                  aria-label={`Restaurar bandera de riesgo ${riskFlag.name}`}
                  onClick={() => onRestore(riskFlag)}
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
        noResultsMessage="No se encontraron banderas de riesgo."
        className="flex-row flex-wrap justify-center"
        renderCard={(riskFlag) => (
          <div key={riskFlag.id} className="w-full sm:w-80">
            <RiskFlagCard
              riskFlag={riskFlag}
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
        <DataTable
          columns={columns}
          data={data}
          rowCount={rowCount}
          pagination={pagination}
          onPaginationChange={onPaginationChange}
          columnVisibility={columnVisibility}
          onColumnVisibilityChange={setColumnVisibility}
          isLoading={isLoading}
          noResultsMessage="No se encontraron banderas de riesgo."
          showPagination={true}
          renderPagination={(table) => <DataTablePagination table={table} />}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">{cardList}</div>
    </div>
  );
}

RiskFlagsTable.displayName = "RiskFlagsTable";
