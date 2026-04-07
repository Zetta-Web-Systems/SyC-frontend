import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { restoreMember } from "../../services/members.api";
import { MEMBERS_KEYS } from "../../constants";

export function useRestoreMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => restoreMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all });
      toast.success("Alumno restaurado", {
        description: "El alumno fue restaurado correctamente.",
      });
    },
  });
}
