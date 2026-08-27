import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { assignTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { AssignTurnDto } from "../../types";

export function useAssignTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: AssignTurnDto) => assignTurn(dto),
    onSuccess: (turn) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      toast.success("Alumno asignado", {
        description: `${turn.member.name} ${turn.member.lastname} fue anotado en el horario correctamente.`,
      });
    },
  });
}
