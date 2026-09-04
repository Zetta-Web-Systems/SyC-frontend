import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { createTimeSlots } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import { formatSlotRange } from "../../lib/slotStatus";
import type { CreateTimeSlotDto, ScheduleWeek } from "../../types";

export function useCreateTimeSlotsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateTimeSlotDto) => {
      const currentWeek = queryClient
        .getQueriesData<ScheduleWeek>({ queryKey: SCHEDULE_KEYS.weeks() })
        .map(([, weekData]) => weekData)
        .find((weekData): weekData is ScheduleWeek => weekData !== undefined);

      return createTimeSlots(dto, currentWeek);
    },
    onSuccess: (slots) => {
      toast.success("Horario agregado", {
        description: `El horario de ${formatSlotRange(slots[0].startTime, slots[0].endTime)} fue agregado correctamente de lunes a viernes. Los días que no correspondan se pueden cerrar desde cada celda.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
