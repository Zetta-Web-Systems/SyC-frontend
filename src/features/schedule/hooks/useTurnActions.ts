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
  showSlots: (member: MemberSimple) => void;
  markRecovery: (member: MemberSimple) => void;
  removeRecovery: (recovery: RecoveryTurn) => void;
}

export function useTurnActions(
  modals: ScheduleModalsState,
  onSearchMember: (value: string) => void,
): TurnActions {
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

  const showSlots = useCallback(
    (member: MemberSimple) => {
      onSearchMember(formatMemberFullName(member));
    },
    [onSearchMember],
  );

  return useMemo(
    () => ({
      toggleHold,
      remove,
      showSlots,
      markRecovery: recovery.mark,
      removeRecovery: recovery.remove,
    }),
    [toggleHold, remove, showSlots, recovery.mark, recovery.remove],
  );
}
