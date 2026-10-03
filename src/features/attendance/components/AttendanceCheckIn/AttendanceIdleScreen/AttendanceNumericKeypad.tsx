import { ArrowRight, Delete } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Button } from "@shared/ui";

interface AttendanceNumericKeypadProps {
  onDigit: (digit: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  isValid: boolean;
  canAddDigit: boolean;
  isEmpty: boolean;
  disabled: boolean;
}

const DIGITS = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

const KEY_BASE =
  "h-full min-h-0 w-full rounded-2xl shadow-sm transition-all duration-75 select-none active:scale-97";

const DIGIT_CLASS =
  "border-2 border-primary-500 bg-white text-[52px] font-semibold text-primary-800 active:bg-primary-500 active:text-white active:shadow-none landscape:text-[46px]";

export function AttendanceNumericKeypad({
  onDigit,
  onBackspace,
  onSubmit,
  isValid,
  canAddDigit,
  isEmpty,
  disabled,
}: AttendanceNumericKeypadProps) {
  const digitKey = (digit: string) => (
    <Button
      key={digit}
      variant="ghost"
      intent="neutral"
      disabled={disabled || !canAddDigit}
      onClick={() => onDigit(digit)}
      className={cn(
        KEY_BASE,
        DIGIT_CLASS,
        (disabled || !canAddDigit) && "pointer-events-none opacity-40",
      )}
    >
      {digit}
    </Button>
  );

  return (
    <div className="grid w-full auto-rows-[124px] grid-cols-3 gap-4 landscape:auto-rows-[100px] landscape:gap-3">
      {DIGITS.map(digitKey)}

      <Button
        variant="ghost"
        intent="danger"
        disabled={disabled || isEmpty}
        onClick={onBackspace}
        className={cn(
          KEY_BASE,
          "border-2 border-white bg-error/90 text-white active:bg-error active:shadow-none",
          (disabled || isEmpty) && "pointer-events-none opacity-30",
        )}
        aria-label="Borrar último dígito"
      >
        <Delete className="size-12" aria-hidden="true" />
      </Button>

      {digitKey("0")}

      <Button
        variant="solid"
        intent="secondary"
        disabled={disabled || !isValid}
        onClick={onSubmit}
        className={cn(
          KEY_BASE,
          "transition-all duration-300",
          isValid && !disabled
            ? "bg-secondary-500 text-white active:brightness-90"
            : "pointer-events-none bg-secondary-200 text-white",
        )}
        aria-label="Registrar asistencia"
      >
        <ArrowRight className="size-12" aria-hidden="true" />
      </Button>
    </div>
  );
}

AttendanceNumericKeypad.displayName = "AttendanceNumericKeypad";
