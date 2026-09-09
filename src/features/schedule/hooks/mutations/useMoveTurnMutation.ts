import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { MEMBERS_KEYS } from "@features/members";
import { moveTurn } from "../../services/schedule.api";
import { SCHEDULE_KEYS } from "../../constants";
import type { MoveTurnDto } from "../../types";

interface MoveTurnVariables {
  dto: MoveTurnDto;
  memberName: string;
}

export function useMoveTurnMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ dto }: MoveTurnVariables) => moveTurn(dto),
    onSuccess: (_data, { dto, memberName }) => {
      queryClient.invalidateQueries({ queryKey: SCHEDULE_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: MEMBERS_KEYS.detail(dto.memberId),
      });
      toast.success("Turno reasignado", {
        description: `${memberName} fue movido al nuevo horario correctamente.`,
      });
    },
  });
}
