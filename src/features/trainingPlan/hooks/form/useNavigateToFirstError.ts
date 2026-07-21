import { useEffect, useRef } from "react";
import { useFormContext, useFormState } from "react-hook-form";
import type { DayName } from "../../constants";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";
import { useTrainingPlanFormErrors } from "./useTrainingPlanFormErrors";

interface UseNavigateToFirstErrorOptions {
  onActivateDay: (dayName: DayName) => void;
}

export function useNavigateToFirstError({
  onActivateDay,
}: UseNavigateToFirstErrorOptions) {
  const { control } = useFormContext<RegisterTrainingPlanFormSchema>();
  const { submitCount, isSubmitting } = useFormState({ control });
  const { firstErrorLocation, hasAnyError } = useTrainingPlanFormErrors();
  const lastHandledCount = useRef(0);

  useEffect(() => {
    if (isSubmitting) return;
    if (submitCount === lastHandledCount.current) return;
    if (!hasAnyError) {
      lastHandledCount.current = submitCount;
      return;
    }
    lastHandledCount.current = submitCount;

    if (firstErrorLocation?.dayName) {
      onActivateDay(firstErrorLocation.dayName);
    }

    requestAnimationFrame(() => {
      const target = document.querySelector<HTMLElement>(
        "[data-invalid='true']",
      );
      target?.scrollIntoView({ behavior: "smooth", block: "center" });
    });
  }, [
    submitCount,
    isSubmitting,
    hasAnyError,
    firstErrorLocation,
    onActivateDay,
  ]);
}
