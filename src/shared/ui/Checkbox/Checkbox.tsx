import type { Ref } from "react";
import type { InputHTMLAttributes } from "react";
import { cn } from "@shared/lib/cn";

export interface CheckboxProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type"
> {
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
  errorMessage?: string;
}

export function Checkbox({
  ref,
  error,
  errorMessage,
  className,
  id,
  disabled,
  ...props
}: CheckboxProps) {
  const errorId = errorMessage ? `${id}-error` : undefined;
  const hasError = error ?? !!errorMessage;

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center gap-2">
        <div className="relative flex items-center">
          <input
            ref={ref}
            type="checkbox"
            id={id}
            disabled={disabled}
            className={cn(
              "peer absolute inset-0 h-full w-full cursor-pointer opacity-0",
              disabled && "cursor-not-allowed",
              className,
            )}
            aria-invalid={hasError || undefined}
            aria-describedby={errorId}
            data-invalid={hasError ? "true" : undefined}
            {...props}
          />

          <div
            className={cn(
              "flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded border-2 transition-all",
              "border-neutral-300 bg-white",
              "peer-checked:border-primary-500 peer-checked:bg-primary-500",
              "peer-focus-visible:ring-2 peer-focus-visible:ring-primary-500 peer-focus-visible:ring-offset-2",
              "peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
              hasError &&
                "border-error peer-checked:border-error peer-checked:bg-error",
            )}
          >
            <svg
              className="hidden h-2.5 w-2.5 text-white peer-checked:block [.peer:checked~*_&]:block"
              viewBox="0 0 12 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                d="M1 5L4.5 8.5L11 1.5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
      </div>

      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

Checkbox.displayName = "Checkbox";
