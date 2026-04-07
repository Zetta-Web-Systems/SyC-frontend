import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerMember } from "../../services/members.api";
import { MEMBERS_KEYS } from "../../constants";

export function useRegisterMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all });
      toast.success("Alumno creado", {
        description: "El alumno fue registrado correctamente.",
      });
    },
  });
}
