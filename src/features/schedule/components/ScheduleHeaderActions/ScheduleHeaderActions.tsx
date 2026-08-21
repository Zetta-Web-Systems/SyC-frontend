import { CalendarOff, Plus } from "lucide-react";
import { Button } from "@shared/ui";

interface ScheduleHeaderActionsProps {
  onCloseDay: () => void;
  onCreateTimeSlot: () => void;
}

export function ScheduleHeaderActions({
  onCloseDay,
  onCreateTimeSlot,
}: ScheduleHeaderActionsProps) {
  return (
    <>
      <Button
        variant="outline"
        intent="neutral"
        onClick={onCloseDay}
        aria-label="Cerrar día"
        className="max-sm:w-10 max-sm:px-0"
      >
        <CalendarOff size={15} aria-hidden="true" />
        <span className="max-sm:hidden">Cerrar día</span>
      </Button>

      <Button
        intent="primary"
        onClick={onCreateTimeSlot}
        aria-label="Crear horario"
        className="max-sm:w-10 max-sm:px-0"
      >
        <Plus size={15} aria-hidden="true" />
        <span className="max-sm:hidden">Crear horario</span>
      </Button>
    </>
  );
}

ScheduleHeaderActions.displayName = "ScheduleHeaderActions";
