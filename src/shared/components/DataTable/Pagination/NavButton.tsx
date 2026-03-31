import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
  "aria-label": string;
  className?: string;
}

export function NavButton({
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
  className,
}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-neutral-600 transition-colors",
        "hover:bg-neutral-100 hover:text-neutral-900",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

NavButton.displayName = "NavButton";
