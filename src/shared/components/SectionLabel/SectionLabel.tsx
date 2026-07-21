import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export interface SectionLabelProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "title"
> {
  title: ReactNode;
  trailing?: ReactNode;
}

export function SectionLabel({
  title,
  trailing,
  className,
  ...props
}: SectionLabelProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between px-3 pt-2 pb-1",
        className,
      )}
      {...props}
    >
      <span className="text-xs font-bold tracking-wider text-neutral-400 uppercase">
        {title}
      </span>
      {trailing !== undefined && (
        <span className="text-xs font-semibold text-neutral-400">
          {trailing}
        </span>
      )}
    </div>
  );
}

SectionLabel.displayName = "SectionLabel";
