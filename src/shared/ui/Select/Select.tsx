import type { Ref } from "react";
import type { SelectHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { ChevronDown } from "lucide-react";
import { cn } from "@shared/lib/cn";
import type { Side } from "@shared/types/floating.types";
import { selectVariants } from "./Select.variants";

type HorizontalSide = Extract<Side, "left" | "right">;

export interface SelectProps
  extends
    Omit<SelectHTMLAttributes<HTMLSelectElement>, "size">,
    VariantProps<typeof selectVariants> {
  ref?: Ref<HTMLSelectElement>;
  error?: boolean;
  errorMessage?: string;
  placeholder?: string;
  iconPosition?: HorizontalSide;
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
  iconPosition = "right",
  ...props
}: SelectProps) {
  const errorId = errorMessage ? `${id}-error` : undefined;
  const hasError = error ?? !!errorMessage;
  const isLeft = iconPosition === "left";

  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="relative flex items-center">
        <select
          ref={ref}
          id={id}
          disabled={disabled}
          className={cn(
            selectVariants({
              size,
              iconPosition,
              isError: hasError,
              isDisabled: disabled,
            }),
            className,
          )}
          aria-invalid={hasError || undefined}
          aria-describedby={errorId}
          data-invalid={hasError ? "true" : undefined}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {children}
        </select>

        <div
          className={cn(
            "pointer-events-none absolute flex items-center text-neutral-400",
            isLeft ? "left-3" : "right-3",
          )}
        >
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
