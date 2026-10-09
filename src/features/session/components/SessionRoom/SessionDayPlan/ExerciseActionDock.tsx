import { Check, Undo2, X } from "lucide-react";
import { Button } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  EXECUTION_ACTION_TONE,
  EXECUTION_STATUS,
  EXECUTION_STATUS_LABELS,
  EXECUTION_STATUS_TEXT,
} from "../../../constants";
import { getExecutionStatus } from "../../../lib/sessionProgress";
import type { SessionExecution, SessionPlannedExercise } from "../../../types";

interface ExerciseActionButtonsProps {
  execution: SessionExecution;
  stretch?: boolean;
  onMark: (isCompleted: boolean) => void;
  onUndo: () => void;
}

export function ExerciseActionButtons({
  execution,
  stretch = false,
  onMark,
  onUndo,
}: ExerciseActionButtonsProps) {
  const status = getExecutionStatus(execution);
  const isDone = status === EXECUTION_STATUS.DONE;

  return (
    <div
      className={cn(
        stretch
          ? "grid grid-cols-[1fr_2fr] gap-3"
          : "ml-auto flex items-center gap-2",
      )}
    >
      {status === EXECUTION_STATUS.PENDING ? (
        <>
          <Button
            size="lg"
            variant="outline"
            intent="neutral"
            onClick={() => onMark(false)}
            className={cn(
              "px-5",
              EXECUTION_ACTION_TONE[EXECUTION_STATUS.SKIPPED],
              stretch && "h-14",
            )}
          >
            <X size={18} aria-hidden="true" />
            No pudo
          </Button>
          <Button
            size="lg"
            intent="success"
            onClick={() => onMark(true)}
            className={cn("px-6", stretch ? "h-14" : "min-w-36")}
          >
            <Check size={18} aria-hidden="true" />
            Hecho
          </Button>
        </>
      ) : (
        <>
          <Button
            size="lg"
            variant="ghost"
            intent="primary"
            onClick={onUndo}
            className={cn("px-4", stretch && "h-14")}
          >
            <Undo2 size={18} aria-hidden="true" />
            Desmarcar
          </Button>
          <Button
            size="lg"
            variant="outline"
            intent="neutral"
            onClick={() => onMark(!isDone)}
            className={cn(
              "px-5",
              EXECUTION_ACTION_TONE[
                isDone ? EXECUTION_STATUS.SKIPPED : EXECUTION_STATUS.DONE
              ],
              stretch && "h-14",
            )}
          >
            {isDone ? (
              <X size={18} aria-hidden="true" />
            ) : (
              <Check size={18} aria-hidden="true" />
            )}
            {isDone ? "Cambiar a No pudo" : "Cambiar a Hecho"}
          </Button>
        </>
      )}
    </div>
  );
}

ExerciseActionButtons.displayName = "ExerciseActionButtons";

interface ExerciseActionDockProps {
  firstName: string;
  plannedExercise: SessionPlannedExercise;
  execution: SessionExecution;
  index: number;
  total: number;
  onMark: (isCompleted: boolean) => void;
  onUndo: () => void;
}

export function ExerciseActionDock({
  firstName,
  plannedExercise,
  execution,
  index,
  total,
  onMark,
  onUndo,
}: ExerciseActionDockProps) {
  const status = getExecutionStatus(execution);

  return (
    <div className="sticky bottom-0 z-10 hidden bg-linear-to-t from-neutral-100 from-60% to-transparent pt-4 pb-1 lg:block">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 rounded-2xl border border-neutral-200 bg-white p-2 pl-4 shadow-lg">
        <div className="min-w-0 flex-1">
          <p
            className={cn(
              "text-xs font-bold tracking-wider uppercase",
              EXECUTION_STATUS_TEXT[status],
            )}
          >
            {firstName} · {EXECUTION_STATUS_LABELS[status]} · {index + 1} de{" "}
            {total}
          </p>
          <p className="truncate font-semibold text-neutral-900">
            {plannedExercise.exercise.name}
            <span className="font-normal text-neutral-500">
              {" "}
              · {execution.sets} × {execution.reps}
            </span>
          </p>
        </div>

        <ExerciseActionButtons
          execution={execution}
          onMark={onMark}
          onUndo={onUndo}
        />
      </div>
    </div>
  );
}

ExerciseActionDock.displayName = "ExerciseActionDock";
