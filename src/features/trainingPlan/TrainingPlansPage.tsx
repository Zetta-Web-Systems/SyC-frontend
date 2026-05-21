import { TrainingPlansHeader } from "./components/TrainingPlansList/TrainingPlansHeader/TrainingPlansHeader";
import { TrainingPlansFilters } from "./components/TrainingPlansList/TrainingPlansFilters/TrainingPlansFilters";
import { TrainingPlansTable } from "./components/TrainingPlansList/TrainingPlansTable";
import { useTrainingPlansQuery } from "./hooks/useTrainingPlansQuery";
import { useTrainingPlansFilters } from "./hooks/useTrainingPlansFilters";
import { useTrainingPlansActions } from "./hooks/useTrainingPlansActions";

export default function TrainingPlansPage() {
  const {
    params,
    pagination,
    setPagination,
    filters,
    showTemplates,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
    handleToggleTemplates,
  } = useTrainingPlansFilters();

  const { data, isLoading, isPlaceholderData } = useTrainingPlansQuery(params);

  const { handleOpenRegister, handleOpenEdit, handleDelete, handleExtend } =
    useTrainingPlansActions();

  const trainingPlans = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <TrainingPlansHeader onCreate={handleOpenRegister} />

      <TrainingPlansFilters
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        showTemplates={showTemplates}
        onToggleTemplates={handleToggleTemplates}
      />

      <TrainingPlansTable
        data={trainingPlans}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        onExtend={handleExtend}
      />
    </div>
  );
}
