import { useQuery, keepPreviousData } from "@tanstack/react-query";
import type { PaginatedParams } from "@shared/types/pagination.types";
import { getTrainingPlansPaginated } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

export function useTrainingPlansQuery(params: PaginatedParams) {
  return useQuery({
    queryKey: TRAINING_PLANS_KEYS.list(params),
    queryFn: () => getTrainingPlansPaginated(params),
    placeholderData: keepPreviousData,
  });
}
