import { EXECUTION_STATUS, type ExecutionStatus } from "../constants";
import type {
  MemberDayProgress,
  SessionExecution,
  SessionPlanDay,
  SessionPlannedExercise,
} from "../types";

export function getExecutionStatus(
  execution: SessionExecution | undefined,
): ExecutionStatus {
  if (execution?.isCompleted === true) return EXECUTION_STATUS.DONE;
  if (execution?.isCompleted === false) return EXECUTION_STATUS.SKIPPED;
  return EXECUTION_STATUS.PENDING;
}

function hasStatus(
  pe: SessionPlannedExercise,
  status: ExecutionStatus,
): boolean {
  return getExecutionStatus(pe.exerciseExecutions[0]) === status;
}

export function getFirstPending(
  exercises: SessionPlannedExercise[],
): SessionPlannedExercise | undefined {
  return exercises.find((pe) => hasStatus(pe, EXECUTION_STATUS.PENDING));
}

export function getDayProgress(planDay: SessionPlanDay): MemberDayProgress {
  const exercises = planDay.trainingDays[0]?.plannedExercises ?? [];

  return {
    done: exercises.filter((pe) => hasStatus(pe, EXECUTION_STATUS.DONE)).length,
    total: exercises.length,
    currentExercise: getFirstPending(exercises)?.exercise.name ?? null,
  };
}

export function countSkipped(exercises: SessionPlannedExercise[]): number {
  return exercises.filter((pe) => hasStatus(pe, EXECUTION_STATUS.SKIPPED))
    .length;
}

export function getNextPendingId(
  exercises: SessionPlannedExercise[],
  afterId: string,
): string | null {
  const index = exercises.findIndex((pe) => pe.id === afterId);
  const ordered = [...exercises.slice(index + 1), ...exercises.slice(0, index)];
  return (
    ordered.find((pe) => hasStatus(pe, EXECUTION_STATUS.PENDING))?.id ?? null
  );
}

export function indexPreviousExecutions(
  previous: SessionPlanDay | undefined,
): Map<string, SessionExecution> {
  const index = new Map<string, SessionExecution>();
  const day = previous?.trainingDays[0];
  if (!day) return index;

  for (const pe of day.plannedExercises) {
    const execution = pe.exerciseExecutions[0];
    if (execution) index.set(pe.id, execution);
  }

  return index;
}

export function applyExecutionUpdate(
  planDay: SessionPlanDay,
  executionId: string,
  isCompleted: boolean | null | undefined,
  instructorObservations: string | null | undefined,
): SessionPlanDay {
  return {
    ...planDay,
    trainingDays: planDay.trainingDays.map((day) => ({
      ...day,
      plannedExercises: day.plannedExercises.map((pe) => ({
        ...pe,
        exerciseExecutions: pe.exerciseExecutions.map((e) =>
          e.id === executionId
            ? {
                ...e,
                isCompleted:
                  isCompleted !== undefined ? isCompleted : e.isCompleted,
                instructorObservations:
                  instructorObservations !== undefined
                    ? instructorObservations
                    : e.instructorObservations,
              }
            : e,
        ),
      })),
    })),
  };
}

export function getCompleteMessage(
  firstName: string,
  total: number,
  skipped: number,
): string {
  if (skipped === 0) return `${firstName} hizo los ${total} ejercicios.`;
  const skippedText =
    skipped === 1 ? "uno no lo pudo hacer" : `${skipped} no los pudo hacer`;
  return `${firstName} hizo ${total - skipped} de ${total}; ${skippedText}.`;
}
