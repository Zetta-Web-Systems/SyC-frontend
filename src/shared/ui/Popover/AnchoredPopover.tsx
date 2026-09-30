import { useEffect } from "react";
import type { ReactNode, RefObject } from "react";
import { cn } from "@shared/lib/cn";
import { Portal } from "@shared/ui/Portal/Portal";
import type { AnchoredPopoverPosition } from "./useAnchoredPopover";

export interface AnchoredPopoverProps {
  position: AnchoredPopoverPosition | null;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}

export function AnchoredPopover({
  position,
  anchorRef,
  onClose,
  children,
  className,
}: AnchoredPopoverProps) {
  const isOpen = position !== null;

  useEffect(() => {
    if (!isOpen) return;

    function handlePointerDown(event: PointerEvent) {
      const target = event.target as Node;
      if (anchorRef.current?.contains(target)) return;
      if ((target as Element).closest?.("[data-anchored-popover]")) return;
      onClose();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("pointerdown", handlePointerDown, true);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("scroll", onClose, true);
    window.addEventListener("resize", onClose);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown, true);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("scroll", onClose, true);
      window.removeEventListener("resize", onClose);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!position) return null;

  return (
    <Portal>
      <div
        role="menu"
        data-anchored-popover=""
        style={{
          top: position.top,
          left: position.left,
          width: position.width,
        }}
        className={cn(
          "fixed z-50 rounded-xl border border-neutral-200 bg-white p-1 shadow-lg",
          className,
        )}
      >
        {children}
      </div>
    </Portal>
  );
}

AnchoredPopover.displayName = "AnchoredPopover";
