import { useRef } from "react";
import type { RefObject } from "react";
import type { RegisterTrainingPlanFormSchema } from "../../schemas/registerTrainingPlan.schema";

export function useTrainingPlanSnapshot(
  values: RegisterTrainingPlanFormSchema,
): {
  snapshotRef: RefObject<RegisterTrainingPlanFormSchema>;
} {
  const snapshotRef = useRef<RegisterTrainingPlanFormSchema>(
    structuredClone(values),
  );
  return { snapshotRef };
}
