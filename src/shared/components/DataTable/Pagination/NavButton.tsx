import { cn } from "@shared/lib/cn";

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
  "aria-label": string;
}

export function NavButton({
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
}: NavButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn(
        "flex h-8 w-8 items-center justify-center rounded-lg border transition-colors",
        disabled
          ? "cursor-not-allowed border-neutral-100 text-neutral-300"
          : "border-neutral-200 bg-white text-neutral-600 hover:bg-primary-50 hover:text-primary-600",
      )}
    >
      {children}
    </button>
  );
}

NavButton.displayName = "NavButton";
