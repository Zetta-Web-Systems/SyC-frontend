import { Delete, ArrowRight } from "lucide-react";
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

const DIGIT_ROWS = [
  ["1", "2", "3"],
  ["4", "5", "6"],
  ["7", "8", "9"],
];

const BUTTON_BASE =
  "flex min-h-18 min-w-18 items-center justify-center rounded-2xl shadow-sm transition-all duration-75 select-none md:min-h-22 md:min-w-22 lg:min-h-18 lg:min-w-18";

export function AttendanceNumericKeypad({
  onDigit,
  onBackspace,
  onSubmit,
  isValid,
  canAddDigit,
  isEmpty,
  disabled,
}: AttendanceNumericKeypadProps) {
  return (
    <div className="flex flex-col gap-3 md:gap-4 lg:gap-3">
      {DIGIT_ROWS.map((row) => (
        <div key={row.join("")} className="flex justify-center gap-3 md:gap-4 lg:gap-3">
          {row.map((digit) => (
            <Button
              variant="ghost"
              intent="neutral"
              key={digit}
              disabled={disabled || !canAddDigit}
              onClick={() => onDigit(digit)}
              className={cn(
                BUTTON_BASE,
                "border border-primary-500 bg-white text-2xl font-semibold text-primary-800 md:text-3xl",
                "active:scale-[0.94] active:bg-primary-500 active:text-white active:shadow-none",
                (disabled || !canAddDigit) && "pointer-events-none opacity-40",
              )}
            >
              {digit}
            </Button>
          ))}
        </div>
      ))}

      <div className="flex justify-center gap-3 md:gap-4 lg:gap-3">
        <Button
          variant="ghost"
          intent="danger"
          disabled={disabled || isEmpty}
          onClick={onBackspace}
          className={cn(
            BUTTON_BASE,
            "border border-white bg-error/90 text-white",
            "active:scale-[0.94] active:bg-error active:shadow-none",
            (disabled || isEmpty) && "pointer-events-none opacity-30",
          )}
          aria-label="Borrar último dígito"
        >
          <Delete className="h-7 w-7 md:h-8 md:w-8" />
        </Button>

        <Button
          variant="ghost"
          intent="neutral"
          disabled={disabled || !canAddDigit}
          onClick={() => onDigit("0")}
          className={cn(
            BUTTON_BASE,
            "border border-primary-500 bg-white text-2xl font-semibold text-primary-800 md:text-3xl",
            "active:scale-[0.94] active:bg-primary-500 active:text-white active:shadow-none",
            (disabled || !canAddDigit) && "pointer-events-none opacity-40",
          )}
        >
          0
        </Button>

        <Button
          variant="solid"
          intent="secondary"
          disabled={disabled || !isValid}
          onClick={onSubmit}
          className={cn(
            BUTTON_BASE,
            "transition-all duration-300",
            isValid && !disabled
              ? "bg-secondary-500 text-white active:scale-[0.94] active:brightness-90"
              : "pointer-events-none bg-secondary-200 text-white",
          )}
          aria-label="Registrar asistencia"
        >
          <ArrowRight className="h-7 w-7 md:h-8 md:w-8" />
        </Button>
      </div>
    </div>
  );
}

AttendanceNumericKeypad.displayName = "AttendanceNumericKeypad";
