import { useEffect, useRef, useState } from "react";
import { Eye, MessageSquarePlus } from "lucide-react";
import { Badge, Button } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  EXERCISE_LEVEL_INTENT,
  EXERCISE_LEVEL_LABELS,
  getExerciseGroupLabel,
} from "@features/exercise";
import { TrainingPlanRiskIndicator } from "@features/trainingPlan";
import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_BORDER,
  EXECUTION_STATUS_LABELS,
  EXECUTION_STATUS_TEXT,
} from "../../../constants";
import { EXECUTION_STATUS_ICON } from "../../../constants/icons";
import { getExecutionStatus } from "../../../lib/sessionProgress";
import type { SessionExecution, SessionPlannedExercise } from "../../../types";
import { ExecutionObservationField } from "./ExecutionObservationField";
import { PreviousWeekExecution } from "./PreviousWeekExecution";

interface FocusExerciseProps {
  plannedExercise: SessionPlannedExercise;
  execution: SessionExecution;
  index: number;
  total: number;
  week: number;
  previous: SessionExecution | undefined;
  previousLoading: boolean;
  draftNote: string | null;
  canSaveObservationAlone: boolean;
  onDraftChange: (text: string | null) => void;
  onSaveObservation: (text: string) => void;
  onViewExercise: () => void;
}

export function FocusExercise({
  plannedExercise,
  execution,
  index,
  total,
  week,
  previous,
  previousLoading,
  draftNote,
  canSaveObservationAlone,
  onDraftChange,
  onSaveObservation,
  onViewExercise,
}: FocusExerciseProps) {
  const [editing, setEditing] = useState(false);
  const ref = useRef<HTMLLIElement>(null);
  const { exercise, isYellow, currentStatusAffected } = plannedExercise;
  const status = getExecutionStatus(execution);
  const StatusIcon = EXECUTION_STATUS_ICON[status];
  const isPending = status === EXECUTION_STATUS.PENDING;
  const observation = execution.instructorObservations ?? draftNote;

  useEffect(() => {
    ref.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [previousLoading]);

  function saveObservation(text: string) {
    setEditing(false);
    if (isPending && !canSaveObservationAlone) {
      onDraftChange(text || null);
      return;
    }
    onSaveObservation(text);
  }

  return (
    <li
      ref={ref}
      className={cn(
        "scroll-mt-4 scroll-mb-28 rounded-2xl border-2 bg-white p-4 shadow-sm motion-safe:animate-[session-focus-in_220ms_ease-out] sm:p-5",
        EXECUTION_STATUS_BORDER[status],
      )}
    >
      <p
        className={cn(
          "flex items-center gap-2 text-xs font-bold tracking-wider uppercase",
          EXECUTION_STATUS_TEXT[status],
        )}
      >
        <StatusIcon
          size={isPending ? 12 : 14}
          aria-hidden="true"
          className={cn(isPending && "fill-current")}
        />
        {EXECUTION_STATUS_LABELS[status]} · {index + 1} de {total}
      </p>

      <div className="mt-2 flex flex-wrap items-start justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-semibold text-neutral-900">
              {exercise.name}
            </h3>
            {isYellow && (
              <TrainingPlanRiskIndicator affected={currentStatusAffected} />
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-neutral-500">
            <span>{getExerciseGroupLabel(exercise)}</span>
            <Badge
              size="sm"
              intent={EXERCISE_LEVEL_INTENT[exercise.exerciseLevel]}
            >
              Nivel {EXERCISE_LEVEL_LABELS[exercise.exerciseLevel]}
            </Badge>
          </div>
        </div>

        <div className="text-right">
          <p className="text-4xl font-bold tracking-tight tabular-nums text-neutral-900">
            {execution.sets} × {execution.reps}
          </p>
          <p className="text-sm font-medium text-neutral-500">
            RIR {execution.rir ?? "—"}
          </p>
        </div>
      </div>

      {week > 1 && (
        <div className="mt-4">
          <PreviousWeekExecution
            week={week - 1}
            execution={previous}
            isLoading={previousLoading}
          />
        </div>
      )}

      <div className="mt-3">
        <ExecutionObservationField
          inputId={`obs-${execution.id}`}
          value={observation}
          hint={
            draftNote && !execution.instructorObservations
              ? "Se guarda cuando marques Hecho o No pudo"
              : undefined
          }
          editing={editing}
          onEdit={() => setEditing(true)}
          onCancel={() => setEditing(false)}
          onSave={saveObservation}
        />
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <Button
          variant="ghost"
          intent="primary"
          onClick={onViewExercise}
          className="h-11"
        >
          <Eye size={16} aria-hidden="true" />
          Ver ejercicio
        </Button>
        {!observation && !editing && (
          <Button
            variant="ghost"
            intent="primary"
            onClick={() => setEditing(true)}
            className="h-11"
          >
            <MessageSquarePlus size={16} aria-hidden="true" />
            Observación
          </Button>
        )}
      </div>
    </li>
  );
}

FocusExercise.displayName = "FocusExercise";
