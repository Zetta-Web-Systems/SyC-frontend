import { CircleCheck, CircleAlert, TriangleAlert, Info } from "lucide-react";

export const INTENT_ICONS = {
  success: CircleCheck,
  error: CircleAlert,
  warning: TriangleAlert,
  info: Info,
} as const;
