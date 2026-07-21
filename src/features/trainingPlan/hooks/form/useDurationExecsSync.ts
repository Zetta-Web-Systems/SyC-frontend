import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import { syncAllDaysToDuration } from "../../lib/defaultExecs";

export function useDurationExecsSync() {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();
  const durationInWeeks = useWatch({
    control: form.control,
    name: "durationInWeeks",
  });
  const previous = useRef(durationInWeeks);

  useEffect(() => {
    if (durationInWeeks === previous.current) return;
    previous.current = durationInWeeks;

    const currentDays = form.getValues("trainingDays");
    const nextDays = syncAllDaysToDuration(currentDays, durationInWeeks);
    form.setValue("trainingDays", nextDays, { shouldDirty: true });
  }, [durationInWeeks, form]);
}
