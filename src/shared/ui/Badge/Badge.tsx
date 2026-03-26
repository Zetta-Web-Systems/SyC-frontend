import type { HTMLAttributes, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { badgeVariants } from "./Badge.variants";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  ref?: Ref<HTMLSpanElement>;
}

export function Badge({
  ref,
  intent,
  size,
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      ref={ref}
      className={cn(badgeVariants({ intent, size }), className)}
      {...props}
    >
      {children}
    </span>
  );
}

Badge.displayName = "Badge";
