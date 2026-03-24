import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteInstructor } from "../services/instructors.api";
import { INSTRUCTORS_KEYS } from "@features/instructors/constants/instructors.constants";

export function useDeleteInstructorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => deleteInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTRUCTORS_KEYS.all });
      toast.success("Profesor eliminado", {
        description: "El profesor fue eliminado correctamente.",
      });
    },
  });
}
