import { ChevronRight, Copy, GripVertical, Trash2 } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { getExerciseGroupLabel, useExerciseQuery } from "@features/exercise";
import { IconBox, IconButton } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { useTrainingPlanFormHelpers } from "../../../../hooks/form/useTrainingPlanFormHelpers";
import { useTrafficLightQuery } from "../../../../hooks/queries/useTrafficLightQuery";
import { summarizeExecs } from "../../../../lib/summarizeExecs";
import { ExerciseRowTrafficLight } from "./ExerciseRowTrafficLight";
import type { DayName } from "../../../../constants";
import type { RegisterExerciseExecutionFormSchema } from "../../../../schemas/registerTrainingPlan.schema";
import {
  DRAG_TYPE,
  DROP_TYPE,
  rowId,
  type RowDragData,
  type RowDropData,
} from "../../../../lib/trainingPlanDnd";

interface ExerciseRowProps {
  dayName: DayName;
  exerciseId: string;
  exerciseOrder: number;
  rowNumber: number;
  exerciseExecutions: RegisterExerciseExecutionFormSchema[];
  memberId?: string;
  error?: string;
  onEdit: () => void;
}

export function ExerciseRow({
  dayName,
  exerciseId,
  exerciseOrder,
  rowNumber,
  exerciseExecutions,
  memberId,
  error,
  onEdit,
}: ExerciseRowProps) {
  const { removeExercise, duplicateExercise } = useTrainingPlanFormHelpers();

  const exerciseQuery = useExerciseQuery(exerciseId);
  const exercise = exerciseQuery.data;
  const summary = summarizeExecs(exerciseExecutions);

  const trafficLight = useTrafficLightQuery(memberId, exerciseId);
  const isYellow = trafficLight.data?.isYellow ?? false;

  const dragData: RowDragData = {
    type: DRAG_TYPE.ROW,
    dayName,
    order: exerciseOrder,
    exerciseId,
  };
  const dropData: RowDropData = {
    type: DROP_TYPE.ROW,
    dayName,
    order: exerciseOrder,
  };
  const {
    setNodeRef,
    setActivatorNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: rowId(dayName, exerciseOrder),
    data: { ...dragData, drop: dropData },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={onEdit}
      aria-invalid={error ? true : undefined}
      data-invalid={error ? "true" : undefined}
      className={cn(
        "grid cursor-pointer items-center gap-1.5 rounded-xl border border-neutral-200 bg-white px-2.5 py-2 transition-colors hover:border-primary-200 hover:bg-primary-50/30 sm:gap-2 sm:px-3 sm:py-2.5",
        "grid-cols-[auto_auto_minmax(0,1fr)_minmax(0,auto)_auto_auto]",
        isDragging && "opacity-40",
        isYellow && "border-warning/40 bg-warning/5",
        error && "border-error bg-error/5 hover:border-error hover:bg-error/10",
      )}
    >
      <IconButton
        ref={setActivatorNodeRef}
        aria-label="Reordenar ejercicio"
        intent="primary"
        className="cursor-grab touch-none active:cursor-grabbing"
        onClick={(e) => e.stopPropagation()}
        {...attributes}
        {...listeners}
      >
        <GripVertical size={14} aria-hidden="true" />
      </IconButton>
      <IconBox
        size="xs"
        shape="sm"
        tone="soft"
        intent={error ? "danger" : "neutral"}
        className="text-xs font-bold"
      >
        {rowNumber}
      </IconBox>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
          <span className="truncate">
            {exercise?.name ??
              (exerciseQuery.isLoading ? "Cargando..." : "Ejercicio")}
          </span>
          {memberId && (
            <ExerciseRowTrafficLight
              isLoading={trafficLight.isLoading}
              isYellow={isYellow}
              affected={trafficLight.data?.currentStatusAffected ?? []}
            />
          )}
        </div>
        <div
          className={cn(
            "mt-0.5 truncate text-xs",
            error ? "font-medium text-error" : "text-neutral-500",
          )}
        >
          {error ?? getExerciseGroupLabel(exercise)}
        </div>
      </div>
      <div className="hidden truncate font-mono text-xs text-neutral-600 md:block">
        {summary}
      </div>
      <button
        type="button"
        aria-label="Editar ejercicio"
        onClick={(e) => {
          e.stopPropagation();
          onEdit();
        }}
        className="inline-flex items-center gap-1 rounded-md px-1 py-0.5 text-xs font-semibold text-primary-600 transition-colors hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300"
      >
        <span className="hidden xs:inline">Editar</span>
        <ChevronRight size={14} aria-hidden="true" />
      </button>
      <div
        className="flex items-center gap-0.5"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <IconButton
          aria-label="Duplicar ejercicio"
          onClick={() => duplicateExercise(dayName, exerciseOrder)}
        >
          <Copy size={14} aria-hidden="true" />
        </IconButton>
        <IconButton
          intent="danger"
          aria-label="Eliminar ejercicio"
          onClick={() => removeExercise(dayName, exerciseOrder)}
        >
          <Trash2 size={14} aria-hidden="true" />
        </IconButton>
      </div>
    </div>
  );
}

ExerciseRow.displayName = "ExerciseRow";
