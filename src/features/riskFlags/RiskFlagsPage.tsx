import { RiskFlagsHeader } from "./components/RiskFlagsList/RiskFlagsHeader/RiskFlagsHeader";
import { RiskFlagsTable } from "./components/RiskFlagsList/RiskFlagsTable";
import { RiskFlagsFilters } from "./components/RiskFlagsList/RiskFlagsFilters/RiskFlagsFilters";
import { useRiskFlagsQuery } from "./hooks/useRiskFlagsQuery";
import { useRiskFlagsFilters } from "./hooks/useRiskFlagsFilters";
import { useRiskFlagsActions } from "./hooks/useRiskFlagsActions";

export default function RiskFlagsPage() {
  const {
    params,
    pagination,
    filters,
    setPagination,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
  } = useRiskFlagsFilters();

  const { data, isLoading, isPlaceholderData } = useRiskFlagsQuery(params);

  const { handleOpenRegister, handleOpenEdit, handleDelete, handleRestore } =
    useRiskFlagsActions();

  const riskFlags = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <RiskFlagsHeader onCreate={handleOpenRegister} />

      <RiskFlagsFilters
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
      />

      <RiskFlagsTable
        data={riskFlags}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onRestore={handleRestore}
      />
    </div>
  );
}
