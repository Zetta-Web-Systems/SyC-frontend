import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

interface PageHeaderProps {
  title: string;
  description?: string;
  actions?: ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  description,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-start justify-between gap-4 border-b border-neutral-200 pb-4",
        className,
      )}
    >
      <div className="min-w-0">
        <h1 className="text-neutral-900">{title}</h1>
        {description && (
          <p className="mt-1 text-xs text-neutral-500 xs:text-sm">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 items-start gap-2 mt-1">{actions}</div>
      )}
    </div>
  );
}
