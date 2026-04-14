import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateRiskFlag } from "../../services/riskFlags.api";
import { RISK_FLAGS_KEYS } from "../../constants";
import type { UpdateRiskFlag } from "../../types";

export function useUpdateRiskFlagMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRiskFlag }) =>
      updateRiskFlag(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: RISK_FLAGS_KEYS.all });
      toast.success("Bandera de riesgo actualizada", {
        description: "La bandera de riesgo fue actualizada correctamente.",
      });
    },
  });
}
