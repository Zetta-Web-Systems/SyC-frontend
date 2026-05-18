import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerExercise } from "../../services/exercises.api";
import { EXERCISES_KEYS } from "../../constants";
import type { RegisterExercise } from "../../types";

export function useRegisterExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      dto,
    }: {
      groupId: string;
      dto: RegisterExercise;
    }) => registerExercise(groupId, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: EXERCISES_KEYS.all });
      toast.success("Ejercicio creado", {
        description: `El ejercicio "${data.name}" fue registrado correctamente.`,
      });
    },
  });
}
