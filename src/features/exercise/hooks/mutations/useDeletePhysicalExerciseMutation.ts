import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { physicalDeleteExercise } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";

export function useDeletePhysicalExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; name: string }) =>
      physicalDeleteExercise(id),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      toast.success("Ejercicio eliminado", {
        description: `El ejercicio "${name}" fue eliminado definitivamente.`,
      });
    },
  });
}
