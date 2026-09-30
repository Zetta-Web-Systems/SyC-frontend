import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { deleteRecoveryTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

interface DeleteRecoveryTurnVariables {
  recoveryId: string;
  memberName: string;
}

export function useDeleteRecoveryTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ recoveryId }: DeleteRecoveryTurnVariables) =>
      deleteRecoveryTurn(recoveryId),
    onSuccess: (_data, { memberName }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Recuperación quitada", {
        description: `${memberName} ya no figura en ese horario.`,
      });
    },
  });
}
