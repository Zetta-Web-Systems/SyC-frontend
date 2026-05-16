import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerGroupExercise } from "../../services/groupExercises.api";
import { GROUP_EXERCISES_KEYS } from "../../constants";

export function useRegisterGroupExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerGroupExercise,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GROUP_EXERCISES_KEYS.all });
      toast.success("Grupo de ejercicios creado", {
        description: `El grupo de ejercicios "${data.name}" fue registrado correctamente.`,
      });
    },
  });
}
