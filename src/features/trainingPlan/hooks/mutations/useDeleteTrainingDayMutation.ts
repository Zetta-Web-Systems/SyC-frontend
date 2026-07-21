import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTrainingDay } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";

export function useDeleteTrainingDayMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ trainingDayId }: { trainingDayId: string }) =>
      deleteTrainingDay(trainingDayId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Día eliminado", {
        description: "El día fue eliminado de la planificación correctamente.",
      });
    },
  });
}
