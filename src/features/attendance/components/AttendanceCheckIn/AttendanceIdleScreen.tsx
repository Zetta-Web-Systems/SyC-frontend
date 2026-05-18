import { AttendanceDniDisplay } from "./AttendanceDisplay/AttendanceDniDisplay";
import { AttendanceNumericKeypad } from "./AttendanceDisplay/AttendanceNumericKeypad";
import { AttendanceInlineError } from "./AttendanceFeedback/AttendanceInlineError";

export interface AttendanceKeypadState {
  isValid: boolean;
  canAddDigit: boolean;
  isEmpty: boolean;
  disabled: boolean;
}

export interface AttendanceErrorState {
  message: string | null;
  visible: boolean;
}

interface AttendanceIdleScreenProps {
  dni: string;
  keypad: AttendanceKeypadState;
  error: AttendanceErrorState;
  onAddDigit: (digit: string) => void;
  onRemoveDigit: () => void;
  onSubmit: () => void;
}

export function AttendanceIdleScreen({
  dni,
  keypad,
  error,
  onAddDigit,
  onRemoveDigit,
  onSubmit,
}: AttendanceIdleScreenProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-8 px-6 md:gap-12 lg:gap-8">
      <img
        src="/images/attendance/attendance-image.png"
        alt="Sano y Controlado"
        className="h-20 w-auto object-contain md:h-30 lg:h-24"
      />

      <AttendanceDniDisplay
        dni={dni}
        isValid={keypad.isValid}
        isError={error.visible}
      />

      <AttendanceNumericKeypad
        onDigit={onAddDigit}
        onBackspace={onRemoveDigit}
        onSubmit={onSubmit}
        isValid={keypad.isValid}
        canAddDigit={keypad.canAddDigit}
        isEmpty={keypad.isEmpty}
        disabled={keypad.disabled}
      />

      <AttendanceInlineError error={error.message} visible={error.visible} />
    </div>
  );
}

AttendanceIdleScreen.displayName = "AttendanceIdleScreen";
