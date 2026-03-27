import { AttendanceDniDisplay } from "./AttendanceDisplay/AttendanceDniDisplay";
import { AttendanceNumericKeypad } from "./AttendanceDisplay/AttendanceNumericKeypad";
import { AttendanceInlineError } from "./AttendanceFeedback/AttendanceInlineError";

interface AttendanceIdleScreenProps {
  dni: string;
  isValid: boolean;
  canAddDigit: boolean;
  isEmpty: boolean;
  disabled: boolean;
  error: string | null;
  isError: boolean;
  onAddDigit: (digit: string) => void;
  onRemoveDigit: () => void;
  onSubmit: () => void;
}

export function AttendanceIdleScreen({
  dni,
  isValid,
  canAddDigit,
  isEmpty,
  disabled,
  error,
  isError,
  onAddDigit,
  onRemoveDigit,
  onSubmit,
}: AttendanceIdleScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 md:gap-12">
      <img
        src="/images/attendance/attendance-image.png"
        alt="Sano y Controlado"
        className="h-20 w-auto object-contain md:h-30"
      />

      <AttendanceDniDisplay dni={dni} isValid={isValid} />

      <AttendanceNumericKeypad
        onDigit={onAddDigit}
        onBackspace={onRemoveDigit}
        onSubmit={onSubmit}
        isValid={isValid}
        canAddDigit={canAddDigit}
        isEmpty={isEmpty}
        disabled={disabled}
      />

      <AttendanceInlineError error={error} visible={isError} />
    </div>
  );
}

AttendanceIdleScreen.displayName = "AttendanceIdleScreen";
