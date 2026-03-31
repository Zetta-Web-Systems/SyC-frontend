import { Spinner } from "@shared/ui";
import { ATTENDANCE_STATUS } from "./types";
import { useAttendanceFlow } from "./hooks/useAttendanceFlow";
import { AttendanceIdleScreen } from "./components/AttendanceIdleScreen";
import { AttendanceFeedbackOverlay } from "./components/AttendanceFeedbackOverlay";
import { AttendanceAdminAccess } from "./components/AttendanceAdminAccess";

export default function AttendancePage() {
  const flow = useAttendanceFlow();

  const isIdle = flow.status === ATTENDANCE_STATUS.IDLE;
  const isError = flow.status === ATTENDANCE_STATUS.ERROR;
  const isLoading = flow.status === ATTENDANCE_STATUS.LOADING;
  const isSuccessFeedback =
    flow.status === ATTENDANCE_STATUS.ENTRY ||
    flow.status === ATTENDANCE_STATUS.EXIT;

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-white select-none">
      <AttendanceIdleScreen
        dni={flow.dni}
        isValid={flow.isValid}
        canAddDigit={flow.canAddDigit}
        isEmpty={flow.isEmpty}
        disabled={!isIdle && !isError}
        error={flow.error}
        isError={isError}
        onAddDigit={flow.addDigit}
        onRemoveDigit={flow.removeDigit}
        onSubmit={flow.submit}
      />

      {isLoading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-900/40 animate-[attendance-feedback-in_200ms_ease-out]">
          <Spinner size="lg" label="Registrando..." />
        </div>
      )}

      {isSuccessFeedback && (
        <AttendanceFeedbackOverlay
          status={flow.status}
          response={flow.response}
        />
      )}

      <AttendanceAdminAccess visible={isIdle} />
    </div>
  );
}
