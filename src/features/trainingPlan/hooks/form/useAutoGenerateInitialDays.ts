import { useEffect, useRef } from "react";
import { useFormContext } from "react-hook-form";
import type {
  RegisterTrainingDayFormSchema,
  RegisterTrainingPlanFormSchema,
} from "../../schemas/registerTrainingPlan.schema";
import { DAY_ORDER } from "../../lib/dayOrder";

export function useAutoGenerateInitialDays() {
  const form = useFormContext<RegisterTrainingPlanFormSchema>();
  const didRun = useRef(false);

  useEffect(() => {
    if (didRun.current) return;

    const currentDays = form.getValues("trainingDays");
    if (currentDays.length > 0) {
      didRun.current = true;
      return;
    }

    const daysPerWeek = form.getValues("daysPerWeek");
    if (!daysPerWeek || daysPerWeek <= 0) return;

    const count = Math.min(daysPerWeek, DAY_ORDER.length);
    const nextDays: RegisterTrainingDayFormSchema[] = DAY_ORDER.slice(
      0,
      count,
    ).map((dayName, index) => ({
      order: index,
      dayName,
      trainingDayLabel: "",
      plannedExercises: [],
    }));

    form.setValue("trainingDays", nextDays, { shouldDirty: false });
    didRun.current = true;
  }, [form]);
}
