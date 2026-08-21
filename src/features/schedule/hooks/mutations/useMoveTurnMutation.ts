import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { moveTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { MoveTurnDto } from "../../types";

export function useMoveTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ turnId, dto }: { turnId: string; dto: MoveTurnDto }) =>
      moveTurn(turnId, dto),
    onSuccess: (turn) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Turno reasignado", {
        description: `${turn.member.name} ${turn.member.lastname} pasó a otro horario.`,
      });
    },
  });
}
