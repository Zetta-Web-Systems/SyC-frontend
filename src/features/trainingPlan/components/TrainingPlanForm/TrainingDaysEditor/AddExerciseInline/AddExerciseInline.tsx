import { useEffect, useRef } from "react";
import { Plus, X } from "lucide-react";
import { IconButton, SearchInput } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { useDropdown } from "@shared/hooks/useDropdown";
import type { Exercise } from "@features/exercise";
import { useTrainingPlanFormHelpers } from "../../../../hooks/form/useTrainingPlanFormHelpers";
import { useExerciseSearchInfinite } from "../../../../hooks/ui/useExerciseSearchInfinite";
import type { DayName } from "../../../../constants";
import { ExerciseSearchList } from "./ExerciseSearchList";

interface AddExerciseInlineProps {
  dayName: DayName;
  onOpenChange?: (isOpen: boolean) => void;
}

export function AddExerciseInline({
  dayName,
  onOpenChange,
}: AddExerciseInlineProps) {
  const { addExercise } = useTrainingPlanFormHelpers();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isOpen, open, close, containerRef } = useDropdown<HTMLDivElement>({});

  const exerciseSearch = useExerciseSearchInfinite({ enabled: isOpen });
  const { setSearch } = exerciseSearch;

  useEffect(() => {
    onOpenChange?.(isOpen);
    if (isOpen) {
      searchInputRef.current?.focus();
    } else {
      setSearch("");
    }
  }, [isOpen, onOpenChange, setSearch]);

  function handleSelect(exercise: Exercise) {
    addExercise(dayName, { exercise });
    close();
  }

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={open}
        className={cn(
          "flex w-full items-center justify-center gap-2 rounded-xl border-[1.5px] border-dashed border-primary-300 bg-white px-3 py-3 text-sm font-semibold text-primary-600 transition-colors",
          "hover:border-primary-500 hover:bg-primary-50",
        )}
      >
        <Plus size={14} aria-hidden="true" />
        Agregar ejercicio
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      className="flex flex-col overflow-hidden rounded-xl border border-primary-200 bg-white shadow-lg"
    >
      <div className="flex items-center gap-2 border-b border-neutral-100 p-2.5">
        <div className="flex-1">
          <SearchInput
            ref={searchInputRef}
            placeholder="Buscar ejercicio"
            onSearch={exerciseSearch.setSearch}
            delay={300}
          />
        </div>
        <IconButton aria-label="Cerrar" onClick={close}>
          <X size={14} aria-hidden="true" />
        </IconButton>
      </div>

      <ExerciseSearchList
        items={exerciseSearch.items}
        search={exerciseSearch.search}
        total={exerciseSearch.total}
        isLoading={exerciseSearch.isLoading}
        isFetchingNextPage={exerciseSearch.isFetchingNextPage}
        hasNextPage={exerciseSearch.hasNextPage}
        isError={exerciseSearch.isError}
        scrollRef={exerciseSearch.scrollRef}
        sentinelRef={exerciseSearch.sentinelRef}
        onSelect={handleSelect}
      />
    </div>
  );
}

AddExerciseInline.displayName = "AddExerciseInline";
