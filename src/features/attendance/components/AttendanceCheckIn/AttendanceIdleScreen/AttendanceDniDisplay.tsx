import type { ChangeEvent, KeyboardEvent } from "react";
import { cn } from "@shared/lib/cn";
import { DNI_MAX_LENGTH } from "../../../constants";

interface AttendanceDniDisplayProps {
  dni: string;
  isValid: boolean;
  isError: boolean;
  disabled: boolean;
  errorId: string;
  onChange: (dni: string) => void;
  onSubmit: () => void;
}

export function AttendanceDniDisplay({
  dni,
  isValid,
  isError,
  disabled,
  errorId,
  onChange,
  onSubmit,
}: AttendanceDniDisplayProps) {
  const slots = Array.from({ length: DNI_MAX_LENGTH }, (_, i) => ({
    position: i,
    digit: (dni[i] as string | undefined) ?? null,
  }));

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="relative mb-3 w-full rounded-2xl transition-shadow focus-within:ring-4 focus-within:ring-primary-200 focus-within:ring-offset-8">
      <div
        className={cn(
          "flex w-full gap-3 landscape:gap-2.5",
          isError && "animate-[attendance-shake_500ms_ease-in-out]",
        )}
      >
        {slots.map((slot) => {
          const isFilled = slot.digit !== null;
          const isActive = !isFilled && slot.position === dni.length;

          return (
            <div
              key={slot.position}
              className={cn(
                "flex h-31 min-w-0 flex-1 items-center justify-center rounded-2xl border-2 transition-all duration-150 landscape:h-25",
                isError && "border-error bg-white",
                !isError &&
                  isFilled &&
                  "bg-white shadow-sm animate-[attendance-digit-pop_150ms_ease-out_both]",
                !isError &&
                  isFilled &&
                  (isValid ? "border-secondary-500" : "border-primary-500"),
                !isError && isActive && "border-primary-500 bg-primary-50",
                !isError &&
                  !isFilled &&
                  !isActive &&
                  "border-primary-300 bg-white",
              )}
            >
              {isFilled ? (
                <span className="text-[52px] font-bold text-primary-800 landscape:text-[46px]">
                  {slot.digit}
                </span>
              ) : isActive && !isError ? (
                <span className="inline-block size-2.5 rounded-full bg-primary-500 animate-[attendance-pulse-cursor_1s_ease-in-out_infinite]" />
              ) : (
                <span
                  className={cn(
                    "inline-block size-2 rounded-full",
                    isError ? "bg-error/40" : "bg-primary-300",
                  )}
                />
              )}
            </div>
          );
        })}
      </div>

      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        autoComplete="off"
        enterKeyHint="go"
        maxLength={DNI_MAX_LENGTH}
        aria-label="DNI"
        aria-invalid={isError || undefined}
        aria-describedby={isError ? errorId : undefined}
        data-invalid={isError ? "true" : undefined}
        value={dni}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className="absolute inset-0 h-full w-full cursor-pointer text-base opacity-0"
      />
    </div>
  );
}

AttendanceDniDisplay.displayName = "AttendanceDniDisplay";
