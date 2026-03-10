import { forwardRef } from "react";
import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
  errorMessage?: string;
  leftElement?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { error, errorMessage, leftElement, rightElement, className, id, ...props },
    ref,
  ) => {
    const errorId = errorMessage ? `${id}-error` : undefined;

    return (
      <div>
        {leftElement}

        <input
          ref={ref}
          id={id}
          className={className}
          aria-invalid={error || undefined}
          aria-describedby={errorId}
          data-invalid={error ? "true" : undefined}
          {...props}
        />

        {rightElement}

        {errorMessage && (
          <p id={errorId} role="alert">
            {errorMessage}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = "Input";
