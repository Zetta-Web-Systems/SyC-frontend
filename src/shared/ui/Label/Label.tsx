import { forwardRef } from "react";
import type { LabelHTMLAttributes } from "react";

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

export const Label = forwardRef<HTMLLabelElement, LabelProps>(
  ({ children, required, className, ...props }, ref) => {
    return (
      <label ref={ref} className={className} {...props}>
        <span>{children}</span>

        {required && <span aria-hidden="true">*</span>}
      </label>
    );
  },
);

Label.displayName = "Label";
