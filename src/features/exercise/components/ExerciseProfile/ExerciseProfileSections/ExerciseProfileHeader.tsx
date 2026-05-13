import { Avatar, Badge, Card } from "@shared/ui";
import type { Exercise } from "../../../types";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
} from "../../../constants";
import { ExerciseProfileActionsMenu } from "./ExerciseProfileActionsMenu";

interface ExerciseProfileHeaderProps {
  exercise: Exercise;
  groupId: string;
  onEdit: (exercise: Exercise) => void;
}

export function ExerciseProfileHeader({
  exercise,
  groupId,
  onEdit,
}: ExerciseProfileHeaderProps) {
  const levelIntent = EXERCISE_LEVEL_INTENT[exercise.exerciseLevel];
  const levelLabel = EXERCISE_LEVEL_LABELS[exercise.exerciseLevel];
  const initials = exercise.name.slice(0, 2).toUpperCase();

  return (
    <Card className="relative rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <div className="flex min-w-0 items-center gap-4">
          <Avatar
            size="lg"
            color="primary"
            src={exercise.image ?? null}
            fallback={initials}
            alt={exercise.name}
            className="rounded-xl sm:h-16 sm:w-16"
          />

          <div className="flex min-w-0 flex-col gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-tight text-neutral-900 wrap-break-word">
              {exercise.name}
            </h2>

            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  Nivel:
                </span>
                <Badge intent={levelIntent}>{levelLabel}</Badge>
              </div>

              <div className="hidden sm:block w-px h-4 bg-neutral-300" />

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-neutral-500 uppercase tracking-wide">
                  Estado:
                </span>
                <Badge
                  intent={exercise.isActive ? "success" : "error"}
                  variant="dot"
                >
                  {exercise.isActive ? "ACTIVO" : "INACTIVO"}
                </Badge>
              </div>
            </div>
          </div>
        </div>

        <ExerciseProfileActionsMenu
          exercise={exercise}
          groupId={groupId}
          onEdit={onEdit}
        />
      </div>
    </Card>
  );
}

ExerciseProfileHeader.displayName = "ExerciseProfileHeader";
