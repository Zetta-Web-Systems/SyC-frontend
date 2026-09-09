import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import { formatSlotTime } from "../../lib/slotStatus";
import type { RegisterTimeSlotDto } from "../../types";

export function useOpenTimeSlotCellMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: RegisterTimeSlotDto) => registerTimeSlot(dto),
    onSuccess: (slot) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Horario abierto", {
        description: `El horario de las ${formatSlotTime(slot.startTime)} volvió a estar disponible ese día. Los alumnos hay que anotarlos de nuevo.`,
      });
    },
  });
}
