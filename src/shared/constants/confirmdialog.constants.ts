import type { LucideIcon } from "lucide-react";
import { CircleCheck, CircleAlert, TriangleAlert, Info } from "lucide-react";
import type { ButtonProps } from "@shared/ui";
import type { ConfirmIntent } from "@shared/stores/confirm.store";

interface IntentConfig {
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  confirmIntent: NonNullable<ButtonProps["intent"]>;
}

export const INTENT_CONFIG: Record<ConfirmIntent, IntentConfig> = {
  success: {
    icon: CircleCheck,
    iconBg: "bg-success/15",
    iconColor: "text-success",
    confirmIntent: "primary",
  },
  danger: {
    icon: CircleAlert,
    iconBg: "bg-error/15",
    iconColor: "text-error",
    confirmIntent: "danger",
  },
  warning: {
    icon: TriangleAlert,
    iconBg: "bg-warning/15",
    iconColor: "text-warning",
    confirmIntent: "primary",
  },
  info: {
    icon: Info,
    iconBg: "bg-info/15",
    iconColor: "text-info",
    confirmIntent: "primary",
  },
};
