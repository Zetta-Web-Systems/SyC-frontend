import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { addTrainingDay } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { AddTrainingDay } from "../../types";

export function useAddTrainingDayMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingPlanId,
      dto,
    }: {
      trainingPlanId: string;
      dto: AddTrainingDay;
    }) => addTrainingDay(trainingPlanId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Día agregado", {
        description: "El día fue agregado a la planificación correctamente.",
      });
    },
  });
}
