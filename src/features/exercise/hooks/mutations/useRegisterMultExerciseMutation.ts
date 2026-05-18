import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerExercisesBulk } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";
import type { RegisterExercise } from "../../types";

export function useRegisterMultExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      dtos,
    }: {
      groupId: string;
      dtos: RegisterExercise[];
    }) => registerExercisesBulk(groupId, dtos),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      const count = data.length;
      toast.success(
        `${count} ${count === 1 ? "ejercicio" : "ejercicios"} creados`,
        {
          description: "Los ejercicios fueron registrados correctamente.",
        },
      );
    },
  });
}
