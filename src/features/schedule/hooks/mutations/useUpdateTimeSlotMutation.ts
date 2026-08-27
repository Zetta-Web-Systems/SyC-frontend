import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { updateTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { UpdateTimeSlotDto } from "../../types";

export function useUpdateTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      timeSlotId,
      dto,
    }: {
      timeSlotId: string;
      dto: UpdateTimeSlotDto;
    }) => updateTimeSlot(timeSlotId, dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Horario actualizado", {
        description: "El horario fue actualizado correctamente.",
      });
    },
  });
}
