import { cn } from "@shared/lib/cn";
import { DNI_MAX_LENGTH } from "../../constants";

interface AttendanceDniDisplayProps {
  dni: string;
  isValid: boolean;
}

export function AttendanceDniDisplay({
  dni,
  isValid,
}: AttendanceDniDisplayProps) {
  const boxes = Array.from({ length: DNI_MAX_LENGTH }, (_, i) => {
    const digit = dni[i] ?? null;
    const isFilled = digit !== null;
    const isActive = !isFilled && i === dni.length;

    return (
      <div
        key={i}
        className={cn(
          "flex h-16 w-14 items-center justify-center rounded-xl border-2 transition-all duration-150 md:h-20 md:w-18",
          isFilled &&
            "border-primary-500 bg-white shadow-sm animate-[attendance-digit-pop_150ms_ease-out_both]",
          isActive && "border-primary-500 bg-primary-50",
          !isFilled && !isActive && "border-primary-300 bg-white",
        )}
      >
        {isFilled ? (
          <span className="text-3xl font-bold text-primary-800 md:text-4xl">
            {digit}
          </span>
        ) : isActive ? (
          <span className="inline-block h-2 w-2 rounded-full bg-primary-500 animate-[attendance-pulse-cursor_1s_ease-in-out_infinite] md:h-2.5 md:w-2.5" />
        ) : (
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-primary-300 md:h-2 md:w-2" />
        )}
      </div>
    );
  });

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-2.5 md:gap-3">{boxes}</div>

      <div
        className={cn(
          "h-1 w-40 rounded-full transition-all duration-300 md:w-52",
          isValid ? "bg-secondary-400" : "bg-transparent",
        )}
      />
    </div>
  );
}

AttendanceDniDisplay.displayName = "AttendanceDniDisplay";
