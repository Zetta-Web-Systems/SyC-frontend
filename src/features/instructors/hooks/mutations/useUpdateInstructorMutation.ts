import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateInstructor } from "../../services/instructors.api";
import { INSTRUCTORS_KEYS } from "../../constants/instructors.constants";

export function useUpdateInstructorMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      dto,
    }: {
      id: string;
      dto: Parameters<typeof updateInstructor>[1];
    }) => updateInstructor(id, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: INSTRUCTORS_KEYS.all });
      toast.success("Profesor actualizado", {
        description:
          "Los datos del profesor fueron actualizados correctamente.",
      });
    },
  });
}
