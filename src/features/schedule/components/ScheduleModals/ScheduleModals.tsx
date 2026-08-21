import type { ScheduleModalsState } from "../../hooks/ui/useScheduleModals";
import { BlockSlotModal } from "./BlockSlotModal";
import { CloseDayModal } from "./CloseDayModal";
import { CreateTimeSlotModal } from "./CreateTimeSlotModal";
import { EditTimeSlotModal } from "./EditTimeSlotModal";

interface ScheduleModalsProps {
  state: ScheduleModalsState;
}

export function ScheduleModals({ state }: ScheduleModalsProps) {
  const { modal, close } = state;

  if (!modal) return null;

  switch (modal.kind) {
    case "createSlot":
      return <CreateTimeSlotModal open onClose={close} />;

    case "editSlot":
      return <EditTimeSlotModal open onClose={close} slot={modal.slot} />;

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
  }
}

ScheduleModals.displayName = "ScheduleModals";
