import type { ButtonHTMLAttributes, ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { iconButtonVariants } from "./IconButton.variants";

export interface IconButtonProps
  extends
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "aria-label">,
    VariantProps<typeof iconButtonVariants> {
  ref?: Ref<HTMLButtonElement>;
  "aria-label": string;
  children: ReactNode;
}

export function IconButton({
  ref,
  size,
  variant,
  intent,
  className,
  type,
  children,
  ...props
}: IconButtonProps) {
  return (
    <button
      ref={ref}
      type={type ?? "button"}
      className={cn(iconButtonVariants({ size, variant, intent }), className)}
      {...props}
    >
      {children}
    </button>
  );
}

IconButton.displayName = "IconButton";
