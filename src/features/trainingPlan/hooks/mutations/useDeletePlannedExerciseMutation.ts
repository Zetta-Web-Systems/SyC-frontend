import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deletePlannedExercise } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

export function useDeletePlannedExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ plannedExerciseId }: { plannedExerciseId: string }) =>
      deletePlannedExercise(plannedExerciseId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Ejercicio eliminado", {
        description: "El ejercicio fue eliminado del plan correctamente.",
      });
    },
  });
}
