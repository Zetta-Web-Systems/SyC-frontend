import { AttendanceAdminAccess } from "../components/AttendanceCheckIn/AttendanceAdminAccess/AttendanceAdminAccess";
import { AttendanceCheckInHeader } from "../components/AttendanceCheckIn/AttendanceCheckInHeader/AttendanceCheckInHeader";
import { AttendanceIdleScreen } from "../components/AttendanceCheckIn/AttendanceIdleScreen/AttendanceIdleScreen";
import { AttendanceLoadingOverlay } from "../components/AttendanceCheckIn/AttendanceLoadingOverlay/AttendanceLoadingOverlay";
import { AttendanceMoodScreen } from "../components/AttendanceCheckIn/AttendanceMoodScreen/AttendanceMoodScreen";
import { AttendanceFeeStatus } from "../components/AttendanceCheckIn/AttendanceResult/AttendanceFeeStatus";
import { AttendanceResult } from "../components/AttendanceCheckIn/AttendanceResult/AttendanceResult";
import { AttendanceShiftSummary } from "../components/AttendanceCheckIn/AttendanceResult/AttendanceShiftSummary";
import { ATTENDANCE_ACTION, REQUEST_STATUS } from "../constants";
import { useAttendanceFlow } from "../hooks/checkIn/useAttendanceFlow";
import { useSecondsLeft } from "../hooks/checkIn/useSecondsLeft";
import { formatAttendanceTime } from "../utils";
import { getFeeStatus } from "../utils/checkIn.utils";

export default function AttendanceCheckInPage() {
  const flow = useAttendanceFlow();
  const secondsLeft = useSecondsLeft(flow.timer);

  const isIdle = flow.status === REQUEST_STATUS.IDLE;
  const isError = flow.status === REQUEST_STATUS.ERROR;
  const isMoodLoading = flow.status === REQUEST_STATUS.MOOD_LOADING;
  const isMood = flow.status === REQUEST_STATUS.MOOD_SELECTION || isMoodLoading;
  const isLoading = flow.status === REQUEST_STATUS.LOADING || isMoodLoading;
  const isStart = isIdle || isError || flow.status === REQUEST_STATUS.LOADING;

  const renderScreen = () => {
    const response = flow.response;
    if (!response) return null;

    if (isMood) {
      return (
        <AttendanceMoodScreen
          person={response}
          arrivalTime={formatAttendanceTime(response.arrivalTime)}
          secondsLeft={secondsLeft}
          disabled={isMoodLoading}
          onSelect={flow.selectMood}
        />
      );
    }

    if (flow.status === ATTENDANCE_ACTION.EXIT) {
      return (
        <AttendanceResult
          person={response}
          greeting={`¡Hasta luego, ${response.name}!`}
          status={
            <>
              <strong className="font-semibold text-neutral-900">
                Salida registrada
              </strong>{" "}
              a las {formatAttendanceTime(response.departureTime)}
            </>
          }
          timer={flow.timer}
          secondsLeft={secondsLeft}
          onDismiss={flow.dismiss}
        >
          {response.arrivalTime && response.departureTime && (
            <AttendanceShiftSummary
              arrivalTime={response.arrivalTime}
              departureTime={response.departureTime}
            />
          )}
        </AttendanceResult>
      );
    }

    const isRepeat = flow.status === ATTENDANCE_ACTION.REPEAT;
    const feeStatus = getFeeStatus(flow.fee);

    return (
      <AttendanceResult
        person={response}
        greeting={
          isRepeat
            ? `¡Hola de nuevo, ${response.name}!`
            : `¡Hola, ${response.name}!`
        }
        status={
          isRepeat && (
            <>
              <strong className="font-semibold text-neutral-900">
                Ya registraste tu llegada
              </strong>{" "}
              a las {formatAttendanceTime(response.arrivalTime)}
            </>
          )
        }
        timer={flow.timer}
        secondsLeft={secondsLeft}
        onDismiss={flow.dismiss}
      >
        {feeStatus && <AttendanceFeeStatus status={feeStatus} />}
      </AttendanceResult>
    );
  };

  return (
    <div className="relative flex h-screen w-screen flex-col overflow-hidden bg-white select-none">
      <AttendanceCheckInHeader />

      {isStart ? (
        <AttendanceIdleScreen
          dni={flow.dni}
          keypad={{
            isValid: flow.isValid,
            canAddDigit: flow.canAddDigit,
            isEmpty: flow.isEmpty,
            disabled: !isIdle && !isError,
          }}
          error={{ message: flow.error, visible: isError }}
          onAddDigit={flow.addDigit}
          onRemoveDigit={flow.removeDigit}
          onDniChange={flow.setDni}
          onSubmit={flow.submit}
        />
      ) : (
        renderScreen()
      )}

      {isLoading && <AttendanceLoadingOverlay />}

      <AttendanceAdminAccess visible={isIdle} />
    </div>
  );
}
