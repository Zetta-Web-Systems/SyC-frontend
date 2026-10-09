import { useState, type ReactNode } from "react";
import { CheckCheck, History } from "lucide-react";
import { IconBox } from "@shared/ui";
import type { Exercise } from "@features/exercise";
import { SESSION_BACKEND_READY } from "../../../constants";
import { warnBackendTodo } from "../../../lib/sessionBackendTodo";
import {
  countSkipped,
  getCompleteMessage,
  getFirstPending,
  getNextPendingId,
} from "../../../lib/sessionProgress";
import type { SessionExecution, SessionPlannedExercise } from "../../../types";
import { CompactExerciseRow } from "./CompactExerciseRow";
import {
  ExerciseActionButtons,
  ExerciseActionDock,
} from "./ExerciseActionDock";
import { FocusExercise } from "./FocusExercise";

type FocusState = string | null | undefined;

interface SessionDayPlanProps {
  firstName: string;
  exercises: SessionPlannedExercise[];
  week: number;
  previousByPlanned: Map<string, SessionExecution>;
  previousLoading: boolean;
  after?: ReactNode;
  onMark: (
    execution: SessionExecution,
    isCompleted: boolean,
    observation?: string,
  ) => void;
  onUndo: (execution: SessionExecution) => void;
  onSaveObservation: (execution: SessionExecution, text: string) => void;
  onViewExercise: (exercise: Exercise) => void;
}

export function SessionDayPlan({
  firstName,
  exercises,
  week,
  previousByPlanned,
  previousLoading,
  after,
  onMark,
  onUndo,
  onSaveObservation,
  onViewExercise,
}: SessionDayPlanProps) {
  const [focus, setFocus] = useState<FocusState>(undefined);
  const [drafts, setDrafts] = useState<Record<string, string>>({});

  const firstPending = getFirstPending(exercises);
  const activeId = focus === undefined ? (firstPending?.id ?? null) : focus;
  const activeIndex = exercises.findIndex((pe) => pe.id === activeId);
  const active = activeIndex >= 0 ? exercises[activeIndex] : undefined;
  const activeExecution = active?.exerciseExecutions[0];

  function setDraft(executionId: string, text: string | null) {
    if (text) {
      warnBackendTodo(
        "3B",
        "El PATCH de la ejecución exige isCompleted: la observación de un ejercicio sin marcar se guarda al tocar Hecho o No pudo.",
        true,
      );
    }
    setDrafts((prev) => {
      const next = { ...prev };
      if (text) next[executionId] = text;
      else delete next[executionId];
      return next;
    });
  }

  function mark(
    pe: SessionPlannedExercise,
    execution: SessionExecution,
    isCompleted: boolean,
  ) {
    const wasPending = execution.isCompleted === null;
    onMark(
      execution,
      isCompleted,
      wasPending ? drafts[execution.id] : undefined,
    );
    setDraft(execution.id, null);
    if (wasPending) setFocus(getNextPendingId(exercises, pe.id));
  }

  return (
    <>
      <section aria-label="Ejercicios del día" className="flex flex-col gap-3">
        <h3 className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
          3° bloque · Ejercicios
        </h3>
        {week === 1 && (
          <p className="flex items-center gap-2 text-sm text-neutral-500">
            <History
              size={14}
              aria-hidden="true"
              className="text-neutral-400"
            />
            Primera semana del plan: no hay semana anterior para comparar.
          </p>
        )}

        {!firstPending && activeId === null && (
          <div className="flex items-center gap-4 rounded-2xl border border-success/30 bg-success/10 p-4 sm:p-5">
            <IconBox size="xl" shape="lg" tone="solid" intent="success">
              <CheckCheck size={20} aria-hidden="true" />
            </IconBox>
            <div>
              <p className="text-lg font-semibold text-neutral-900">
                ¡Día completo!
              </p>
              <p className="text-sm text-neutral-600">
                {getCompleteMessage(
                  firstName,
                  exercises.length,
                  countSkipped(exercises),
                )}{" "}
                Queda el 4° bloque, el aeróbico.
              </p>
            </div>
          </div>
        )}

        <ol className="flex flex-col gap-2">
          {exercises.map((pe, index) => {
            const execution = pe.exerciseExecutions[0];
            if (!execution) return null;

            if (pe.id === activeId) {
              return (
                <FocusExercise
                  key={pe.id}
                  plannedExercise={pe}
                  execution={execution}
                  index={index}
                  total={exercises.length}
                  week={week}
                  previous={previousByPlanned.get(pe.id)}
                  previousLoading={previousLoading}
                  draftNote={drafts[execution.id] ?? null}
                  canSaveObservationAlone={
                    SESSION_BACKEND_READY.standaloneObservation
                  }
                  onDraftChange={(text) => setDraft(execution.id, text)}
                  onSaveObservation={(text) =>
                    onSaveObservation(execution, text)
                  }
                  onViewExercise={() => onViewExercise(pe.exercise)}
                  actions={
                    <ExerciseActionButtons
                      stretch
                      execution={execution}
                      onMark={(isCompleted) => mark(pe, execution, isCompleted)}
                      onUndo={() => onUndo(execution)}
                    />
                  }
                />
              );
            }

            return (
              <CompactExerciseRow
                key={pe.id}
                plannedExercise={pe}
                execution={execution}
                rowNumber={index + 1}
                onSelect={() => setFocus(pe.id)}
              />
            );
          })}
        </ol>
      </section>

      {after}

      {active && activeExecution && (
        <ExerciseActionDock
          firstName={firstName}
          plannedExercise={active}
          execution={activeExecution}
          index={activeIndex}
          total={exercises.length}
          onMark={(isCompleted) => mark(active, activeExecution, isCompleted)}
          onUndo={() => onUndo(activeExecution)}
        />
      )}
    </>
  );
}

SessionDayPlan.displayName = "SessionDayPlan";
