import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { iconBoxVariants } from "./IconBox.variants";

export interface IconBoxProps
  extends
    Omit<HTMLAttributes<HTMLSpanElement>, "color">,
    VariantProps<typeof iconBoxVariants> {
  ref?: Ref<HTMLSpanElement>;
  children: ReactNode;
}

export function IconBox({
  ref,
  size,
  shape,
  tone,
  intent,
  className,
  children,
  ...props
}: IconBoxProps) {
  return (
    <span
      ref={ref}
      aria-hidden={props["aria-label"] ? undefined : "true"}
      className={cn(iconBoxVariants({ size, shape, tone, intent }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

IconBox.displayName = "IconBox";
