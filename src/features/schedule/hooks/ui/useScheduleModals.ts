import { useCallback, useMemo, useState } from "react";
import type { RecoveryTurnMode, TimeSlot } from "../../types";

export type ScheduleModal =
  | { kind: "createSlot" }
  | { kind: "editSlot"; slot: TimeSlot }
  | { kind: "closeDay"; date?: string }
  | { kind: "blockSlot"; slot: TimeSlot; date: string }
  | { kind: "recoveryTurn"; mode: RecoveryTurnMode };

export interface ScheduleModalsState {
  modal: ScheduleModal | null;
  openCreateSlot: () => void;
  openEditSlot: (slot: TimeSlot) => void;
  openCloseDay: (date?: string) => void;
  openBlockSlot: (slot: TimeSlot, date: string) => void;
  openRecoveryTurn: (mode: RecoveryTurnMode) => void;
  close: () => void;
}

export function useScheduleModals(): ScheduleModalsState {
  const [modal, setModal] = useState<ScheduleModal | null>(null);

  const openCreateSlot = useCallback(() => {
    setModal({ kind: "createSlot" });
  }, []);

  const openEditSlot = useCallback((slot: TimeSlot) => {
    setModal({ kind: "editSlot", slot });
  }, []);

  const openCloseDay = useCallback((date?: string) => {
    setModal({ kind: "closeDay", date });
  }, []);

  const openBlockSlot = useCallback((slot: TimeSlot, date: string) => {
    setModal({ kind: "blockSlot", slot, date });
  }, []);

  const openRecoveryTurn = useCallback((mode: RecoveryTurnMode) => {
    setModal({ kind: "recoveryTurn", mode });
  }, []);

  const close = useCallback(() => setModal(null), []);

  return useMemo(
    () => ({
      modal,
      openCreateSlot,
      openEditSlot,
      openCloseDay,
      openBlockSlot,
      openRecoveryTurn,
      close,
    }),
    [
      modal,
      openCreateSlot,
      openEditSlot,
      openCloseDay,
      openBlockSlot,
      openRecoveryTurn,
      close,
    ],
  );
}
