import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteClosure } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useDeleteClosureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ closureId }: { closureId: string }) =>
      deleteClosure(closureId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Se quitó el cierre", {
        description: "El día vuelve a estar abierto.",
      });
    },
  });
}
