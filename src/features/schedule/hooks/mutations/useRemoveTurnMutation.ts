import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { MEMBERS_KEYS } from "@features/members";
import { removeTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";

interface RemoveTurnVariables {
  turnId: string;
  memberId: string;
  memberName: string;
}

export function useRemoveTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ turnId }: RemoveTurnVariables) => removeTurn(turnId),
    onSuccess: (_data, { memberId, memberName }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: MEMBERS_KEYS.detail(memberId),
      });
      toast.success("Alumno retirado", {
        description: `${memberName} fue retirado del horario y pasó a la lista de alumnos sin asignar.`,
      });
    },
  });
}
