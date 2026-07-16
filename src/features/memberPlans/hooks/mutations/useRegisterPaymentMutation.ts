import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerPayment } from "../../services/memberPlans.api";
import { MEMBER_PLAN_KEYS } from "../../constants";

export function useRegisterPaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerPayment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_PLAN_KEYS.all });
      toast.success("Pago registrado", {
        description: "El pago se registró correctamente.",
      });
    },
  });
}
