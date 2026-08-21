import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { createTimeSlots } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import {
  formatSlotRange,
  getSlotEndTime,
  normalizeTime,
} from "../../lib/slotStatus";
import type { CreateTimeSlotDto } from "../../types";

export function useCreateTimeSlotsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTimeSlotDto) => createTimeSlots(dto),
    onSuccess: (slots) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });

      const startTime = normalizeTime(slots[0].startTime);

      toast.success("Horario agregado", {
        description: `Quedó de ${formatSlotRange(startTime, getSlotEndTime(startTime))}, de lunes a viernes. Cerrá los días que no se usen desde cada celda.`,
      });
    },
  });
}
