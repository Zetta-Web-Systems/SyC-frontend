import { useCallback, useMemo, useState } from "react";
import type { TimeSlot } from "../../types";

export type ScheduleModal =
  | { kind: "createSlot" }
  | { kind: "editSlot"; slot: TimeSlot }
  | { kind: "closeDay"; date?: string }
  | { kind: "blockSlot"; slot: TimeSlot; date: string };

export interface ScheduleModalsState {
  modal: ScheduleModal | null;
  openCreateSlot: () => void;
  openEditSlot: (slot: TimeSlot) => void;
  openCloseDay: (date?: string) => void;
  openBlockSlot: (slot: TimeSlot, date: string) => void;
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

  const close = useCallback(() => setModal(null), []);

  return useMemo(
    () => ({
      modal,
      openCreateSlot,
      openEditSlot,
      openCloseDay,
      openBlockSlot,
      close,
    }),
    [modal, openCreateSlot, openEditSlot, openCloseDay, openBlockSlot, close],
  );
}
