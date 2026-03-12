import type { Ref } from "react";
import type { ButtonHTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { buttonVariants } from "./Button.variants";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  ref?: Ref<HTMLButtonElement>;
}

export function Button({
  ref,
  className,
  variant,
  intent,
  size,
  isLoading,
  children,
  disabled,
  ...props
}: ButtonProps) {
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
}

Button.displayName = "Button";
