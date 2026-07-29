import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerTrainingPlanTemplate } from "../../services/trainingPlans.api";
import { TRAINING_PLANS_KEYS } from "../../constants";
import type { RegisterTrainingPlanTemplate } from "../../types";

export function useRegisterTrainingPlanTemplateMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterTrainingPlanTemplate) =>
      registerTrainingPlanTemplate(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TRAINING_PLANS_KEYS.all });
      toast.success("Plantilla creada", {
        description:
          "La plantilla de planificación fue registrada correctamente.",
      });
    },
  });
}
