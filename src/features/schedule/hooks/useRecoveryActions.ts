import { useCallback, useMemo } from "react";
import { confirm } from "@shared/stores/confirm.store";
import type { MemberSimple } from "@features/members";
import { formatMemberFullName } from "../lib/memberDisplay";
import type { RecoveryTurn } from "../types";
import { useDeleteRecoveryTurnMutation } from "./mutations/useDeleteRecoveryTurnMutation";
import type { ScheduleModalsState } from "./ui/useScheduleModals";

export interface RecoveryActions {
  mark: (member: MemberSimple) => void;
  remove: (recovery: RecoveryTurn) => void;
}

export function useRecoveryActions(
  modals: ScheduleModalsState,
): RecoveryActions {
  const deleteRecoveryTurn = useDeleteRecoveryTurnMutation();
  const { openRecoveryTurn } = modals;

  const mark = useCallback(
    (member: MemberSimple) => {
      openRecoveryTurn({ kind: "member", member });
    },
    [openRecoveryTurn],
  );

  const remove = useCallback(
    (recovery: RecoveryTurn) => {
      const memberName = formatMemberFullName(recovery.member);

      confirm({
        intent: "danger",
        title: "Quitar la recuperación",
        description: `Se quitará la recuperación de ${memberName} para este horario.`,
        confirmLabel: "Quitar",
        onConfirm: () =>
          deleteRecoveryTurn.mutate({ recoveryId: recovery.id, memberName }),
      });
    },
    [deleteRecoveryTurn],
  );

  return useMemo(() => ({ mark, remove }), [mark, remove]);
}
