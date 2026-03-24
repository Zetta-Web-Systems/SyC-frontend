import type { Ref } from "react";
import type { SelectHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
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
          <ChevronDown size={16} aria-hidden="true" />
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
