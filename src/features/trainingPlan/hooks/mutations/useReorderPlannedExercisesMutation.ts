import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { reorderPlannedExercises } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { ReorderPlannedExercises } from "../../types";

export function useReorderPlannedExercisesMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      trainingDayId,
      dto,
    }: {
      trainingDayId: string;
      dto: ReorderPlannedExercises;
    }) => reorderPlannedExercises(trainingDayId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Ejercicios reordenados", {
        description: "Los ejercicios fueron reordenados correctamente.",
      });
    },
  });
}
