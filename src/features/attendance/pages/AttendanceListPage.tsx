// import { ViewToggle } from "@shared/ui";
import { AttendanceListHeader } from "../components/AttendanceList/AttendanceListHeader/AttendanceListHeader";
import { AttendanceListFilters } from "../components/AttendanceList/AttendanceListFilters/AttendanceListFilters";
import { AttendanceTable } from "../components/AttendanceList/AttendanceTable";
import { useAttendanceQuery } from "../hooks/list/useAttendanceQuery";
import { useAttendanceFilters } from "../hooks/list/useAttendanceFilters";

interface AttendanceListPageProps {
  type: "INSTRUCTOR" | "MEMBER";
  personId?: string;
}

export default function AttendanceListPage({
  type,
  personId,
}: AttendanceListPageProps) {
  const {
    params,
    pagination,
    monthFilter,
    yearFilter,
    dateFilter,
    viewMode,
    // setViewMode,
    setPagination,
    handleSearch,
    handleMonthChange,
    handleYearChange,
    handleDateChange,
    handleClearAllFilters,
  } = useAttendanceFilters({
    type,
    initialPersonId: personId,
  });

  const { data, isLoading, isPlaceholderData } = useAttendanceQuery(params);

  const attendances = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <AttendanceListHeader type={type} />

      <AttendanceListFilters
        onSearch={handleSearch}
        monthFilter={monthFilter}
        yearFilter={yearFilter}
        dateFilter={dateFilter}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDateChange={handleDateChange}
        onClearAllFilters={handleClearAllFilters}
        // actions={
        //   <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        // }
      />

      <AttendanceTable
        data={attendances}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        viewMode={viewMode}
      />
    </div>
  );
}
