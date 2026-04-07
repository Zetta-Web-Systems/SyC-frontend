import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteMember } from "../../services/members.api";
import { MEMBERS_KEYS } from "../../constants";

export function useDeleteMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteMember(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all });
      toast.success("Alumno eliminado", {
        description: "El alumno fue eliminado correctamente.",
      });
    },
  });
}
