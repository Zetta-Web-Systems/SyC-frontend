import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { setTurnHold } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { SetTurnHoldDto } from "../../types";

export function useSetTurnHoldMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ turnId, dto }: { turnId: string; dto: SetTurnHoldDto }) =>
      setTurnHold(turnId, dto),
    onSuccess: (turn) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success(
        turn.heldByOwner ? "Lugar guardado" : "El lugar dejó de estar guardado",
        {
          description: `${turn.member.name} ${turn.member.lastname}.`,
        },
      );
    },
  });
}
