import { cn } from "@shared/lib/cn";
import { ATTENDANCE_STATUS } from "../types";
import type { AttendanceResponse, AttendanceStatus } from "../types";
import { RESET_TIMINGS } from "../constants";
import { AttendanceEntryFeedback } from "./AttendanceFeedback/AttendanceEntryFeedback";
import { AttendanceExitFeedback } from "./AttendanceFeedback/AttendanceExitFeedback";
import { AttendanceProgressBar } from "./AttendanceFeedback/AttendanceProgressBar";

interface AttendanceFeedbackOverlayProps {
  status: AttendanceStatus;
  response: AttendanceResponse | null;
}

const BACKGROUND_MAP: Partial<Record<AttendanceStatus, string>> = {
  [ATTENDANCE_STATUS.ENTRY]: "bg-success",
  [ATTENDANCE_STATUS.EXIT]: "bg-info",
};

export function AttendanceFeedbackOverlay({
  status,
  response,
}: AttendanceFeedbackOverlayProps) {
  const bg = BACKGROUND_MAP[status] ?? "bg-primary-900";
  const duration =
    status === ATTENDANCE_STATUS.ENTRY || status === ATTENDANCE_STATUS.EXIT
      ? RESET_TIMINGS[status]
      : RESET_TIMINGS.entry;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center px-6 animate-[attendance-feedback-in_300ms_ease-out_both]",
        bg,
      )}
    >
      {status === ATTENDANCE_STATUS.ENTRY && response && (
        <AttendanceEntryFeedback response={response} />
      )}

      {status === ATTENDANCE_STATUS.EXIT && response && (
        <AttendanceExitFeedback response={response} />
      )}

      <AttendanceProgressBar duration={duration} />
    </div>
  );
}

AttendanceFeedbackOverlay.displayName = "AttendanceFeedbackOverlay";
