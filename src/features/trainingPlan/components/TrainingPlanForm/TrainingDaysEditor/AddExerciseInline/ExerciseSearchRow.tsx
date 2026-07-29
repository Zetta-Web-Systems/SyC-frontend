import { Plus } from "lucide-react";
import { getExerciseGroupLabel } from "@features/exercise";
import type { Exercise } from "@features/exercise";

interface ExerciseSearchRowProps {
  exercise: Exercise;
  onSelect: (exercise: Exercise) => void;
}

export function ExerciseSearchRow({
  exercise,
  onSelect,
}: ExerciseSearchRowProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(exercise)}
      className="my-px flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left transition-colors hover:bg-neutral-50"
    >
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-neutral-900">
          {exercise.name}
        </div>
        <div className="truncate text-xs text-neutral-500">
          {getExerciseGroupLabel(exercise)}
        </div>
      </div>
      <Plus
        size={14}
        aria-hidden="true"
        className="shrink-0 text-primary-500"
      />
    </button>
  );
}

ExerciseSearchRow.displayName = "ExerciseSearchRow";
