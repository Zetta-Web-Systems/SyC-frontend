import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "@shared/stores/toast.store";
import { formatSlotRange } from "@features/schedule";
import { USER_ROLE, useAuthStore } from "@features/auth";
import { SESSION_KEYS } from "../../constants";
import { registerSession } from "../../services/session.api";
import { boardHasTurn } from "../../lib/sessionBoardCache";
import type { SessionTurn } from "../../types";

interface RegisterSessionVariables {
  turn: SessionTurn;
  observations?: string;
}

export function useRegisterSessionMutation() {
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: ({ turn, observations }: RegisterSessionVariables) =>
      registerSession(
        { timeSlotId: turn.timeSlotId, observations },
        {
          timeSlot: {
            id: turn.timeSlotId,
            dayOfWeek: turn.dayOfWeek,
            startTime: turn.startTime,
            endTime: turn.endTime,
            capacity: turn.capacity,
            tag: turn.tag,
          },
          registeredBy: user
            ? {
                id: user.id,
                name: user.firstName ?? user.email,
                lastname: user.lastName ?? "",
              }
            : null,
          isAdmin: user?.role === USER_ROLE.ADMIN,
        },
      ),
    onSuccess: ({ timeSlot }) => {
      void queryClient.invalidateQueries({
        queryKey: SESSION_KEYS.boards(),
        predicate: boardHasTurn(timeSlot.id),
      });
      toast.success("Sesión finalizada", {
        description: `Turno de ${formatSlotRange(timeSlot.startTime, timeSlot.endTime)}`,
      });
    },
  });
}
