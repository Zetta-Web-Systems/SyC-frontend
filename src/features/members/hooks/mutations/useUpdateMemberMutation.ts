import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateMember } from "../../services/members.api";
import { MEMBERS_KEYS } from "../../constants";
import type { UpdateMember } from "../../types";

export function useUpdateMemberMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateMember }) =>
      updateMember(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBERS_KEYS.all });
      toast.success("Alumno actualizado", {
        description: "El alumno fue actualizado correctamente.",
      });
    },
  });
}
