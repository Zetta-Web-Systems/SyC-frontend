import { GripVertical } from "lucide-react";
import { getExerciseGroupLabel, useExerciseQuery } from "@features/exercise";

interface ExerciseRowOverlayProps {
  exerciseId: string;
}

export function ExerciseRowOverlay({ exerciseId }: ExerciseRowOverlayProps) {
  const exerciseQuery = useExerciseQuery(exerciseId);
  const exercise = exerciseQuery.data;

  return (
    <div className="flex w-100 max-w-[90vw] cursor-grabbing items-center gap-2 rounded-xl border border-primary-300 bg-white px-3 py-2.5 shadow-2xl ring-4 ring-primary-200/40">
      <GripVertical size={14} aria-hidden="true" className="text-primary-400" />
      <div className="min-w-0 flex-1">
        <div className="truncate text-sm font-semibold text-neutral-900">
          {exercise?.name ?? "Ejercicio"}
        </div>
        <div className="truncate text-xs text-neutral-500">
          {getExerciseGroupLabel(exercise)}
        </div>
      </div>
    </div>
  );
}

ExerciseRowOverlay.displayName = "ExerciseRowOverlay";
