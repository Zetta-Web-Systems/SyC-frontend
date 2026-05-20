import { useQuery } from "@tanstack/react-query";
import { getTrainingPlanById } from "../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../constants";

export function useTrainingPlanQuery(id: string | undefined) {
  return useQuery({
    queryKey: TRAINING_PLANS_KEYS.detail(id ?? ""),
    queryFn: () => getTrainingPlanById(id as string),
    enabled: !!id,
  });
}
