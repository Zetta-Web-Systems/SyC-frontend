import { Dumbbell } from "lucide-react";
import { getExercisesCountLabel } from "../../../utils/groupExerciseCard.utils";

interface GroupExerciseHeaderProps {
  name: string;
  exercisesCount: number;
}

export function GroupExerciseHeader({
  name,
  exercisesCount,
}: GroupExerciseHeaderProps) {
  return (
    <div className="min-w-0 flex-1">
      <h3 className="truncate text-base font-semibold leading-tight text-neutral-900">
        {name}
      </h3>
      <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-500">
        <Dumbbell size={12} className="text-neutral-400" aria-hidden="true" />
        {getExercisesCountLabel(exercisesCount)}
      </div>
    </div>
  );
}

GroupExerciseHeader.displayName = "GroupExerciseHeader";
