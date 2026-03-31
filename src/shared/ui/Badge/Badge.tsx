import type { HTMLAttributes, ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { badgeVariants, badgeIconVariants } from "./Badge.variants";

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
  ref?: Ref<HTMLSpanElement>;
  icon?: ReactNode;
}

export function Badge({
  ref,
  intent,
  size,
  icon,
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
      {icon && (
        <span
          aria-hidden="true"
          className={badgeIconVariants({ intent, size })}
        >
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

Badge.displayName = "Badge";
