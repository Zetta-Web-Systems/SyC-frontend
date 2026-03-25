import type { ReactNode } from "react";
import { Button } from "@shared/ui";

interface NavButtonProps {
  onClick: () => void;
  disabled: boolean;
  children: ReactNode;
  "aria-label": string;
}

export function NavButton({
  onClick,
  disabled,
  children,
  "aria-label": ariaLabel,
}: NavButtonProps) {
  return (
    <Button
      variant="outline"
      intent="neutral"
      size="icon"
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      className="h-8 w-8 rounded-lg"
    >
      {children}
    </Button>
  );
}

NavButton.displayName = "NavButton";
