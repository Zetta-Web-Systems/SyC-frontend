import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleAlert, TriangleAlert, Info } from "lucide-react";
import { cn } from "@shared/lib/cn";
import { Modal } from "@shared/ui/Modal/Modal";
import { Button } from "@shared/ui/Button/Button";
import type { ConfirmIntent } from "@shared/stores/confirm.store";
import type { ButtonProps } from "@shared/ui/Button/Button";

interface IntentConfig {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  confirmIntent: NonNullable<ButtonProps["intent"]>;
}

const INTENT_CONFIG: Record<ConfirmIntent, IntentConfig> = {
  success: {
    icon: CircleCheck,
    iconBg: "bg-green-100",
    iconColor: "text-success",
    confirmIntent: "primary",
  },
  danger: {
    icon: CircleAlert,
    iconBg: "bg-red-100",
    iconColor: "text-error",
    confirmIntent: "danger",
  },
  warning: {
    icon: TriangleAlert,
    iconBg: "bg-amber-100",
    iconColor: "text-warning",
    confirmIntent: "primary",
  },
  info: {
    icon: Info,
    iconBg: "bg-blue-100",
    iconColor: "text-info",
    confirmIntent: "primary",
  },
};

export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  intent?: ConfirmIntent;
  icon?: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel?: string;
  isLoading?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  intent = "danger",
  icon,
  title,
  description,
  confirmLabel,
  cancelLabel = "Cancelar",
  isLoading = false,
}: ConfirmDialogProps) {
  const config = INTENT_CONFIG[intent];
  const Icon = config.icon;

  return (
    <Modal open={open} onClose={onClose} size="sm">
      <div className="flex flex-col items-center px-4 pt-6 pb-4 sm:px-6 sm:pt-8 sm:pb-6">
        {/* Icon */}
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

        {/* Title */}
        <h3 className="mt-4 text-center text-lg font-semibold text-neutral-900">
          {title}
        </h3>

        {/* Separator */}
        <hr className="mt-3 w-full border-neutral-200" />

        {/* Description */}
        <p className="mt-4 text-center text-sm text-neutral-600">
          {description}
        </p>

        {/* Actions */}
        <div className="mt-6 flex w-full gap-3">
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
      </div>
    </Modal>
  );
}

ConfirmDialog.displayName = "ConfirmDialog";
