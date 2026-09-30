import { Badge } from "@shared/ui";
import {
  ATTENDANCE_STATUS,
  ATTENDANCE_STATUS_INTENT,
  ATTENDANCE_STATUS_LABELS,
} from "../../constants";

interface AttendanceStatusBadgeProps {
  isAbsent: boolean;
}

export function AttendanceStatusBadge({
  isAbsent,
}: AttendanceStatusBadgeProps) {
  const status = isAbsent
    ? ATTENDANCE_STATUS.ABSENT
    : ATTENDANCE_STATUS.PRESENT;

  return (
    <Badge intent={ATTENDANCE_STATUS_INTENT[status]} size="md">
      {ATTENDANCE_STATUS_LABELS[status]}
    </Badge>
  );
}

AttendanceStatusBadge.displayName = "AttendanceStatusBadge";
