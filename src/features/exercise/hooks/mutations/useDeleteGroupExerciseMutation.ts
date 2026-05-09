import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteGroupExercise } from "../../services/groupExercises.api";
import { GROUP_EXERCISES_KEYS } from "../../constants";

export function useDeleteGroupExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id }: { id: string; name: string }) =>
      deleteGroupExercise(id),
    onSuccess: (_data, { name }) => {
      queryClient.invalidateQueries({ queryKey: GROUP_EXERCISES_KEYS.all });
      toast.success("Grupo de ejercicios eliminado", {
        description: `El grupo de ejercicios "${name}" fue eliminado correctamente.`,
      });
    },
  });
}
