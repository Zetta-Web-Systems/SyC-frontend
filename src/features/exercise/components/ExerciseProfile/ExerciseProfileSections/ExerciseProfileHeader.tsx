import { ArrowLeft, Pencil } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { Avatar, Badge, Button, Card } from "@shared/ui";
import type { Exercise } from "../../../types";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
} from "../../../constants";

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
    <Card className="rounded-xl border border-neutral-200 bg-white p-4 sm:p-6">
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

        <div className="flex shrink-0 gap-2">
          <Link to="/exercises/$groupId" params={{ groupId }}>
            <Button variant="outline" intent="neutral" size="md">
              <ArrowLeft size={14} aria-hidden="true" />
              <span className="hidden xs:inline">Volver al listado</span>
            </Button>
          </Link>

          {exercise.isActive && (
            <Button
              variant="solid"
              intent="primary"
              size="md"
              onClick={() => onEdit(exercise)}
            >
              <Pencil size={14} aria-hidden="true" />
              <span className="hidden xs:inline">Editar ejercicio</span>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}

ExerciseProfileHeader.displayName = "ExerciseProfileHeader";
