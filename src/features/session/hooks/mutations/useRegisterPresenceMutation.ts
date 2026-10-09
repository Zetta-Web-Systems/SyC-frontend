import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { SESSION_KEYS } from "../../constants";
import { registerPresence } from "../../services/session.api";
import { boardHasTurn } from "../../lib/sessionBoardCache";

export function useRegisterPresenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: registerPresence,
    onSuccess: (_data, dto) => {
      void queryClient.invalidateQueries({
        queryKey: SESSION_KEYS.boards(),
        predicate: boardHasTurn(dto.timeSlotId),
      });
      toast.success("Asistencia registrada", {
        description: "Ya figura como presente en el turno",
      });
    },
  });
}
