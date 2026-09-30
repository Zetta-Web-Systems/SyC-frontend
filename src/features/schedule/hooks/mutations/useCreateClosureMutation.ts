import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { createClosure } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { CreateClosureDto } from "../../types";

export function useCreateClosureMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CreateClosureDto) => createClosure(dto),
    onSuccess: (closure) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Día cerrado", {
        description: `El cierre por ${closure.type.toLowerCase()} fue registrado correctamente.`,
      });
    },
  });
}
