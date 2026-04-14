import type { Ref } from "react";
import { cn } from "@shared/lib/cn";

interface MarkdownToolbarButtonProps {
  ref?: Ref<HTMLButtonElement>;
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
}

export function MarkdownToolbarButton({
  ref,
  onClick,
  active,
  disabled,
  label,
  children,
}: MarkdownToolbarButtonProps) {
  return (
    <button
      ref={ref}
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-pressed={active}
      data-active={active ? "true" : undefined}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-600 transition-colors",
        "hover:bg-neutral-100 hover:text-neutral-900",
        "data-[active=true]:bg-primary-50 data-[active=true]:text-primary-700",
        "disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      {children}
    </button>
  );
}
