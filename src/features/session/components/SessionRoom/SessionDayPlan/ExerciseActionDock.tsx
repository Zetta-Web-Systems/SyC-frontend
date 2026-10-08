import { Check, Undo2, X } from "lucide-react";
import { Button } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import {
  EXECUTION_STATUS,
  EXECUTION_STATUS_LABELS,
  EXECUTION_STATUS_TEXT,
} from "../../../constants";
import { getExecutionStatus } from "../../../lib/sessionProgress";
import type { SessionExecution, SessionPlannedExercise } from "../../../types";

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
  const isDone = status === EXECUTION_STATUS.DONE;

  return (
    <div className="sticky bottom-0 z-10 bg-linear-to-t from-neutral-100 from-60% to-transparent pt-4 pb-1">
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

        <div className="ml-auto flex items-center gap-2">
          {status === EXECUTION_STATUS.PENDING ? (
            <>
              <Button
                size="lg"
                variant="outline"
                intent="neutral"
                onClick={() => onMark(false)}
                className="px-5"
              >
                <X size={18} aria-hidden="true" />
                No pudo
              </Button>
              <Button
                size="lg"
                intent="success"
                onClick={() => onMark(true)}
                className="min-w-36 px-6"
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
                intent="neutral"
                onClick={onUndo}
                className="px-4"
              >
                <Undo2 size={18} aria-hidden="true" />
                Desmarcar
              </Button>
              <Button
                size="lg"
                variant="outline"
                intent={isDone ? "neutral" : "success"}
                onClick={() => onMark(!isDone)}
                className="px-5"
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
      </div>
    </div>
  );
}

ExerciseActionDock.displayName = "ExerciseActionDock";
