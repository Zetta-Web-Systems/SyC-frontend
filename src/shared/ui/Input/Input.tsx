import type { Ref, ReactNode } from "react";
import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { inputVariants } from "./Input.variants";

export interface InputProps
  extends
    Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof inputVariants> {
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
  errorMessage?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
}

export function Input({
  ref,
  error,
  errorMessage,
  leftElement,
  rightElement,
  className,
  id,
  size,
  disabled,
  ...props
}: InputProps) {
  const errorId = errorMessage ? `${id}-error` : undefined;
  const hasError = error ?? !!errorMessage;

  return (
    <div className="flex flex-col relative w-full gap-1.5">
      {leftElement || rightElement ? (
        <div className="flex items-center group relative">
          {leftElement && (
            <div
              className={cn(
                "flex items-center pointer-events-none absolute left-3 transition-all",
                hasError
                  ? "text-error"
                  : "text-primary-500 group-focus-within:text-primary-500 group-focus-within:drop-shadow-sm",
              )}
            >
              {leftElement}
            </div>
          )}

          <input
            ref={ref}
            id={id}
            disabled={disabled}
            className={cn(
              inputVariants({ size, isError: hasError, isDisabled: disabled }),
              leftElement && "pl-9",
              rightElement && "pr-9",
              className,
            )}
            aria-describedby={errorId}
            data-invalid={hasError ? "true" : undefined}
            {...props}
          />

          {rightElement && (
            <div
              className={cn(
                "flex items-center absolute right-3 transition-all",
                hasError
                  ? "text-error"
                  : "text-primary-500 group-focus-within:text-primary-500 group-focus-within:drop-shadow-sm",
              )}
            >
              {rightElement}
            </div>
          )}
        </div>
      ) : (
        <input
          ref={ref}
          id={id}
          disabled={disabled}
          className={cn(
            inputVariants({ size, isError: hasError, isDisabled: disabled }),
            className,
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId}
          data-invalid={hasError ? "true" : undefined}
          {...props}
        />
      )}

      {errorMessage && (
        <p id={errorId} role="alert" className="text-xs text-error">
          {errorMessage}
        </p>
      )}
    </div>
  );
}

Input.displayName = "Input";
