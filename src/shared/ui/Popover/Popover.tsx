import { useEffect, useRef } from "react";
import type { ReactNode, Ref } from "react";
import type { Side, Align } from "@shared/types/floating.types";
import { cn } from "@shared/lib/cn";
import { getSideClasses } from "@shared/utils/popover.utils";

export interface PopoverProps {
  ref?: Ref<HTMLDivElement>;
  open: boolean;
  onClose: () => void;
  trigger: ReactNode;
  children: ReactNode;
  side?: Side;
  align?: Align;
  className?: string;
}

export function Popover({
  ref,
  open,
  onClose,
  trigger,
  children,
  side = "right",
  align = "end",
  className,
}: PopoverProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  return (
    <div ref={containerRef} className="relative">
      {trigger}

      {open && (
        <div
          ref={ref}
          role="menu"
          className={cn(
            "absolute z-50 min-w-56 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg",
            getSideClasses(side, align),
            className,
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

Popover.displayName = "Popover";
