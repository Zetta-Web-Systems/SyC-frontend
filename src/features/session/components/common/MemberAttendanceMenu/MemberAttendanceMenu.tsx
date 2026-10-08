import { useState } from "react";
import { EllipsisVertical, UserCheck, UserX } from "lucide-react";
import { IconButton, Popover, PopoverHeader, PopoverItem } from "@shared/ui";
import { ATTENDANCE_STATE, type AttendanceState } from "../../../constants";

interface MemberAttendanceMenuProps {
  fullName: string;
  attendanceState: AttendanceState;
  onMarkPresent: () => void;
  onMarkAbsent: () => void;
}

export function MemberAttendanceMenu({
  fullName,
  attendanceState,
  onMarkPresent,
  onMarkAbsent,
}: MemberAttendanceMenuProps) {
  const [open, setOpen] = useState(false);

  function run(action: () => void) {
    setOpen(false);
    action();
  }

  return (
    <Popover
      open={open}
      onClose={() => setOpen(false)}
      side="bottom"
      align="end"
      className="w-72"
      trigger={
        <IconButton
          size="md"
          aria-label={`Acciones para ${fullName}`}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="size-11"
        >
          <EllipsisVertical size={18} aria-hidden="true" />
        </IconButton>
      }
    >
      <PopoverHeader title="Asistencia" />

      {attendanceState !== ATTENDANCE_STATE.PRESENT && (
        <PopoverItem
          icon={<UserCheck />}
          iconTone="success"
          description="Sin pasar por el registro de asistencia"
          onClick={() => run(onMarkPresent)}
          className="min-h-11"
        >
          Marcar presente
        </PopoverItem>
      )}

      {attendanceState !== ATTENDANCE_STATE.ABSENT && (
        <PopoverItem
          icon={<UserX />}
          iconTone="danger"
          description="Con un motivo opcional"
          onClick={() => run(onMarkAbsent)}
          className="min-h-11"
        >
          Marcar ausente
        </PopoverItem>
      )}
    </Popover>
  );
}

MemberAttendanceMenu.displayName = "MemberAttendanceMenu";
