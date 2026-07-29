import { useEffect, useState } from "react";
import type { ReactNode, Ref } from "react";
import { cn } from "@shared/lib/cn";
import { Portal } from "../Portal/Portal";

const DEFAULT_ANIMATION_MS = 280;

export interface DrawerProps {
  ref?: Ref<HTMLElement>;
  open: boolean;
  onClose: () => void;
  side?: "left" | "right";
  widthClassName?: string;
  closeOnEsc?: boolean;
  closeOnBackdropClick?: boolean;
  modal?: boolean;
  ariaLabel: string;
  animationMs?: number;
  className?: string;
  onAfterClose?: () => void;
  children: ReactNode;
}

export function Drawer({
  ref,
  open,
  onClose,
  side = "right",
  widthClassName = "w-100",
  closeOnEsc = true,
  closeOnBackdropClick = false,
  modal = false,
  ariaLabel,
  animationMs = DEFAULT_ANIMATION_MS,
  className,
  onAfterClose,
  children,
}: DrawerProps) {
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (open) {
      setMounted(true);
      const id = window.requestAnimationFrame(() => setVisible(true));
      return () => window.cancelAnimationFrame(id);
    }
    setVisible(false);
    const t = window.setTimeout(() => {
      setMounted(false);
      onAfterClose?.();
    }, animationMs);
    return () => window.clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, animationMs]);

  useEffect(() => {
    if (!open || !closeOnEsc) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [open, closeOnEsc, onClose]);

  if (!mounted) return null;

  const offscreen = side === "right" ? "translate-x-full" : "-translate-x-full";

  return (
    <Portal>
      <div
        role="presentation"
        onClick={
          closeOnBackdropClick
            ? (e) => {
                if (e.target === e.currentTarget) onClose();
              }
            : undefined
        }
        className={cn(
          "fixed inset-0 z-40",
          modal
            ? cn(
                "bg-black/30 transition-opacity duration-300",
                visible ? "opacity-100" : "opacity-0",
              )
            : "pointer-events-none",
        )}
      >
        <aside
          ref={ref}
          role="dialog"
          aria-modal={modal}
          aria-label={ariaLabel}
          className={cn(
            "pointer-events-auto absolute top-0 flex h-full max-w-full flex-col bg-white shadow-2xl transition-transform duration-300 ease-out",
            side === "right" ? "right-0" : "left-0",
            widthClassName,
            visible ? "translate-x-0" : offscreen,
            className,
          )}
        >
          {children}
        </aside>
      </div>
    </Portal>
  );
}

Drawer.displayName = "Drawer";
