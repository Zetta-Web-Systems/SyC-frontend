import {
  DataCardList,
  StandalonePagination,
} from "@shared/components/DataTable";
import { PageHeader } from "@shared/components/PageHeader/PageHeader";
import { SearchInput } from "@shared/ui";
import { useGroupExercisesQuery } from "./hooks/useGroupExercisesQuery";
import { useGroupExercisesFilters } from "./hooks/useGroupExercisesFilters";
import { useExercisesPageActions } from "./hooks/useExercisesPageActions";
import { GroupExerciseCard } from "./components/common/GroupExerciseCard";

export default function ExercisesPage() {
  const { params, pagination, setPagination, handleSearch } =
    useGroupExercisesFilters();

  const { data, isLoading, isPlaceholderData } = useGroupExercisesQuery(params);

  const { handleSelectGroup } = useExercisesPageActions();

  const groups = data?.data ?? [];
  const rowCount = data?.pagination.total ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="Ejercicios"
        description="Elegí un grupo para ver y gestionar sus ejercicios"
      />

      <div className="max-w-md">
        <SearchInput
          placeholder="Buscar grupo de ejercicios"
          onSearch={handleSearch}
        />
      </div>

      <DataCardList
        data={groups}
        isLoading={isLoading && !isPlaceholderData}
        noResultsMessage="No se encontraron grupos de ejercicios."
        className="flex-row flex-wrap justify-center"
        renderCard={(group) => (
          <div key={group.id} className="w-full sm:w-96">
            <GroupExerciseCard group={group} onSelect={handleSelectGroup} />
          </div>
        )}
      />

      <StandalonePagination
        pageIndex={pagination.pageIndex}
        pageSize={pagination.pageSize}
        rowCount={rowCount}
        onPageIndexChange={(pageIndex) =>
          setPagination((prev) => ({ ...prev, pageIndex }))
        }
        onPageSizeChange={(pageSize) =>
          setPagination({ pageIndex: 0, pageSize })
        }
      />
    </div>
  );
}
