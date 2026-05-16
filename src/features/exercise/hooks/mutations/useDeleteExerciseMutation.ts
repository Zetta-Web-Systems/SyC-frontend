import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteExercise } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";

export function useDeleteExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; name: string }) => deleteExercise(id),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      toast.success("Ejercicio desactivado", {
        description: `El ejercicio "${name}" fue desactivado correctamente.`,
      });
    },
  });
}
