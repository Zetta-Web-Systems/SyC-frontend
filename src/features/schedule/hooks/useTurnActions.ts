import { useCallback, useMemo } from "react";
import type { MemberSimple } from "@features/members";
import { formatMemberFullName } from "../lib/memberDisplay";
import type { MemberTurn, RecoveryTurn } from "../types";
import { useRemoveTurnMutation } from "./mutations/useRemoveTurnMutation";
import { useSetTurnHoldMutation } from "./mutations/useSetTurnHoldMutation";
import { useRecoveryActions } from "./useRecoveryActions";
import type { ScheduleModalsState } from "./ui/useScheduleModals";

export interface TurnActions {
  toggleHold: (turn: MemberTurn) => void;
  remove: (turn: MemberTurn) => void;
  markRecovery: (member: MemberSimple) => void;
  removeRecovery: (recovery: RecoveryTurn) => void;
}

export function useTurnActions(modals: ScheduleModalsState): TurnActions {
  const setTurnHold = useSetTurnHoldMutation();
  const removeTurn = useRemoveTurnMutation();
  const recovery = useRecoveryActions(modals);

  const toggleHold = useCallback(
    (turn: MemberTurn) => {
      setTurnHold.mutate({
        turnId: turn.id,
        dto: { onHold: !turn.onHold },
      });
    },
    [setTurnHold],
  );

  const remove = useCallback(
    (turn: MemberTurn) => {
      removeTurn.mutate({
        turnId: turn.id,
        memberId: turn.member.id,
        memberName: formatMemberFullName(turn.member),
      });
    },
    [removeTurn],
  );

  return useMemo(
    () => ({
      toggleHold,
      remove,
      markRecovery: recovery.mark,
      removeRecovery: recovery.remove,
    }),
    [toggleHold, remove, recovery.mark, recovery.remove],
  );
}
