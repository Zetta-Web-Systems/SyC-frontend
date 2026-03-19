import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export interface PopoverItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  className?: string;
}

export function PopoverItem({
  children,
  onClick,
  icon,
  variant = "default",
  className,
}: PopoverItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
        variant === "default" &&
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        variant === "danger" && "text-error hover:bg-red-50",
        className,
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </button>
  );
}

PopoverItem.displayName = "PopoverItem";
