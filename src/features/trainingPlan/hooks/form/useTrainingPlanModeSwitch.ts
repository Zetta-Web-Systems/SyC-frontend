import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import {
  buildModeResetValues,
  type RegisterTrainingPlanMode,
} from "../../lib/trainingPlanModeReset";

export type { RegisterTrainingPlanMode };

export function useTrainingPlanModeSwitch() {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();

  const setMode = useCallback(
    (next: RegisterTrainingPlanMode) => {
      const current = form.getValues();
      form.reset(buildModeResetValues(current, next), { keepDirty: true });
    },
    [form],
  );

  return { setMode };
}
