import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { registerTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_DAYS, SCHEDULE_KEYS } from "../../constants";
import { describeDaySelection } from "../../lib/scheduleDays";
import {
  describeSlotDays,
  findOverlappingSlots,
} from "../../lib/scheduleOverlap";
import { runRowOperation } from "../../lib/scheduleRows";
import {
  formatSlotRange,
  getSlotEndTime,
  normalizeTime,
} from "../../lib/slotStatus";
import type { CreateTimeSlotDto, TimeSlot } from "../../types";

interface CreateTimeSlotsVariables {
  dto: CreateTimeSlotDto;
  weekSlots: TimeSlot[];
}

const FULL_WEEK_NOTE =
  " Los días que no correspondan se pueden eliminar desde el menú de cada celda.";

export function useCreateTimeSlotsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, weekSlots }: CreateTimeSlotsVariables) => {
      const startTime = normalizeTime(dto.startTime);
      const endTime = dto.endTime
        ? normalizeTime(dto.endTime)
        : getSlotEndTime(startTime);

      const conflicts = findOverlappingSlots(weekSlots, {
        startTime,
        endTime,
        days: dto.days,
      });

      if (conflicts.length > 0) {
        throw new Error(
          `Ya existe un horario en ese rango los días: ${describeSlotDays(conflicts)}.`,
        );
      }

      return runRowOperation(
        dto.days.map((dayOfWeek) => ({ dayOfWeek })),
        ({ dayOfWeek }) =>
          registerTimeSlot({
            dayOfWeek,
            startTime,
            endTime,
            capacity: dto.capacity,
          }),
        { done: "creado", action: "crear" },
      );
    },
    onSuccess: (slots, { dto }) => {
      const isFullWeek = dto.days.length === SCHEDULE_DAYS.length;

      toast.success("Horario agregado", {
        description: `El horario de ${formatSlotRange(slots[0].startTime, slots[0].endTime)} fue agregado correctamente ${describeDaySelection(dto.days)}.${isFullWeek ? FULL_WEEK_NOTE : ""}`,
      });
    },
    // INFO: La fila puede quedar a medias, así que se refresca falle o no.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
