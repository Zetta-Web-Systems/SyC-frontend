import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { addRecoveryTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { CreateRecoveryTurnDto } from "../../types";

interface AddRecoveryTurnVariables {
  dto: CreateRecoveryTurnDto;
  memberName: string;
  slotLabel: string;
}

export function useAddRecoveryTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto }: AddRecoveryTurnVariables) => addRecoveryTurn(dto),
    onSuccess: (_data, { memberName, slotLabel }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Recuperación registrada", {
        description: `${memberName} recupera el ${slotLabel}.`,
      });
    },
  });
}
