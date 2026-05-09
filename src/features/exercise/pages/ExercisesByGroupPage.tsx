import { useNavigate } from "@tanstack/react-router";
import { ViewToggle } from "@shared/ui";
import type { ExerciseGroup } from "../types";
import { useExercisesQuery } from "../hooks/useExercisesQuery";
import { useExercisesFilters } from "../hooks/useExercisesFilters";
import { useExercisesActions } from "../hooks/useExercisesActions";
import { useGroupExercisesQuery } from "../hooks/useGroupExercisesQuery";
import { ExercisesHeader } from "../components/ExercisesList/ExercisesHeader/ExercisesHeader";
import { ExercisesFilters } from "../components/ExercisesList/ExercisesFilters/ExercisesFilters";
import { ExercisesTable } from "../components/ExercisesList/ExercisesTable";

interface ExercisesByGroupPageProps {
  groupId: string;
}

export default function ExercisesByGroupPage({
  groupId,
}: ExercisesByGroupPageProps) {
  const navigate = useNavigate();

  const {
    params,
    pagination,
    setPagination,
    filters,
    viewMode,
    setViewMode,
    handleSearch,
    handleFilterChange,
    handleClearAllFilters,
  } = useExercisesFilters(groupId);

  const { data, isLoading, isPlaceholderData } = useExercisesQuery(params);

  const { data: groupsData, isLoading: isLoadingGroups } =
    useGroupExercisesQuery({ page: 1, size: 100 });

  const {
    handleOpenRegister,
    handleOpenEdit,
    handleSoftDelete,
    handlePhysicalDelete,
    handleRestore,
  } = useExercisesActions(groupId);

  const exercises = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;
  const groups = groupsData?.data ?? [];
  const currentGroup = groups.find((g) => g.id === groupId) ?? null;

  function handleGroupChange(group: ExerciseGroup) {
    if (group.id === groupId) return;
    navigate({
      to: "/exercises/$groupId",
      params: { groupId: group.id },
    });
  }

  function handleBack() {
    navigate({ to: "/exercises" });
  }

  return (
    <div className="flex flex-col gap-4">
      <ExercisesHeader
        currentGroup={currentGroup}
        groups={groups}
        isLoadingGroups={isLoadingGroups}
        onGroupChange={handleGroupChange}
        onCreate={handleOpenRegister}
        onBack={handleBack}
      />

      <ExercisesFilters
        onSearch={handleSearch}
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
        actions={
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        }
      />

      <ExercisesTable
        data={exercises}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onEdit={handleOpenEdit}
        onSoftDelete={handleSoftDelete}
        onPhysicalDelete={handlePhysicalDelete}
        onRestore={handleRestore}
        viewMode={viewMode}
      />
    </div>
  );
}
