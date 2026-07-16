import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerMembership } from "../../services/memberPlans.api";
import { MEMBER_PLAN_KEYS } from "../../constants";

export function useAssignMembershipMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerMembership,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_PLAN_KEYS.all });
      toast.success("Membresía asignada", {
        description: "Se registró la membresía y su primera cuota.",
      });
    },
  });
}
