import { forwardRef } from "react";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <div ref={ref} className={className} {...props}>
        {children}
      </div>
    );
  },
);

Card.displayName = "Card";
