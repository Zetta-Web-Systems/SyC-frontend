import { History } from "lucide-react";
import { Badge, Spinner } from "@shared/ui";
import {
  EXECUTION_STATUS_INTENT,
  PREVIOUS_EXECUTION_LABELS,
} from "../../../constants";
import { getExecutionStatus } from "../../../lib/sessionProgress";
import type { SessionExecution } from "../../../types";

interface PreviousWeekExecutionProps {
  week: number;
  execution: SessionExecution | undefined;
  isLoading: boolean;
}

export function PreviousWeekExecution({
  week,
  execution,
  isLoading,
}: PreviousWeekExecutionProps) {
  const status = getExecutionStatus(execution);

  return (
    <div className="flex flex-wrap items-center gap-x-2 gap-y-1 rounded-lg bg-neutral-50 px-3 py-2 text-sm text-neutral-600">
      <History size={14} aria-hidden="true" className="text-neutral-400" />
      <span className="font-semibold text-neutral-700">Semana {week}</span>

      {isLoading ? (
        <Spinner size="sm" />
      ) : execution ? (
        <>
          <span className="font-mono">
            {execution.sets} × {execution.reps} · RIR {execution.rir ?? "—"}
          </span>
          <Badge
            variant="dot"
            intent={EXECUTION_STATUS_INTENT[status]}
            size="sm"
          >
            {PREVIOUS_EXECUTION_LABELS[status]}
          </Badge>
        </>
      ) : (
        <span className="text-neutral-400">Sin datos</span>
      )}

      {execution?.instructorObservations && (
        <p className="basis-full text-neutral-600 italic">
          “{execution.instructorObservations}”
        </p>
      )}
    </div>
  );
}

PreviousWeekExecution.displayName = "PreviousWeekExecution";
