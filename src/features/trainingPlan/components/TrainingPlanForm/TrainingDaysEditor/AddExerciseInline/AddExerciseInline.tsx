import { useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { LibraryBig, Plus, X } from "lucide-react";
import { Button, IconButton, SearchInput } from "@shared/ui";
import { useDropdown } from "@shared/hooks/useDropdown";
import type { Exercise } from "@features/exercise";
import { useTrainingPlanFormHelpers } from "../../../../hooks/form/useTrainingPlanFormHelpers";
import { useSaveTrainingPlanDraft } from "../../../../hooks/form/useSaveTrainingPlanDraft";
import { useExerciseSearchInfinite } from "../../../../hooks/ui/useExerciseSearchInfinite";
import type { DayName } from "../../../../constants";
import { ExerciseSearchList } from "./ExerciseSearchList";

interface AddExerciseInlineProps {
  dayName: DayName;
  onOpenChange?: (isOpen: boolean) => void;
  onOpenLibrary?: () => void;
}

export function AddExerciseInline({
  dayName,
  onOpenChange,
  onOpenLibrary,
}: AddExerciseInlineProps) {
  const { addExercise } = useTrainingPlanFormHelpers();
  const { stashDraft } = useSaveTrainingPlanDraft();
  const navigate = useNavigate();
  const searchInputRef = useRef<HTMLInputElement>(null);

  const { isOpen, open, close, containerRef } = useDropdown<HTMLDivElement>({});

  const exerciseSearch = useExerciseSearchInfinite({ enabled: isOpen });
  const { setSearch, search } = exerciseSearch;

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

  function handleOpenLibrary() {
    close();
    onOpenLibrary?.();
  }

  function handleCreate() {
    const name = search.trim();
    stashDraft(dayName);
    void navigate({
      to: "/exercises/register",
      search: { from: "training-plan", ...(name ? { name } : {}) },
    });
  }

  if (!isOpen) {
    return (
      <Button
        variant="dashed"
        intent="primary"
        onClick={open}
        className="w-full rounded-xl"
      >
        <Plus size={14} aria-hidden="true" />
        Agregar ejercicio
      </Button>
    );
  }

  const trimmedSearch = search.trim();
  const hasExactMatch = exerciseSearch.items.some(
    (e) => e.name.trim().toLowerCase() === trimmedSearch.toLowerCase(),
  );
  const showCreate = trimmedSearch.length > 0 && !hasExactMatch;

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

      <div className="flex flex-col gap-0.5 border-t border-neutral-100 p-1.5">
        <button
          type="button"
          onClick={handleOpenLibrary}
          className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50"
        >
          <LibraryBig
            size={14}
            aria-hidden="true"
            className="text-neutral-500"
          />
          Abrir biblioteca
        </button>
        {showCreate && (
          <button
            type="button"
            onClick={handleCreate}
            className="flex items-center gap-2 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-primary-700 hover:bg-primary-50"
          >
            <Plus size={14} aria-hidden="true" />
            <span>Crear &ldquo;{trimmedSearch}&rdquo;</span>
          </button>
        )}
      </div>
    </div>
  );
}

AddExerciseInline.displayName = "AddExerciseInline";
