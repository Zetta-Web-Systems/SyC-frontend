import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteOverride } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useDeleteOverrideMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ overrideId }: { overrideId: string }) =>
      deleteOverride(overrideId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Bloqueo eliminado", {
        description: "El horario fue habilitado nuevamente para esa fecha.",
      });
    },
  });
}
