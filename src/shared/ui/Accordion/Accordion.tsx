import type { HTMLAttributes, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import { accordionVariants } from "./Accordion.variants";

export interface AccordionProps
  extends
    HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof accordionVariants> {
  ref?: Ref<HTMLDivElement>;
}

export function Accordion({
  ref,
  variant,
  className,
  children,
  ...props
}: AccordionProps) {
  return (
    <div
      ref={ref}
      className={cn(accordionVariants({ variant }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

Accordion.displayName = "Accordion";
