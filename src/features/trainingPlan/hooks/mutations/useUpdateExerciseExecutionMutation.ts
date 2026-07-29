import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateExerciseExecution } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { UpdateExerciseExecution } from "../../types";

export function useUpdateExerciseExecutionMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      exerciseExecutionId,
      dto,
    }: {
      exerciseExecutionId: string;
      dto: UpdateExerciseExecution;
    }) => updateExerciseExecution(exerciseExecutionId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Ejecución actualizada", {
        description: "La ejecución del ejercicio fue actualizada correctamente.",
      });
    },
  });
}
