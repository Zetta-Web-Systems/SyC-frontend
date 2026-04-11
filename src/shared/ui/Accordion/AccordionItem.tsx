import { ChevronDown } from "lucide-react";
import { useState } from "react";
import type { HTMLAttributes, ReactNode, Ref, SyntheticEvent } from "react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "@shared/lib/cn";
import {
  accordionContentVariants,
  accordionItemVariants,
  accordionSummaryVariants,
} from "./Accordion.variants";

export interface AccordionItemProps
  extends
    Omit<HTMLAttributes<HTMLDetailsElement>, "title">,
    VariantProps<typeof accordionItemVariants> {
  ref?: Ref<HTMLDetailsElement>;
  title: ReactNode;
  trailing?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export function AccordionItem({
  ref,
  variant,
  title,
  trailing,
  defaultOpen = true,
  disabled = false,
  className,
  children,
  ...props
}: AccordionItemProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = (event: SyntheticEvent<HTMLDetailsElement>) => {
    setOpen(event.currentTarget.open);
  };

  return (
    <details
      ref={ref}
      open={open}
      onToggle={handleToggle}
      className={cn(accordionItemVariants({ variant }), className)}
      {...props}
    >
      <summary
        className={accordionSummaryVariants({ disabled })}
        onClick={disabled ? (e) => e.preventDefault() : undefined}
      >
        <ChevronDown
          size={16}
          aria-hidden="true"
          className="shrink-0 text-neutral-500 transition-transform group-open:rotate-180"
        />
        <span className="flex justify-start">{title}</span>
        {trailing}
      </summary>
      <div className={accordionContentVariants()}>{children}</div>
    </details>
  );
}

AccordionItem.displayName = "AccordionItem";
