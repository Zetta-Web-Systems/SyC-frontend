import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "../../lib/cn";
import { buttonVariants } from "./Button.variants";

export interface ButtonProps
  extends
    ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      intent,
      size,
      isLoading,
      children,
      disabled,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={props.type ?? "button"}
        disabled={isLoading || disabled}
        className={cn(
          buttonVariants({
            variant,
            intent,
            size,
            isLoading,
            isDisabled: disabled,
            className,
          }),
        )}
        {...props}
      >
        {isLoading ? "Cargando..." : children}
      </button>
    );
  },
);

Button.displayName = "Button";
