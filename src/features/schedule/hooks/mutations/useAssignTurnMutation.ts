import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { MEMBERS_KEYS } from "@features/members";
import { assignTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { AssignTurnDto } from "../../types";

interface AssignTurnVariables {
  dto: AssignTurnDto;
  memberName: string;
}

export function useAssignTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto }: AssignTurnVariables) => assignTurn(dto),
    onSuccess: (_data, { dto, memberName }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: MEMBERS_KEYS.detail(dto.memberId),
      });
      toast.success("Alumno asignado", {
        description: `${memberName} fue anotado en el horario correctamente.`,
      });
    },
  });
}
