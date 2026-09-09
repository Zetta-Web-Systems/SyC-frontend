import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";

export type PopoverItemTone =
  | "neutral"
  | "primary"
  | "success"
  | "warning"
  | "danger";

const POPOVER_ITEM_ICON_TONES: Record<PopoverItemTone, string> = {
  neutral: "text-neutral-400",
  primary: "text-primary-500",
  success: "text-success",
  warning: "text-warning",
  danger: "text-error",
};

export interface PopoverItemProps {
  children: ReactNode;
  onClick?: () => void;
  icon?: ReactNode;
  iconTone?: PopoverItemTone;
  description?: ReactNode;
  variant?: "default" | "danger";
  disabled?: boolean;
  title?: string;
  className?: string;
}

export function PopoverItem({
  children,
  onClick,
  icon,
  iconTone,
  description,
  variant = "default",
  disabled = false,
  title,
  className,
}: PopoverItemProps) {
  const isDanger = variant === "danger";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "flex w-full gap-2 rounded-lg px-2 py-2 text-left text-sm font-medium transition-colors",
        description ? "items-start" : "items-center",
        !isDanger &&
          "text-neutral-700 hover:bg-neutral-100 hover:text-neutral-900",
        isDanger && "text-error hover:bg-red-50",
        disabled &&
          "cursor-not-allowed text-neutral-300 hover:bg-transparent hover:text-neutral-300",
        className,
      )}
    >
      {icon && (
        <span
          className={cn(
            "shrink-0 [&>svg]:h-4 [&>svg]:w-4",
            description && "mt-0.5",
            !isDanger &&
              !disabled &&
              iconTone &&
              POPOVER_ITEM_ICON_TONES[iconTone],
          )}
        >
          {icon}
        </span>
      )}

      {description ? (
        <span className="flex min-w-0 flex-col">
          {children}

          <span
            className={cn(
              "mt-0.5 text-xs font-normal",
              isDanger ? "text-error/70" : "text-neutral-400",
              disabled && "text-neutral-300",
            )}
          >
            {description}
          </span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

PopoverItem.displayName = "PopoverItem";
