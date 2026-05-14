import { useNavigate } from "@tanstack/react-router";
import { ViewToggle } from "@shared/ui";
import { GroupExercisesHeader } from "./components/GroupExercisesList/GroupExercisesHeader/GroupExercisesHeader";
import { GroupExercisesTable } from "./components/GroupExercisesList/GroupExercisesTable";
import { GroupExercisesFilters } from "./components/GroupExercisesList/GroupExercisesFilters/GroupExercisesFilters";
import { useGroupExercisesQuery } from "./hooks/useGroupExercisesQuery";
import { useGroupExercisesFilters } from "./hooks/useGroupExercisesFilters";
import { useGroupExercisesActions } from "./hooks/useGroupExercisesActions";

export default function GroupExercisesPage() {
  const navigate = useNavigate();

  const {
    params,
    pagination,
    setPagination,
    viewMode,
    setViewMode,
    handleSearch,
  } = useGroupExercisesFilters();

  const { data, isLoading, isPlaceholderData } = useGroupExercisesQuery(params);

  const { handleOpenRegister, handleOpenEdit, handleDelete } =
    useGroupExercisesActions();

  const groups = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <GroupExercisesHeader
        onCreate={handleOpenRegister}
        onBack={() => navigate({ to: "/settings" })}
        onGoToExercises={() => navigate({ to: "/exercises" })}
      />

      <GroupExercisesFilters
        onSearch={handleSearch}
        actions={
          <ViewToggle viewMode={viewMode} onViewModeChange={setViewMode} />
        }
      />

      <GroupExercisesTable
        data={groups}
        rowCount={rowCount}
        pagination={pagination}
        onPaginationChange={setPagination}
        isLoading={isLoading && !isPlaceholderData}
        onEdit={handleOpenEdit}
        onDelete={handleDelete}
        viewMode={viewMode}
      />
    </div>
  );
}
