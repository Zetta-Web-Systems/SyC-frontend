import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { createOverride } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { CreateOverrideDto } from "../../types";

export function useCreateOverrideMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateOverrideDto) => createOverride(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Horario bloqueado", {
        description:
          "Solo para esa fecha; el resto de las semanas sigue igual.",
      });
    },
  });
}
