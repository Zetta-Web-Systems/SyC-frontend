import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { restoreInstructor } from "../services/instructors.api";
import { INSTRUCTORS_KEYS } from "@features/instructors/constants/instructors.constants";

export function useRestoreInstructorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string }) => restoreInstructor(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTRUCTORS_KEYS.all });
      toast.success("Profesor restaurado", {
        description: "El profesor fue restaurado correctamente.",
      });
    },
  });
}
