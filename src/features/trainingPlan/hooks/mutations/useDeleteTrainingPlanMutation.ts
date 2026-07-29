import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTrainingPlan } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

export function useDeleteTrainingPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingPlanId }: { trainingPlanId: string }) =>
      deleteTrainingPlan(trainingPlanId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Planificación eliminada", {
        description: "La planificación fue eliminada correctamente.",
      });
    },
  });
}
