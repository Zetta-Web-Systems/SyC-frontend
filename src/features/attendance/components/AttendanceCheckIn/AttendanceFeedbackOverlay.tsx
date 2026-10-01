import { cn } from "@shared/lib/cn";
import { AttendanceEntryFeedback } from "./AttendanceFeedback/AttendanceEntryFeedback";
import { AttendanceExitFeedback } from "./AttendanceFeedback/AttendanceExitFeedback";
import { AttendanceProgressBar } from "./AttendanceFeedback/AttendanceProgressBar";
import {
  ATTENDANCE_ACTION,
  type AttendanceAction,
  type RequestStatus,
} from "../../constants";
import type { AttendanceCheckIn } from "../../types";
import { RESET_TIMINGS } from "../../constants";

interface AttendanceFeedbackOverlayProps {
  status: AttendanceAction | RequestStatus;
  response: AttendanceCheckIn | null;
  moodMessage?: string | null;
  feeMessage?: string | null;
  profileImageUrl?: string | null;
}

const BACKGROUND_MAP: Partial<
  Record<AttendanceAction | RequestStatus, string>
> = {
  [ATTENDANCE_ACTION.ENTRY]: "bg-success",
  [ATTENDANCE_ACTION.EXIT]: "bg-info",
};

export function AttendanceFeedbackOverlay({
  status,
  response,
  moodMessage,
  feeMessage,
  profileImageUrl,
}: AttendanceFeedbackOverlayProps) {
  const bg = BACKGROUND_MAP[status] ?? "bg-primary-900";
  const duration =
    status === ATTENDANCE_ACTION.ENTRY || status === ATTENDANCE_ACTION.EXIT
      ? RESET_TIMINGS[status]
      : RESET_TIMINGS.entry;

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex flex-col items-center justify-center px-6 animate-[attendance-feedback-in_300ms_ease-out_both]",
        bg,
      )}
    >
      {status === ATTENDANCE_ACTION.ENTRY && response && (
        <AttendanceEntryFeedback
          response={response}
          subtitle={moodMessage ?? undefined}
          feeMessage={feeMessage}
          profileImageUrl={profileImageUrl}
        />
      )}

      {status === ATTENDANCE_ACTION.EXIT && response && (
        <AttendanceExitFeedback response={response} />
      )}

      <AttendanceProgressBar duration={duration} />
    </div>
  );
}

AttendanceFeedbackOverlay.displayName = "AttendanceFeedbackOverlay";
