import type { Ref } from "react";
import type { HTMLAttributes } from "react";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  asChild?: boolean;
}

export function Card({ children, className, asChild: _asChild, ref, ...props }: CardProps) {
  return (
    <div ref={ref} className={className} {...props}>
      {children}
    </div>
  );
}

Card.displayName = "Card";
