import type { Ref } from "react";
import type { HTMLAttributes } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { cardVariants } from "./Card.variants";

export interface CardProps
  extends HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {
  ref?: Ref<HTMLDivElement>;
  asChild?: boolean;
}

export function Card({
  children,
  className,
  surface,
  padding,
  interactive,
  selected,
  asChild: _asChild,
  ref,
  ...props
}: CardProps) {
  return (
    <div
      ref={ref}
      className={cn(
        cardVariants({ surface, padding, interactive, selected }),
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}

Card.displayName = "Card";
