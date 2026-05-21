import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { reorderTrainingDays } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { ReorderTrainingDays } from "../../types";

export function useReorderTrainingDaysMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingPlanId,
      dto,
    }: {
      trainingPlanId: string;
      dto: ReorderTrainingDays;
    }) => reorderTrainingDays(trainingPlanId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Días reordenados", {
        description: "Los días de entrenamiento fueron reordenados correctamente.",
      });
    },
  });
}
