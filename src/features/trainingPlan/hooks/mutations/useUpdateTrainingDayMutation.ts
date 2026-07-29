import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateTrainingDay } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { UpdateTrainingDay } from "../../types";

export function useUpdateTrainingDayMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingDayId,
      dto,
    }: {
      trainingDayId: string;
      dto: UpdateTrainingDay;
    }) => updateTrainingDay(trainingDayId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Día actualizado", {
        description: "El día de entrenamiento fue actualizado correctamente.",
      });
    },
  });
}
