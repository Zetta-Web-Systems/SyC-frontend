import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { removeTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

export function useRemoveTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ turnId }: { turnId: string; memberName: string }) =>
      removeTurn(turnId),
    onSuccess: (_data, { memberName }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Alumno sin turno", {
        description: `${memberName} quedó en la lista de sin asignar.`,
      });
    },
  });
}
