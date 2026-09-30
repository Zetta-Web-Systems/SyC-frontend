import type { ScheduleModalsState } from "../../hooks/ui/useScheduleModals";
import type { TimeSlot } from "../../types";
import { BlockSlotModal } from "./BlockSlotModal";
import { CloseDayModal } from "./CloseDayModal";
import { CreateTimeSlotModal } from "./CreateTimeSlotModal";
import { EditTimeSlotModal } from "./EditTimeSlotModal";
import { RecoveryTurnModal } from "./RecoveryTurnModal";

interface ScheduleModalsProps {
  state: ScheduleModalsState;
  weekSlots: TimeSlot[];
  weekDate: string;
}

export function ScheduleModals({
  state,
  weekSlots,
  weekDate,
}: ScheduleModalsProps) {
  const { modal, close } = state;

  if (!modal) return null;

  switch (modal.kind) {
    case "createSlot":
      return <CreateTimeSlotModal open onClose={close} weekSlots={weekSlots} />;

    case "editSlot":
      return (
        <EditTimeSlotModal
          open
          onClose={close}
          slot={modal.slot}
          weekSlots={weekSlots}
        />
      );

    case "closeDay":
      return <CloseDayModal open onClose={close} date={modal.date} />;

    case "blockSlot":
      return (
        <BlockSlotModal
          open
          onClose={close}
          slot={modal.slot}
          date={modal.date}
        />
      );

    case "recoveryTurn":
      return (
        <RecoveryTurnModal
          open
          onClose={close}
          mode={modal.mode}
          weekDate={weekDate}
        />
      );
  }
}

ScheduleModals.displayName = "ScheduleModals";
