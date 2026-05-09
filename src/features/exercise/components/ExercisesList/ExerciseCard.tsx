import { Pencil, RotateCcw, Trash2, X } from "lucide-react";
import { Badge, Button } from "@shared/ui";
import { AffectedZonesBadges } from "@shared/components/AffectedZonesBadges/AffectedZonesBadges";
import type { Exercise } from "../../types";
import { EXERCISE_LEVEL_LABELS } from "../../constants";

const LEVEL_INTENT: Record<
  Exercise["exerciseLevel"],
  "success" | "warning" | "error"
> = {
  "1": "success",
  "2": "warning",
  "3": "error",
};

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: (exercise: Exercise) => void;
  onSoftDelete: (exercise: Exercise) => void;
  onPhysicalDelete: (exercise: Exercise) => void;
  onRestore: (exercise: Exercise) => void;
}

export function ExerciseCard({
  exercise,
  onEdit,
  onSoftDelete,
  onPhysicalDelete,
  onRestore,
}: ExerciseCardProps) {
  const isActive = exercise.isActive;

  return (
    <div className="flex w-full flex-col gap-3 rounded-xl border border-neutral-200 bg-white p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex min-w-0 flex-col gap-1">
          <span className="font-medium text-neutral-900">{exercise.name}</span>
          <div className="flex items-center gap-2">
            <Badge intent={LEVEL_INTENT[exercise.exerciseLevel]} size="sm">
              {EXERCISE_LEVEL_LABELS[exercise.exerciseLevel]}
            </Badge>
            <Badge
              variant="dot"
              intent={isActive ? "success" : "error"}
              size="sm"
            >
              {isActive ? "ACTIVO" : "INACTIVO"}
            </Badge>
          </div>
        </div>

        <div className="flex shrink-0 gap-1">
          {isActive ? (
            <>
              <Button
                variant="ghost"
                intent="success"
                size="icon"
                aria-label={`Editar ejercicio ${exercise.name}`}
                onClick={() => onEdit(exercise)}
              >
                <Pencil size={16} aria-hidden="true" color="green" />
              </Button>
              <Button
                variant="ghost"
                intent="danger"
                size="icon"
                aria-label={`Desactivar ejercicio ${exercise.name}`}
                onClick={() => onSoftDelete(exercise)}
              >
                <Trash2 size={16} aria-hidden="true" />
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                intent="secondary"
                size="icon"
                aria-label={`Restaurar ejercicio ${exercise.name}`}
                onClick={() => onRestore(exercise)}
              >
                <RotateCcw size={16} aria-hidden="true" />
              </Button>
              <Button
                variant="ghost"
                intent="danger"
                size="icon"
                aria-label={`Eliminar definitivamente ejercicio ${exercise.name}`}
                onClick={() => onPhysicalDelete(exercise)}
              >
                <X size={16} aria-hidden="true" />
              </Button>
            </>
          )}
        </div>
      </div>

      <div>
        <AffectedZonesBadges zones={exercise.affectedZones} />
      </div>
    </div>
  );
}

ExerciseCard.displayName = "ExerciseCard";
