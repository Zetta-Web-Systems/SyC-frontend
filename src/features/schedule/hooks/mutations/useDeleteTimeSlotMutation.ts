import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlot } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import { describeDaySelection } from "../../lib/scheduleDays";
import { getSlotsInRow, runRowOperation } from "../../lib/scheduleRows";
import type { TimeSlot } from "../../types";

interface DeleteTimeSlotRowVariables {
  startTime: string;
  endTime: string;
  weekSlots: TimeSlot[];
}

export function useDeleteTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      startTime,
      endTime,
      weekSlots,
    }: DeleteTimeSlotRowVariables) => {
      const targets = getSlotsInRow(weekSlots, startTime, endTime);

      if (targets.length === 0) {
        throw new Error("No quedan días abiertos a esa hora para eliminar.");
      }

      return runRowOperation(targets, (slot) => deleteTimeSlot(slot.id), {
        done: "eliminado",
        action: "eliminar",
      });
    },
    onSuccess: (_data, { startTime, endTime, weekSlots }) => {
      const days = getSlotsInRow(weekSlots, startTime, endTime).map(
        (slot) => slot.dayOfWeek,
      );

      toast.success("Horario eliminado", {
        description: `El horario fue eliminado correctamente ${describeDaySelection(days)}.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
