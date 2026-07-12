import { useMemo } from "react";
import type { UseFormReturn } from "react-hook-form";
import { confirm } from "@shared/stores/confirm.store";
import { TrainingPlanForm } from "../TrainingPlanForm/TrainingPlanForm";
import { useTrainingPlanSnapshot } from "../../hooks/form/useTrainingPlanSnapshot";
import { useSaveTrainingPlan } from "../../hooks/useSaveTrainingPlan";
import { trainingPlanToFormValues } from "../../lib/trainingPlanFormMapping";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import type { TrainingPlan } from "../../types";

interface TrainingPlanEditorProps {
  plan: TrainingPlan;
  onDone: () => void;
}

export function TrainingPlanEditor({ plan, onDone }: TrainingPlanEditorProps) {
  const formValues = useMemo(() => trainingPlanToFormValues(plan), [plan]);
  const { snapshotRef } = useTrainingPlanSnapshot(formValues);

  const { save, isSaving, mutation } = useSaveTrainingPlan({
    planId: plan.id,
    snapshotRef,
    onSuccess: onDone,
  });

  function handleSubmit(
    data: RegisterTrainingPlanFormSchema,
    form: UseFormReturn<RegisterTrainingPlanFormSchema>,
  ) {
    confirm({
      intent: "info",
      title: "Guardar cambios",
      description: "¿Querés guardar los cambios de la planificación?",
      confirmLabel: "Guardar cambios",
      cancelLabel: "Seguir editando",
      onConfirm: () => {
        void save(data, form);
      },
    });
  }

  return (
    <TrainingPlanForm
      editMode
      initialMember={plan.member ?? null}
      instructorName={plan.instructor}
      defaultValues={formValues}
      onSubmit={handleSubmit}
      onCancel={onDone}
      isPending={isSaving}
      mutation={mutation}
      guardUnsavedChanges={!isSaving}
      submitLabel="Guardar cambios"
    />
  );
}

TrainingPlanEditor.displayName = "TrainingPlanEditor";
