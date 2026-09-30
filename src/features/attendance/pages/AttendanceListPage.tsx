// import { ViewToggle } from "@shared/ui";
import { AttendanceListHeader } from "../components/AttendanceList/AttendanceListHeader/AttendanceListHeader";
import { AttendanceListFilters } from "../components/AttendanceList/AttendanceListFilters/AttendanceListFilters";
import { AttendanceTable } from "../components/AttendanceList/AttendanceTable";
import type { AttendanceType } from "../constants";
import { useAttendanceQuery } from "../hooks/list/useAttendanceQuery";
import { useAttendanceFilters } from "../hooks/list/useAttendanceFilters";

interface AttendanceListPageProps {
  type: AttendanceType;
  personId?: string;
  personName?: string;
  onPersonClear?: () => void;
}

export default function AttendanceListPage({
  type,
  personId,
  personName,
  onPersonClear,
}: AttendanceListPageProps) {
  const {
    params,
    pagination,
    search,
    monthFilter,
    yearFilter,
    dateFilter,
    departureFilter,
    viewMode,
    // setViewMode,
    setPagination,
    handleSearch,
    clearSearch,
    handleMonthChange,
    handleYearChange,
    handleDateChange,
    handleDepartureChange,
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
        searchValue={search}
        onSearch={handleSearch}
        onSearchClear={clearSearch}
        monthFilter={monthFilter}
        yearFilter={yearFilter}
        dateFilter={dateFilter}
        departureFilter={departureFilter}
        onMonthChange={handleMonthChange}
        onYearChange={handleYearChange}
        onDateChange={handleDateChange}
        onDepartureChange={handleDepartureChange}
        onClearAllFilters={handleClearAllFilters}
        personName={personName}
        onPersonClear={onPersonClear}
        type={type}
        // actions={
        //   <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        // }
      />

      <AttendanceTable
        data={attendances}
        type={type}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        viewMode={viewMode}
      />
    </div>
  );
}
