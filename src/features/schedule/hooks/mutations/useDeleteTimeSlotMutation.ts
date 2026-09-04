import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteTimeSlotRow } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { ScheduleWeek } from "../../types";

export function useDeleteTimeSlotMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ startTime }: { startTime: string }) => {
      const currentWeek = queryClient
        .getQueriesData<ScheduleWeek>({ queryKey: SCHEDULE_KEYS.weeks() })
        .map(([, weekData]) => weekData)
        .find((weekData): weekData is ScheduleWeek => weekData !== undefined);

      return deleteTimeSlotRow(startTime, currentWeek);
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
