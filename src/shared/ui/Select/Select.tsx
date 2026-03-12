import type { Ref } from "react";
import type { SelectHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { selectVariants } from "./Select.variants";

export interface SelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  ref?: Ref<HTMLSelectElement>;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
}

export function Select({
  ref,
  error,
  errorMessage,
  placeholder,
  className,
  id,
  size,
  disabled,
  children,
  ...props
}: SelectProps) {
  const errorId = errorMessage ? `${id}-error` : undefined;
  const hasError = error ?? !!errorMessage;

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={cn(
            selectVariants({ size, isError: hasError, isDisabled: disabled }),
            className,
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId}
          data-invalid={hasError ? "true" : undefined}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {children}
        </select>

        <div className="pointer-events-none absolute right-3 flex items-center text-neutral-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 256 256"
            fill="currentColor"
            aria-hidden="true"
          >
            <path d="M213.66,101.66l-80,80a8,8,0,0,1-11.32,0l-80-80A8,8,0,0,1,53.66,90.34L128,164.69l74.34-74.35a8,8,0,0,1,11.32,11.32Z" />
          </svg>
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

Select.displayName = "Select";
