import { useState } from "react";
import { Dumbbell, Trash2 } from "lucide-react";
import { Button, IconBox, Input, Modal } from "@shared/ui";
import { useExerciseQuery } from "@features/exercise";
import { useTrainingPlanFormHelpers } from "../../../hooks/form/useTrainingPlanFormHelpers";
import { useTrainingPlanFormErrors } from "../../../hooks/form/useTrainingPlanFormErrors";
import type { DayName } from "../../../constants";
import type {
  RegisterExerciseExecutionFormSchema,
  RegisterPlannedExerciseFormSchema,
} from "../../../schemas/registerTrainingPlan.schema";

interface ExerciseEditModalProps {
  dayName: DayName;
  exerciseOrder: number;
  onClose: () => void;
}

export function ExerciseEditModal({
  dayName,
  exerciseOrder,
  onClose,
}: ExerciseEditModalProps) {
  const { form, sortedDays, updateExercise, removeExercise } =
    useTrainingPlanFormHelpers();
  const { byDay } = useTrainingPlanFormErrors();
  const execsError = byDay
    .get(dayName)
    ?.exercises.get(exerciseOrder)?.executions;

  const day = sortedDays.find((d) => d.dayName === dayName);
  const planned = day?.plannedExercises.find((p) => p.order === exerciseOrder);

  const exerciseQuery = useExerciseQuery(planned?.exerciseId);
  const exercise = exerciseQuery.data;

  const [draft, setDraft] = useState<RegisterExerciseExecutionFormSchema[]>(
    () => planned?.exerciseExecutions.map((e) => ({ ...e })) ?? [],
  );

  if (!planned || !day) return null;

  function updateExec(
    index: number,
    patch: Partial<RegisterExerciseExecutionFormSchema>,
  ) {
    setDraft((prev) =>
      prev.map((e, i) => (i === index ? { ...e, ...patch } : e)),
    );
  }

  function handleSave() {
    if (!planned) return;
    const next: RegisterPlannedExerciseFormSchema = {
      ...planned,
      exerciseExecutions: draft.map((e, i) => ({ ...e, weekNumber: i + 1 })),
    };
    updateExercise(dayName, exerciseOrder, next);
    void form.trigger("trainingDays");
    onClose();
  }

  function handleDelete() {
    removeExercise(dayName, exerciseOrder);
    onClose();
  }

  const title = exercise?.name ?? "Ejercicio";

  return (
    <Modal
      open
      onClose={onClose}
      closeOnBackdropClick
      size="lg"
      footer={
        <>
          <Button
            type="button"
            variant="ghost"
            intent="danger"
            size="md"
            onClick={handleDelete}
          >
            <Trash2 size={14} aria-hidden="true" />
            Eliminar
          </Button>
          <div className="flex gap-2">
            <Button variant="solid" intent="danger" size="md" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              type="button"
              variant="solid"
              intent="primary"
              size="md"
              onClick={handleSave}
            >
              Guardar
            </Button>
          </div>
        </>
      }
    >
      <div className="px-4 py-4 sm:px-6 sm:py-5">
        <div className="mb-4 flex items-center gap-3 sm:mb-5">
          <IconBox size="xl" shape="lg" tone="subtle" intent="primary">
            <Dumbbell size={18} aria-hidden="true" />
          </IconBox>
          <div className="min-w-0 flex-1">
            <h3 className="m-0 text-lg font-bold text-neutral-900">{title}</h3>
            {exercise?.exerciseGroup && (
              <p className="mt-0.5 text-xs text-neutral-500">
                {exercise.exerciseGroup}
              </p>
            )}
          </div>
        </div>

        {execsError && (
          <p
            role="alert"
            className="mb-3 rounded-lg border border-error/25 bg-error/10 px-3 py-2 text-xs font-medium text-error"
          >
            {execsError}
          </p>
        )}

        <div className="overflow-x-auto rounded-xl border border-neutral-200">
          <table className="w-full min-w-105 text-sm">
            <thead className="bg-neutral-50 text-xs font-semibold tracking-wider text-neutral-500 uppercase">
              <tr>
                <th className="px-3 py-2 text-left">Semana</th>
                <th className="px-3 py-2 text-left">Series</th>
                <th className="px-3 py-2 text-left">Reps</th>
                <th className="px-3 py-2 text-left">RIR</th>
              </tr>
            </thead>
            <tbody>
              {draft.map((exec, i) => (
                <tr
                  key={i}
                  className="border-t border-neutral-100 first:border-t-0"
                >
                  <td className="px-3 py-2 font-semibold text-neutral-700">
                    S{i + 1}
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      type="number"
                      min={1}
                      value={exec.sets}
                      onChange={(e) =>
                        updateExec(i, {
                          sets: Math.max(1, parseInt(e.target.value, 10) || 1),
                        })
                      }
                      size="sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={exec.reps}
                      onChange={(e) => updateExec(i, { reps: e.target.value })}
                      placeholder="Cantidad o rango (e.g. 8-12)"
                      size="sm"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <Input
                      value={exec.rir ?? ""}
                      onChange={(e) =>
                        updateExec(i, { rir: e.target.value || undefined })
                      }
                      placeholder="Opcional"
                      size="sm"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-3 text-xs text-neutral-500">
          La cantidad de semanas se ajusta automáticamente con la duración del
          plan.
        </p>
      </div>
    </Modal>
  );
}

ExerciseEditModal.displayName = "ExerciseEditModal";
