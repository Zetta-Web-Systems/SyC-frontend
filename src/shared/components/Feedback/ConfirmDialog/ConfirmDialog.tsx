import type { ReactNode } from "react";
import { cn } from "@shared/lib/cn";
import { Modal } from "@shared/ui";
import { Button } from "@shared/ui";
import type { ConfirmIntent, ConfirmSize } from "@shared/stores/confirm.store";
import { INTENT_CONFIG } from "@shared/constants/confirmdialog.constants";

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onTertiary?: () => void;
  intent?: ConfirmIntent;
  icon?: ReactNode;
  title: string;
  description: string;
  body?: ReactNode;
  size?: ConfirmSize;
  confirmLabel: string;
  cancelLabel?: string;
  tertiaryLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  onTertiary,
  intent = "danger",
  icon,
  title,
  description,
  body,
  size = "sm",
  confirmLabel,
  cancelLabel = "Cancelar",
  tertiaryLabel,
  isLoading = false,
}: ConfirmDialogProps) {
  const config = INTENT_CONFIG[intent];
  const Icon = config.icon;

  return (
    <Modal open={open} onClose={onClose} size={size}>
      <div className="flex flex-col items-center px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6">
        <div
          className={cn(
            "flex h-14 w-14 items-center justify-center rounded-full",
            config.iconBg,
          )}
        >
          {icon ?? (
            <Icon size={28} aria-hidden="true" className={config.iconColor} />
          )}
        </div>

        <h3 className="text-center mt-4 text-lg font-semibold text-neutral-900">
          {title}
        </h3>

        <hr className="w-full mt-3 border-neutral-200" />

        <p className="text-center mt-4 text-sm text-neutral-600">
          {description}
        </p>

        {body ? (
          <div className="mt-4 w-full max-h-[60vh] overflow-y-auto text-left">
            {body}
          </div>
        ) : null}

        {onTertiary && tertiaryLabel ? (
          <div className="flex w-full flex-col mt-6 gap-2.5">
            <Button
              variant="solid"
              intent={config.confirmIntent}
              size="md"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
            <Button
              variant="outline"
              intent="neutral"
              size="md"
              disabled={isLoading}
              onClick={onTertiary}
            >
              {tertiaryLabel}
            </Button>
            <Button
              variant="ghost"
              intent="neutral"
              size="md"
              disabled={isLoading}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
          </div>
        ) : (
          <div className="flex w-full mt-6 gap-3">
            <Button
              variant="outline"
              intent="neutral"
              size="md"
              className="flex-1"
              disabled={isLoading}
              onClick={onClose}
            >
              {cancelLabel}
            </Button>
            <Button
              variant="solid"
              intent={config.confirmIntent}
              size="md"
              className="flex-1"
              isLoading={isLoading}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </Modal>
  );
}

ConfirmDialog.displayName = "ConfirmDialog";
