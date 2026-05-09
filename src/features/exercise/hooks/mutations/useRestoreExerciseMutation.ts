import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { restoreExercise } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";

export function useRestoreExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; name: string }) => restoreExercise(id),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      toast.success("Ejercicio restaurado", {
        description: `El ejercicio "${name}" fue restaurado correctamente.`,
      });
    },
  });
}
