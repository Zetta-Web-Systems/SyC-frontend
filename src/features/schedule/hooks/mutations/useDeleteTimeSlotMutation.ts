import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlotRow } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useDeleteTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ startTime }: { startTime: string }) =>
      deleteTimeSlotRow(startTime),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Horario eliminado");
    },
  });
}
