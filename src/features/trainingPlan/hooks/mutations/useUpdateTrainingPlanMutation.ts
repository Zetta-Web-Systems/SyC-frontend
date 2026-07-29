import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateTrainingPlan } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { UpdateTrainingPlan } from "../../types";

export function useUpdateTrainingPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateTrainingPlan }) =>
      updateTrainingPlan(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Planificación actualizada", {
        description: "La planificación fue actualizada correctamente.",
      });
    },
  });
}
