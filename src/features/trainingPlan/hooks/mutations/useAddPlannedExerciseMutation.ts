import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { addPlannedExercise } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { AddPlannedExercise } from "../../types";

export function useAddPlannedExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingDayId,
      dto,
    }: {
      trainingDayId: string;
      dto: AddPlannedExercise;
    }) => addPlannedExercise(trainingDayId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Ejercicio agregado", {
        description: "El ejercicio fue agregado al día correctamente.",
      });
    },
  });
}
