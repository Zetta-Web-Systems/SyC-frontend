import { useId } from "react";
import type {
  AttendanceErrorState,
  AttendanceKeypadState,
} from "../../../types";
import { AttendanceDniDisplay } from "./AttendanceDniDisplay";
import { AttendanceInlineError } from "./AttendanceInlineError";
import { AttendanceNumericKeypad } from "./AttendanceNumericKeypad";

interface AttendanceIdleScreenProps {
  dni: string;
  keypad: AttendanceKeypadState;
  error: AttendanceErrorState;
  onAddDigit: (digit: string) => void;
  onRemoveDigit: () => void;
  onDniChange: (dni: string) => void;
  onSubmit: () => void;
}

export function AttendanceIdleScreen({
  dni,
  keypad,
  error,
  onAddDigit,
  onRemoveDigit,
  onDniChange,
  onSubmit,
}: AttendanceIdleScreenProps) {
  const errorId = useId();

  return (
    <div className="flex min-h-0 flex-1 items-center justify-center px-10 pb-6">
      <div className="flex w-full max-w-150 flex-col items-center gap-4 landscape:max-w-140 landscape:gap-3">
        <AttendanceDniDisplay
          dni={dni}
          isValid={keypad.isValid}
          isError={error.visible}
          disabled={keypad.disabled}
          errorId={errorId}
          onChange={onDniChange}
          onSubmit={onSubmit}
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

        <div id={errorId} className="w-full">
          <AttendanceInlineError
            error={error.message}
            visible={error.visible}
          />
        </div>
      </div>
    </div>
  );
}

AttendanceIdleScreen.displayName = "AttendanceIdleScreen";
