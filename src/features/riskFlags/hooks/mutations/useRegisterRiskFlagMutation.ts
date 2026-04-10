import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerRiskFlag } from "../../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../../constants";

export function useRegisterRiskFlagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerRiskFlag,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RISK_FLAGS_KEYS.all });
      toast.success("Bandera de riesgo creada", {
        description: "La bandera de riesgo fue registrada correctamente.",
      });
    },
  });
}
