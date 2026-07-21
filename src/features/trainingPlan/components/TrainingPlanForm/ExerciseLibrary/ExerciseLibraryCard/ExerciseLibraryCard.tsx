import type { MouseEvent } from "react";
import { Dumbbell, Eye, Plus } from "lucide-react";
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Badge, IconButton } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
  EXERCISE_LEVEL_TEXT_COLOR_CLASS,
  YOUTUBE_FAVICON_URL,
  hasYouTubeLink,
} from "@features/exercise";
import type { Exercise } from "@features/exercise";
import {
  DRAG_TYPE,
  libraryId,
  type LibraryDragData,
} from "../../../../lib/trainingPlanDnd";

interface ExerciseLibraryCardProps {
  exercise: Exercise;
  onAdd: (exercise: Exercise) => void;
  onPreview: (exercise: Exercise) => void;
  canAdd: boolean;
}

export function ExerciseLibraryCard({
  exercise,
  onAdd,
  onPreview,
  canAdd,
}: ExerciseLibraryCardProps) {
  const hasYoutubeVideo = hasYouTubeLink(exercise.links);
  const levelIntent = EXERCISE_LEVEL_INTENT[exercise.exerciseLevel];

  const data: LibraryDragData = { type: DRAG_TYPE.LIBRARY, exercise };
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: libraryId(exercise.id),
      data,
    });

  function handleAddClick(e: MouseEvent) {
    e.stopPropagation();
    onAdd(exercise);
  }

  function handlePreviewClick(e: MouseEvent) {
    e.stopPropagation();
    onPreview(exercise);
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...attributes}
      {...listeners}
      aria-label={`Arrastrá ${exercise.name} a un día`}
      className={cn(
        "group relative flex w-full items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-2.5 shadow-sm transition-all select-none",
        "hover:border-primary-300 hover:shadow-md",
        "focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:outline-none",
        isDragging ? "cursor-grabbing opacity-40" : "cursor-grab",
      )}
    >
      <div className="relative size-14 shrink-0">
        <div className="size-full overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-neutral-200/60">
          {exercise.image ? (
            <img
              src={exercise.image}
              alt={exercise.name}
              draggable={false}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-neutral-400">
              <Dumbbell size={24} aria-hidden="true" />
            </div>
          )}
        </div>
        {hasYoutubeVideo && (
          <img
            src={YOUTUBE_FAVICON_URL}
            alt="Tiene video de YouTube"
            title="Tiene video de YouTube"
            draggable={false}
            className="pointer-events-none absolute -top-1.5 -left-1.5 z-10 size-4 -rotate-12 drop-shadow-sm"
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <span className="line-clamp-2 text-sm leading-tight font-semibold text-neutral-900">
          {exercise.name}
        </span>
        <Badge
          variant="dot"
          intent={levelIntent}
          size="sm"
          className="text-neutral-800"
        >
          Nivel{" "}
          <span className={EXERCISE_LEVEL_TEXT_COLOR_CLASS[levelIntent]}>
            {EXERCISE_LEVEL_LABELS[exercise.exerciseLevel]}
          </span>
        </Badge>
      </div>

      <div className="flex shrink-0 flex-col items-center gap-1">
        <IconButton
          onClick={handlePreviewClick}
          onPointerDown={(e) => e.stopPropagation()}
          aria-label={`Ver detalles de ${exercise.name}`}
          title="Ver detalles"
        >
          <Eye size={14} aria-hidden="true" />
        </IconButton>
        <IconButton
          intent="primary"
          onClick={handleAddClick}
          onPointerDown={(e) => e.stopPropagation()}
          disabled={!canAdd}
          aria-label={`Agregar ${exercise.name} al día activo`}
          title={canAdd ? "Agregar al día activo" : "Seleccioná un día primero"}
        >
          <Plus size={14} aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

ExerciseLibraryCard.displayName = "ExerciseLibraryCard";
