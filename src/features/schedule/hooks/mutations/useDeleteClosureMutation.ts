import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteClosure } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useDeleteClosureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ date }: { date: string }) => deleteClosure(date),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Cierre eliminado", {
        description: "El día fue habilitado nuevamente.",
      });
    },
  });
}
