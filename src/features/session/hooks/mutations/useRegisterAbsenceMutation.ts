import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { SESSION_KEYS } from "../../constants";
import { registerAbsence } from "../../services/session.api";
import { boardHasTurn } from "../../lib/sessionBoardCache";
import type { RegisterAbsenceDto } from "../../types";

interface RegisterAbsenceVariables {
  dto: RegisterAbsenceDto;
  isPresent: boolean;
  turnStartTime: string;
}

export function useRegisterAbsenceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto, isPresent, turnStartTime }: RegisterAbsenceVariables) =>
      registerAbsence(dto, { isPresent, turnStartTime }),
    onSuccess: (_data, { dto }) => {
      void queryClient.invalidateQueries({
        queryKey: SESSION_KEYS.boards(),
        predicate: boardHasTurn(dto.timeSlotid),
      });
      toast.success("Ausencia registrada", {
        description: "Ya figura como ausente en el turno",
      });
    },
  });
}
