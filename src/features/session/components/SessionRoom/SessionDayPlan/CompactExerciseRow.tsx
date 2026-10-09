import { Check, MessageSquare, TriangleAlert, X } from "lucide-react";
import { IconBox } from "@shared/ui";
import { cn } from "@shared/lib/cn";
import { getExerciseGroupLabel } from "@features/exercise";
import { EXECUTION_ROW_TONE, EXECUTION_STATUS } from "../../../constants";
import { getExecutionStatus } from "../../../lib/sessionProgress";
import type { SessionExecution, SessionPlannedExercise } from "../../../types";

interface CompactExerciseRowProps {
  plannedExercise: SessionPlannedExercise;
  execution: SessionExecution;
  rowNumber: number;
  onSelect: () => void;
}

export function CompactExerciseRow({
  plannedExercise,
  execution,
  rowNumber,
  onSelect,
}: CompactExerciseRowProps) {
  const { exercise, isYellow } = plannedExercise;
  const status = getExecutionStatus(execution);
  const isPending = status === EXECUTION_STATUS.PENDING;

  return (
    <li>
      <button
        type="button"
        onClick={onSelect}
        className={cn(
          "flex min-h-14 w-full cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 text-left transition-colors",
          EXECUTION_ROW_TONE[status],
        )}
      >
        {status === EXECUTION_STATUS.DONE && (
          <IconBox size="xs" shape="sm" tone="solid" intent="success">
            <Check size={14} strokeWidth={3} aria-label="Hecho" />
          </IconBox>
        )}
        {status === EXECUTION_STATUS.SKIPPED && (
          <IconBox size="xs" shape="sm" tone="solid" intent="warning">
            <X size={14} strokeWidth={3} aria-label="No pudo" />
          </IconBox>
        )}
        {isPending && (
          <IconBox
            size="xs"
            shape="sm"
            tone="soft"
            intent="neutral"
            className="text-xs font-bold"
          >
            {rowNumber}
          </IconBox>
        )}

        <span className="min-w-0 flex-1">
          <span
            className={cn(
              "block truncate text-sm font-semibold",
              isPending ? "text-neutral-900" : "text-neutral-500",
            )}
          >
            {exercise.name}
          </span>
          <span className="block truncate text-sm text-neutral-400">
            {status === EXECUTION_STATUS.SKIPPED
              ? "No pudo"
              : getExerciseGroupLabel(exercise)}
          </span>
        </span>

        {isYellow && (
          <TriangleAlert
            size={16}
            aria-label="Precaución"
            className="shrink-0 text-warning"
          />
        )}
        {execution.instructorObservations && (
          <MessageSquare
            size={14}
            aria-label="Tiene observación"
            className="shrink-0 text-neutral-400"
          />
        )}
        <span className="shrink-0 font-mono text-sm text-neutral-500">
          {execution.sets} × {execution.reps}
        </span>
      </button>
    </li>
  );
}

CompactExerciseRow.displayName = "CompactExerciseRow";
