import { useCallback } from "react";
import type { OnChangeFn, PaginationState } from "@tanstack/react-table";
import {
  DataTable,
  DataCardList,
  DataTablePagination,
  StandalonePagination,
} from "@shared/components/DataTable";
import { useColumnVisibility } from "@shared/hooks/useColumnVisibility";
import { ATTENDANCE_TABLE_VISIBILITY } from "@shared/constants/tableVisibility.constants";
import type { ViewMode } from "@shared/ui";
import type { Attendance } from "../../types";
import { attendanceColumns } from "./AttendanceTable.columns";
import { AttendanceCard } from "./AttendanceCard";

interface AttendanceTableProps {
  data: Attendance[];
  rowCount: number;
  pagination: PaginationState;
  onPaginationChange: OnChangeFn<PaginationState>;
  isLoading: boolean;
  viewMode: ViewMode;
}

export function AttendanceTable({
  data,
  rowCount,
  pagination,
  onPaginationChange,
  isLoading,
  viewMode,
}: AttendanceTableProps) {
  const { columnVisibility, setColumnVisibility } = useColumnVisibility({
    config: ATTENDANCE_TABLE_VISIBILITY,
  });

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
        noResultsMessage="No se encontraron asistencias."
        className="grid grid-cols-1 gap-3 lg:grid-cols-2 lg:max-w-5xl lg:mx-auto"
        renderCard={(attendance) => (
          <AttendanceCard key={attendance.id} attendance={attendance} />
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
            columns={attendanceColumns}
            data={data}
            rowCount={rowCount}
            pagination={pagination}
            onPaginationChange={onPaginationChange}
            columnVisibility={columnVisibility}
            onColumnVisibilityChange={setColumnVisibility}
            isLoading={isLoading}
            noResultsMessage="No se encontraron asistencias."
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

AttendanceTable.displayName = "AttendanceTable";
