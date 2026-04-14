import { ChevronDown } from "lucide-react";
import { useRef } from "react";
import type { HTMLAttributes, ReactNode, Ref } from "react";
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
  const initialized = useRef(false);
  const setInitialOpen = (el: HTMLDetailsElement | null) => {
    if (el && !initialized.current) {
      initialized.current = true;
      if (defaultOpen) el.open = true;
    }
    if (typeof ref === "function") ref(el);
    else if (ref) ref.current = el;
  };

  return (
    <details
      ref={setInitialOpen}
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
