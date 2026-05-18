import { useEffect, useEffectEvent, useId, useRef } from "react";
import type { ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Portal } from "../Portal/Portal";
import { modalVariants } from "./Modal.variants";

export interface ModalProps extends VariantProps<typeof modalVariants> {
  ref?: Ref<HTMLDialogElement>;
  open: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  title?: string;
  className?: string;
  bodyClassName?: string;
  footer?: ReactNode;
  footerClassName?: string;
  children: ReactNode;
}

export function Modal({
  ref,
  open,
  onClose,
  closeOnBackdropClick = false,
  size,
  title,
  className,
  bodyClassName,
  footer,
  footerClassName,
  children,
}: ModalProps) {
  const internalRef = useRef<HTMLDialogElement>(null);
  const dialogRef = (ref as React.RefObject<HTMLDialogElement>) ?? internalRef;
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, dialogRef]);

  const requestClose = useEffectEvent(() => {
    onClose();
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(e: Event) {
      e.preventDefault();
      requestClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [dialogRef]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (closeOnBackdropClick && e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <Portal>
      <dialog
        ref={dialogRef}
        onClick={handleBackdropClick}
        onKeyDown={() => {}}
        aria-labelledby={title ? titleId : undefined}
        className={cn(modalVariants({ size }), className)}
      >
        {title ? (
          <>
            <header className="flex shrink-0 items-center justify-between gap-4 border-b border-neutral-200 px-6 py-4">
              <h2
                id={titleId}
                className="text-lg font-semibold text-neutral-900"
              >
                {title}
              </h2>
              <button
                type="button"
                aria-label="Cerrar"
                onClick={onClose}
                className="p-1 text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </header>
            <div
              className={cn(
                "scrollbar-hide min-h-0 flex-1 overflow-y-auto",
                bodyClassName,
              )}
            >
              {children}
            </div>
          </>
        ) : (
          <>
            <button
              type="button"
              aria-label="Cerrar"
              onClick={onClose}
              className="absolute top-4 right-4 z-10 p-1 text-neutral-400 transition-colors hover:text-neutral-600"
            >
              <X size={18} aria-hidden="true" />
            </button>
            <div
              className={cn(
                "scrollbar-hide min-h-0 flex-1 overflow-y-auto",
                bodyClassName,
              )}
            >
              {children}
            </div>
          </>
        )}
        {footer ? (
          <footer
            className={cn(
              "flex shrink-0 items-center justify-between gap-2 border-t border-neutral-100 bg-neutral-50/60 px-6 py-4",
              footerClassName,
            )}
          >
            {footer}
          </footer>
        ) : null}
      </dialog>
    </Portal>
  );
}

Modal.displayName = "Modal";
