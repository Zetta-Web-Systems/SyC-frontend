import { useCallback, useMemo, useState } from "react";

export interface UseWizardStepsResult {
  current: string;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  next: () => void;
  back: () => void;
  goTo: (name: string) => void;
  reset: () => void;
}

export function useWizardSteps(steps: readonly string[]): UseWizardStepsResult {
  const [current, setCurrent] = useState<string>(steps[0]);

  const index = steps.indexOf(current);
  const safeIndex = index === -1 ? 0 : index;

  const next = useCallback(() => {
    setCurrent((prev) => {
      const i = steps.indexOf(prev);
      if (i === -1 || i >= steps.length - 1) return prev;
      return steps[i + 1];
    });
  }, [steps]);

  const back = useCallback(() => {
    setCurrent((prev) => {
      const i = steps.indexOf(prev);
      if (i <= 0) return prev;
      return steps[i - 1];
    });
  }, [steps]);

  const goTo = useCallback(
    (name: string) => {
      if (steps.includes(name)) setCurrent(name);
    },
    [steps],
  );

  const reset = useCallback(() => setCurrent(steps[0]), [steps]);

  return useMemo(
    () => ({
      current,
      index: safeIndex,
      isFirst: safeIndex === 0,
      isLast: safeIndex === steps.length - 1,
      next,
      back,
      goTo,
      reset,
    }),
    [current, safeIndex, steps.length, next, back, goTo, reset],
  );
}
