import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerInstructor } from "../../services/instructors.api";
import { INSTRUCTORS_KEYS } from "../../constants/instructors.constants";

export function useRegisterInstructorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerInstructor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTRUCTORS_KEYS.all });
      toast.success("Profesor creado", {
        description: "El profesor fue registrado correctamente.",
      });
    },
  });
}
