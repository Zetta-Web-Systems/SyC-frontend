import { useState } from "react";
import { Drawer } from "@shared/ui";
import { SearchableInfiniteList } from "@shared/components/SearchableInfiniteList";
import type { Exercise } from "@features/exercise";
import { useTrainingPlanFormHelpers } from "../../../hooks/form/useTrainingPlanFormHelpers";
import { useExerciseLibrary } from "../../../hooks/ui/useExerciseLibrary";
import type { DayName } from "../../../constants";
import { ExerciseGroupSelect } from "./ExerciseGroupSelect";
import { ExerciseLibraryHeader } from "./ExerciseLibraryHeader";
import { ExerciseLibraryCard } from "./ExerciseLibraryCard/ExerciseLibraryCard";
import { ExerciseQuickView } from "./ExerciseQuickView";

interface ExerciseLibraryProps {
  open: boolean;
  onClose: () => void;
  activeDayName: DayName | null;
}

export function ExerciseLibrary({
  open,
  onClose,
  activeDayName,
}: ExerciseLibraryProps) {
  const { addExercise } = useTrainingPlanFormHelpers();
  const library = useExerciseLibrary({ enabled: open });
  const [previewExercise, setPreviewExercise] = useState<Exercise | null>(null);

  function handleAdd(exercise: Exercise) {
    if (!activeDayName) return;
    addExercise(activeDayName, { exercise });
  }

  return (
    <>
      <Drawer
        open={open}
        onClose={onClose}
        side="right"
        ariaLabel="Biblioteca de ejercicios"
        onAfterClose={library.reset}
      >
        <ExerciseLibraryHeader onClose={onClose} />

        <SearchableInfiniteList<Exercise>
          search={library.search}
          searchSlot={{
            searchPlaceholder: "Buscar ejercicio",
            onSearchChange: library.setSearch,
            searchSlotClassName:
              "flex flex-col gap-2 border-b border-neutral-100",
            toolbarPosition: "before",
            toolbarSlot: (
              <ExerciseGroupSelect
                value={library.selectedGroup}
                onChange={library.setSelectedGroup}
                groups={library.groups}
                isLoading={library.isLoadingGroups}
              />
            ),
          }}
          items={library.items}
          total={library.total}
          isLoading={library.isLoading}
          isFetchingNextPage={library.isFetchingNextPage}
          hasNextPage={library.hasNextPage}
          isError={library.isError}
          scrollRef={library.scrollRef}
          sentinelRef={library.sentinelRef}
          keyFor={(ex) => ex.id}
          renderItem={(ex) => (
            <ExerciseLibraryCard
              exercise={ex}
              onAdd={handleAdd}
              onPreview={setPreviewExercise}
              canAdd={activeDayName !== null}
            />
          )}
          sectionTitle="Ejercicios"
          countLabel={({ total, hasSearch }) =>
            hasSearch ? `${total} resultados` : `${total} ejercicios`
          }
          emptyMessage="Sin ejercicios disponibles"
          errorMessage="Error al cargar ejercicios."
          listClassName="px-3 pb-3"
          listContainerClassName="flex flex-col gap-2"
        />
      </Drawer>

      <ExerciseQuickView
        exercise={previewExercise}
        onClose={() => setPreviewExercise(null)}
      />
    </>
  );
}

ExerciseLibrary.displayName = "ExerciseLibrary";
