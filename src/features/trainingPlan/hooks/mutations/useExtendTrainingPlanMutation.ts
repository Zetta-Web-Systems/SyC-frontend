import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { extendTrainingPlan } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

export function useExtendTrainingPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingPlanId,
      weeksToExtend,
    }: {
      trainingPlanId: string;
      weeksToExtend: number;
    }) => extendTrainingPlan(trainingPlanId, { weeksToExtend }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Planificación extendida", {
        description: "La planificación fue extendida correctamente.",
      });
    },
  });
}
