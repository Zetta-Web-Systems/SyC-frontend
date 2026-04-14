import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { restoreRiskFlag } from "../../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../../constants";

export function useRestoreRiskFlagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => restoreRiskFlag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RISK_FLAGS_KEYS.all });
      toast.success("Bandera de riesgo restaurada", {
        description: "La bandera de riesgo fue restaurada correctamente.",
      });
    },
  });
}
