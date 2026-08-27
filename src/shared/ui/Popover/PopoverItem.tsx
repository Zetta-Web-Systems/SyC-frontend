import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export interface PopoverItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
  title?: string;
  className?: string;
}

export function PopoverItem({
  children,
  onClick,
  icon,
  variant = "default",
  disabled = false,
  title,
  className,
}: PopoverItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex w-full items-center gap-2 rounded-lg px-2 py-2 text-sm font-medium transition-colors",
        variant === "default" &&
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        variant === "danger" && "text-error hover:bg-red-50",
        disabled &&
          "cursor-not-allowed text-neutral-300 hover:bg-transparent hover:text-neutral-300",
        className,
      )}
    >
      {icon && <span className="shrink-0 [&>svg]:h-4 [&>svg]:w-4">{icon}</span>}
      {children}
    </button>
  );
}

PopoverItem.displayName = "PopoverItem";
