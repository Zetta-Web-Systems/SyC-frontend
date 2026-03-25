import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { createInstructor } from "../../services/instructors.api";
import { INSTRUCTORS_KEYS } from "../../constants/instructors.constants";

export function useCreateInstructorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTRUCTORS_KEYS.all });
      toast.success("Profesor creado", {
        description: "El profesor fue registrado correctamente.",
      });
    },
  });
}
