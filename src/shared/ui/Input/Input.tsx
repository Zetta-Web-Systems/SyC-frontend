import type { Ref, ReactNode } from "react";
import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { inputVariants } from "./Input.variants";

export interface InputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "size">,
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
    <div className="relative flex w-full flex-col gap-1.5">
      {(leftElement || rightElement) ? (
        <div className="relative flex items-center">
          {leftElement && (
            <div className="pointer-events-none absolute left-3 flex items-center text-neutral-400">
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
            aria-invalid={hasError || undefined}
            aria-describedby={errorId}
            data-invalid={hasError ? "true" : undefined}
            {...props}
          />

          {rightElement && (
            <div className="pointer-events-none absolute right-3 flex items-center text-neutral-400">
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
