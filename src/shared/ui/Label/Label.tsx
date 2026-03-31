import type { Ref } from "react";
import type { LabelHTMLAttributes } from "react";
import { cn } from "@shared/lib/cn";

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  ref?: Ref<HTMLLabelElement>;
  required?: boolean;
}

export function Label({
  children,
  required,
  className,
  ref,
  ...props
}: LabelProps) {
  return (
    <label
      ref={ref}
      className={cn("text-sm font-medium text-neutral-700", className)}
      {...props}
    >
      <span>{children}</span>

      {required && (
        <span aria-hidden="true" className="ml-0.5 text-error">
          *
        </span>
      )}
    </label>
  );
}

Label.displayName = "Label";
