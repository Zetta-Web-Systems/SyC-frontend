import { useCallback, useMemo } from "react";
import { formatMemberFullName } from "../lib/memberDisplay";
import type { MemberTurn } from "../types";
import { useRemoveTurnMutation } from "./mutations/useRemoveTurnMutation";
import { useSetTurnHoldMutation } from "./mutations/useSetTurnHoldMutation";

export interface TurnActions {
  toggleHold: (turn: MemberTurn) => void;
  remove: (turn: MemberTurn) => void;
}

export function useTurnActions(): TurnActions {
  const setTurnHold = useSetTurnHoldMutation();
  const removeTurn = useRemoveTurnMutation();

  const toggleHold = useCallback(
    (turn: MemberTurn) => {
      setTurnHold.mutate({
        turnId: turn.id,
        dto: { heldByOwner: !turn.heldByOwner },
      });
    },
    [setTurnHold],
  );

  const remove = useCallback(
    (turn: MemberTurn) => {
      removeTurn.mutate({
        turnId: turn.id,
        memberName: formatMemberFullName(turn.member),
      });
    },
    [removeTurn],
  );

  return useMemo(() => ({ toggleHold, remove }), [toggleHold, remove]);
}
