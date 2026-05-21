import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerTrainingPlan } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { RegisterTrainingPlan } from "../../types";

export function useRegisterTrainingPlanMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      memberId,
      dto,
    }: {
      memberId: string;
      dto: RegisterTrainingPlan;
    }) => registerTrainingPlan(memberId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Planificación creada", {
        description: "La planificación fue registrada correctamente.",
      });
    },
  });
}
