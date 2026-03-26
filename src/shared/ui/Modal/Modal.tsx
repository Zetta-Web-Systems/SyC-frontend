import { useEffect, useRef } from "react";
import type { ReactNode, Ref } from "react";
import type { VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { modalVariants } from "./Modal.variants";

export interface ModalProps extends VariantProps<typeof modalVariants> {
  ref?: Ref<HTMLDialogElement>;
  open: boolean;
  onClose: () => void;
  closeOnBackdropClick?: boolean;
  className?: string;
  children: ReactNode;
}

export function Modal({
  ref,
  open,
  onClose,
  closeOnBackdropClick = false,
  size,
  className,
  children,
}: ModalProps) {
  const internalRef = useRef<HTMLDialogElement>(null);
  const dialogRef = (ref as React.RefObject<HTMLDialogElement>) ?? internalRef;

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open, dialogRef]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    function handleCancel(e: Event) {
      e.preventDefault();
      onClose();
    }

    dialog.addEventListener("cancel", handleCancel);
    return () => dialog.removeEventListener("cancel", handleCancel);
  }, [onClose, dialogRef]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDialogElement>) {
    if (closeOnBackdropClick && e.target === dialogRef.current) {
      onClose();
    }
  }

  return (
    <dialog
      ref={dialogRef}
      onClick={handleBackdropClick}
      onKeyDown={() => {}}
      className={cn(modalVariants({ size }), className)}
    >
      <button
        type="button"
        aria-label="Cerrar"
        onClick={onClose}
        className="absolute top-4 right-4 p-1 text-neutral-400 transition-colors hover:text-neutral-600"
      >
        <X size={18} aria-hidden="true" />
      </button>

      {children}
    </dialog>
  );
}

Modal.displayName = "Modal";
