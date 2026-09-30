import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlot, registerTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import { describeSlotRanges } from "../../lib/scheduleOverlap";
import { formatSlotTime } from "../../lib/slotStatus";
import type { RegisterTimeSlotDto, TimeSlot } from "../../types";

interface OpenTimeSlotCellVariables {
  dto: RegisterTimeSlotDto;
  replacedSlots?: TimeSlot[];
}

export function useOpenTimeSlotCellMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ dto, replacedSlots }: OpenTimeSlotCellVariables) => {
      for (const slot of replacedSlots ?? []) {
        await deleteTimeSlot(slot.id);
      }

      return registerTimeSlot(dto);
    },
    onSuccess: (slot, { replacedSlots }) => {
      const replaced = replacedSlots?.length
        ? ` Se borró el de ${describeSlotRanges(replacedSlots)}.`
        : "";

      toast.success("Horario abierto", {
        description: `El horario de las ${formatSlotTime(slot.startTime)} quedó disponible ese día.${replaced} Los alumnos hay que anotarlos de nuevo.`,
      });
    },
    // INFO: Si el borrado sale y el alta no, ese día queda sin horario: se refresca igual.
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
