import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useCloseTimeSlotCellMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ timeSlotId }: { timeSlotId: string }) =>
      deleteTimeSlot(timeSlotId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Horario cerrado", {
        description:
          "El horario fue cerrado para ese día. Los alumnos anotados quedaron sin turno.",
      });
    },
  });
}
