import type { Ref } from "react";
import type { InputHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { switchTrackVariants, switchThumbVariants } from "./Switch.variants";

type SwitchSize = NonNullable<VariantProps<typeof switchTrackVariants>["size"]>;

export interface SwitchProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "type" | "size"
> {
  ref?: Ref<HTMLInputElement>;
  error?: boolean;
  size?: SwitchSize;
}

export function Switch({
  ref,
  error,
  size = "md",
  className,
  id,
  disabled,
  checked,
  ...props
}: SwitchProps) {
  const isChecked = !!checked;

  return (
    <label
      className={cn(
        "relative inline-flex items-center",
        disabled && "cursor-not-allowed",
        className,
      )}
    >
      <input
        ref={ref}
        type="checkbox"
        role="switch"
        id={id}
        disabled={disabled}
        checked={checked}
        className="peer sr-only"
        aria-checked={isChecked}
        aria-invalid={error || undefined}
        {...props}
      />
      <span
        aria-hidden="true"
        className={switchTrackVariants({
          size,
          checked: isChecked,
          error: !!error,
        })}
      >
        <span className={switchThumbVariants({ size, checked: isChecked })} />
      </span>
    </label>
  );
}

Switch.displayName = "Switch";
