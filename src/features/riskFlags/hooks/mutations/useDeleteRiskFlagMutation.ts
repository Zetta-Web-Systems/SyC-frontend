import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteRiskFlag } from "../../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../../constants";

export function useDeleteRiskFlagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteRiskFlag(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RISK_FLAGS_KEYS.all });
      toast.success("Bandera de riesgo eliminada", {
        description: "La bandera de riesgo fue eliminada correctamente.",
      });
    },
  });
}
