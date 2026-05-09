import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateGroupExercise } from "../../services/groupExercises.api";
import { GROUP_EXERCISES_KEYS } from "../../constants";
import type { UpdateExerciseGroup } from "../../types";

export function useUpdateGroupExerciseMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateExerciseGroup }) =>
      updateGroupExercise(id, dto),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: GROUP_EXERCISES_KEYS.all });
      toast.success("Grupo de ejercicios actualizado", {
        description: `El grupo de ejercicios "${data.name}" fue actualizado correctamente.`,
      });
    },
  });
}
