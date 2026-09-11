import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteClosure } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import {
  eachDateInRange,
  runClosureDeletion,
} from "../../lib/scheduleClosures";
import type { CalendarClosure } from "../../types";

interface DeleteClosureVariables {
  closure: CalendarClosure;
}

export function useDeleteClosureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ closure }: DeleteClosureVariables) =>
      runClosureDeletion(
        eachDateInRange(closure.startDate, closure.endDate),
        deleteClosure,
      ),
    onSuccess: (_data, { closure }) => {
      const days = eachDateInRange(closure.startDate, closure.endDate).length;

      toast.success("Cierre eliminado", {
        description:
          days === 1
            ? "El día fue habilitado nuevamente."
            : `Los ${days} días del cierre fueron habilitados nuevamente.`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
    },
  });
}
