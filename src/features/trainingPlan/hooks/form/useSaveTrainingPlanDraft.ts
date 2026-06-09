import { useCallback } from "react";
import { useFormContext } from "react-hook-form";
import type { DayName } from "../../constants";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanDraft } from "../../stores/trainingPlanDraft.store";

export function useSaveTrainingPlanDraft() {
  const { getValues } = useFormContext<RegisterTrainingPlanFormSchema>();
  const stash = useTrainingPlanDraft((s) => s.stash);
  const save = useTrainingPlanDraft((s) => s.save);

  const stashDraft = useCallback(
    (activeDayName: DayName | null = null) => {
      const values = getValues();
      const memberId =
        values.mode === "plan" && values.memberId ? values.memberId : null;
      stash(values, memberId, activeDayName);
    },
    [getValues, stash],
  );

  const saveDraft = useCallback(
    (activeDayName: DayName | null = null) => {
      const values = getValues();
      const memberId =
        values.mode === "plan" && values.memberId ? values.memberId : null;
      save(values, memberId, activeDayName);
    },
    [getValues, save],
  );

  return { stashDraft, saveDraft };
}
