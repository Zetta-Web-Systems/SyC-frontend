import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import { getSlotsInRow, runRowOperation } from "../../lib/scheduleRows";
import type { TimeSlot } from "../../types";

interface DeleteTimeSlotRowVariables {
  startTime: string;
  weekSlots: TimeSlot[];
}

export function useDeleteTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ startTime, weekSlots }: DeleteTimeSlotRowVariables) => {
      const targets = getSlotsInRow(weekSlots, startTime);

      if (targets.length === 0) {
        throw new Error("No quedan días abiertos a esa hora para eliminar.");
      }

      return runRowOperation(targets, (slot) => deleteTimeSlot(slot.id), {
        done: "eliminado",
        action: "eliminar",
      });
    },
    onSuccess: () => {
      toast.success("Horario eliminado", {
        description:
          "El horario fue eliminado correctamente de toda la semana.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
