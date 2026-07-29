import { useMemo, useCallback } from "react";
import type {
  ColumnDef,
  OnChangeFn,
  PaginationState,
} from "@tanstack/react-table";
import { Eye, DollarSign } from "lucide-react";
import { Button } from "@shared/ui";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { BILLING_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { Fee } from "../../types";
import { FEE_STATE } from "../../types";
import { billingColumns } from "./BillingTable.columns";
import { FeeCard } from "./FeeCard";

interface BillingTableProps {
  data: Fee[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  onViewDetail: (fee: Fee) => void;
  onRegisterPayment: (fee: Fee) => void;
}

export function BillingTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  onViewDetail,
  onRegisterPayment,
}: BillingTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: BILLING_TABLE_VISIBILITY,
  });

  const columns = useMemo<ColumnDef<Fee, unknown>[]>(
    () => [
      ...billingColumns,
      {
        id: "actions",
        header: "Acciones",
        cell: ({ row }) => {
          const fee = row.original;
          const payable = fee.feeState !== FEE_STATE.PAID;
          const fullName = `${fee.member.name} ${fee.member.lastname}`;

          return (
            <div className="flex place-content-center gap-1">
              <Button
                variant="ghost"
                intent="primary"
                size="icon"
                aria-label={`Ver detalle de la cuota de ${fullName}`}
                onClick={() => onViewDetail(fee)}
              >
                <Eye size={16} aria-hidden="true" />
              </Button>
              {payable && (
                <Button
                  variant="ghost"
                  intent="success"
                  size="icon"
                  aria-label={`Registrar pago de ${fullName}`}
                  onClick={() => onRegisterPayment(fee)}
                >
                  <DollarSign size={16} aria-hidden="true" />
                </Button>
              )}
            </div>
          );
        },
      },
    ],
    [onViewDetail, onRegisterPayment],
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
        noResultsMessage="No se encontraron cuotas."
        className="flex-row flex-wrap justify-center"
        renderCard={(fee) => (
          <div key={fee.id} className="w-full sm:w-80">
            <FeeCard
              fee={fee}
              onViewDetail={onViewDetail}
              onRegisterPayment={onRegisterPayment}
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
          noResultsMessage="No se encontraron cuotas."
          showPagination={true}
          renderPagination={(table) => <DataTablePagination table={table} />}
        />
      </div>

      {/* Mobile */}
      <div className="md:hidden">{cardList}</div>
    </div>
  );
}

BillingTable.displayName = "BillingTable";
