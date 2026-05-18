import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateExercise } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";
import type { UpdateExercise } from "../../types";

export function useUpdateExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExercise }) =>
      updateExercise(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      toast.success("Ejercicio actualizado", {
        description: `El ejercicio "${data.name}" fue actualizado correctamente.`,
      });
    },
  });
}
