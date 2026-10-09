import {
  Check,
  CheckCheck,
  Clock3,
  Dumbbell,
  LayoutGrid,
  Play,
  X,
  type LucideIcon,
} from "lucide-react";
import type { AttendanceState, ExecutionStatus, SessionView } from "./index";

export const ATTENDANCE_STATE_ICON: Record<AttendanceState, LucideIcon> = {
  present: Check,
  pending: Clock3,
  absent: X,
};

export const SESSION_VIEW_ICON: Record<SessionView, LucideIcon> = {
  board: LayoutGrid,
  room: Dumbbell,
};

export const EXECUTION_STATUS_ICON: Record<ExecutionStatus, LucideIcon> = {
  pending: Play,
  done: CheckCheck,
  skipped: X,
};
