import { cn } from "@shared/lib/cn";
import { DNI_MAX_LENGTH } from "../../constants";

interface AttendanceDniDisplayProps {
  dni: string;
  isValid: boolean;
  isError: boolean;
}

export function AttendanceDniDisplay({
  dni,
  isValid,
  isError,
}: AttendanceDniDisplayProps) {
  const boxes = Array.from({ length: DNI_MAX_LENGTH }, (_, i) => {
    const digit = dni[i] ?? null;
    const isFilled = digit !== null;
    const isActive = !isFilled && i === dni.length;

    return (
      <div
        key={i}
        className={cn(
          "flex h-16 w-14 items-center justify-center rounded-xl border-2 transition-all duration-150 md:h-20 md:w-18 lg:h-16 lg:w-12",
          isError && "border-error bg-white",
          !isError &&
            isFilled &&
            "border-primary-500 bg-white shadow-sm animate-[attendance-digit-pop_150ms_ease-out_both]",
          !isError && isActive && "border-primary-500 bg-primary-50",
          !isError && !isFilled && !isActive && "border-primary-300 bg-white",
        )}
      >
        {isFilled ? (
          <span className="text-3xl font-bold text-primary-800 md:text-4xl lg:text-3xl">
            {digit}
          </span>
        ) : isActive && !isError ? (
          <span className="inline-block h-2 w-2 rounded-full bg-primary-500 animate-[attendance-pulse-cursor_1s_ease-in-out_infinite] md:h-2.5 md:w-2.5 lg:h-2 lg:w-2" />
        ) : (
          <span
            className={cn(
              "inline-block h-1.5 w-1.5 rounded-full md:h-2 md:w-2 lg:h-1.5 lg:w-1.5",
              isError ? "bg-error/40" : "bg-primary-300",
            )}
          />
        )}
      </div>
    );
  });

  return (
    <div className="flex max-w-full flex-col items-center gap-3 overflow-hidden">
      <div
        className={cn(
          "flex gap-2.5 md:gap-3 lg:gap-2",
          isError && "animate-[attendance-shake_500ms_ease-in-out]",
        )}
      >
        {boxes}
      </div>

      <div
        className={cn(
          "h-1 w-40 rounded-full transition-all duration-300 md:w-52 lg:w-40",
          isValid ? "bg-secondary-400" : "bg-transparent",
        )}
      />
    </div>
  );
}

AttendanceDniDisplay.displayName = "AttendanceDniDisplay";
