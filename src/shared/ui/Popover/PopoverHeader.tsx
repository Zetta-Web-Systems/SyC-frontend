import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export interface PopoverHeaderProps {
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export function PopoverHeader({
  title,
  description,
  className,
}: PopoverHeaderProps) {
  return (
    <div className={cn("px-2 pt-1 pb-2", className)}>
      <p className="text-[11.5px] font-bold tracking-wide text-neutral-400 uppercase">
        {title}
      </p>

      {description && (
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      )}
    </div>
  );
}

PopoverHeader.displayName = "PopoverHeader";
